/**
 * CreatorProfile.jsx — "MAISON NOIR" reference design
 *
 * Layout:
 *   [Left Sidebar Nav] | [Cover + Profile Card] | [Right Rail: Featured Outfits + Recent Posts]
 *
 * Data sources:
 *   GET /api/outfits/creator/:id  → creator profile + featured outfits
 *   GET /api/selfies/public?userId=:id&limit=6  → recent posts grid
 *   POST /api/follows/:id/toggle  → follow / unfollow
 *   POST /api/outfits/:id/saves/toggle  → save outfit
 */

import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { formatFollowers, getInitials, withHost } from "../utils/outfitHelpers";
import "./CreatorProfile.css";
import "./CreatorProfile.css";
// ── Mini outfit canvas inside featured card ──────────────────────────────────
const TONES = [
  ["#f7e3d4", "#efc6af"], ["#e6ece7", "#c9d6cf"], ["#f0e7db", "#e0cbb8"],
  ["#f4dfd7", "#e8c5b6"], ["#e6d8c8", "#d4b59e"], ["#e5efe8", "#c2d7c8"],
];

function MiniCanvas({ outfit, index }) {
  const items = (outfit.items || []).slice(0, 5);
  const seed = outfit.id ?? index;
  return (
    <div className="cp-feat-canvas">
      {items.map((item, idx) => {
        const cols = 2;
        const cellW = 46;
        const cellH = 50;
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const left = col * (cellW + 6) + 8;
        const top = row * (cellH + 6) + 8;
        const tone = TONES[(seed + idx) % TONES.length];
        return (
          <div key={idx} className="cp-feat-canvas-item" style={{
            left, top, width: cellW, height: cellH,
            background: `linear-gradient(135deg,${tone[0]},${tone[1]})`,
          }}>
            {item.imageUrl && (
              <img src={withHost(item.imageUrl)} alt={item.displayName || ""} />
            )}
          </div>
        );
      })}
      {items.length === 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 28
        }}>👗</div>
      )}
    </div>
  );
}

// ── Featured outfit card ─────────────────────────────────────────────────────
function FeaturedCard({ outfit, index, onNavigate }) {
  const [saved, setSaved] = useState(Boolean(outfit.isSavedByMe));
  const [saving, setSaving] = useState(false);

  const toggleSave = async (e) => {
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    setSaved(v => !v);
    try { await api.post(`/outfits/${outfit.id}/saves/toggle`); }
    catch { setSaved(v => !v); }
    finally { setSaving(false); }
  };

  return (
    <div className="cp-feat-card" onClick={() => onNavigate(outfit.id)}>
      <div className="cp-feat-thumb">
        <MiniCanvas outfit={outfit} index={index} />
        <button className={`cp-save-btn${saved ? " saved" : ""}`} onClick={toggleSave}>
          Save {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="cp-feat-name">{outfit.name || "Untitled"}</div>
    </div>
  );
}

// ── Recent post cell ─────────────────────────────────────────────────────────
function PostCell({ post }) {
  const img = post.imageUrl ?? post.ImageUrl;
  return (
    <div className="cp-post-cell">
      {img
        ? <img src={withHost(img)} alt={post.caption || "Post"} />
        : <div className="cp-post-placeholder">📸</div>
      }
    </div>
  );
}

// Sidebar replaced by components/Sidebar.jsx

// ══════════════════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════════════════
export default function CreatorProfile() {
  const navigate = useNavigate();
  const { creatorId } = useParams();

  const [creator, setCreator] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followBusy, setFollowBusy] = useState(false);

  // ── Load creator + outfits ─────────────────────────────────────────────────
  useEffect(() => {
    if (!creatorId) { setError("Creator ID missing."); setLoading(false); return; }
    setLoading(true);
    setError("");

    const loadMain = api.get(`/outfits/creator/${creatorId}`);
    const loadPosts = api.get(`/selfies/public?userId=${creatorId}&limit=6`);

    Promise.allSettled([loadMain, loadPosts]).then(([mainRes, postsRes]) => {
      // ── Outfits + profile ───────────────────────────────────────────────
      if (mainRes.status === "fulfilled") {
        const payload = mainRes.value.data ?? {};
        const raw = payload.creator ?? payload.Creator;
        if (raw) {
          const c = {
            id: raw.id ?? raw.Id ?? creatorId,
            fullName: raw.fullName ?? raw.FullName ?? "Creator",
            handle: raw.handle ?? raw.Handle ?? "",
            profileImage: raw.profileImage ?? raw.ProfileImage ?? null,
            coverImage: raw.coverImage ?? raw.CoverImage ?? null,
            bio: raw.bio ?? raw.Bio ?? "",
            location: raw.location ?? raw.Location ?? "",
            styleTags: raw.styleTags ?? raw.StyleTags ?? [],
            socialLinks: raw.socialLinks ?? raw.SocialLinks ?? {},
            followers: raw.followers ?? raw.Followers ?? 0,
            following: raw.following ?? raw.Following ?? 0,
            isFollowing: Boolean(raw.isFollowing ?? raw.IsFollowing),
            outfitsShared: raw.outfitsShared ?? raw.OutfitsShared ?? 0,
            postsCount: raw.postsCount ?? raw.PostsCount ?? 0,
            mutualFollowers: raw.mutualFollowers ?? raw.MutualFollowers ?? [],
          };
          setCreator(c);
        } else {
          setError("Creator profile unavailable.");
        }
        const arr = Array.isArray(payload.outfits ?? payload.Outfits)
          ? (payload.outfits ?? payload.Outfits) : [];
        setOutfits(arr.slice(0, 3));   // show top 3 as "featured"
      } else {
        setError(mainRes.reason?.response?.data?.message ?? "Could not load creator.");
      }

      // ── Recent posts ────────────────────────────────────────────────────
      if (postsRes.status === "fulfilled") {
        const data = postsRes.value.data;
        setPosts(Array.isArray(data) ? data.slice(0, 6) : []);
      }
    }).finally(() => setLoading(false));
  }, [creatorId]);

  // ── Optimistic follow toggle ───────────────────────────────────────────────
  const handleFollow = useCallback(async () => {
    if (!creator || followBusy) return;
    const snap = { isFollowing: creator.isFollowing, followers: creator.followers };
    setCreator(c => ({
      ...c,
      isFollowing: !c.isFollowing,
      followers: c.isFollowing ? c.followers - 1 : c.followers + 1,
    }));
    setFollowBusy(true);
    try {
      const res = await api.post(`/follows/${creator.id}/toggle`);
      const { following, followerCount } = res.data || {};
      setCreator(c => ({
        ...c,
        isFollowing: Boolean(following),
        followers: typeof followerCount === "number" ? followerCount : c.followers,
      }));
    } catch (err) {
      setCreator(c => ({ ...c, ...snap }));
      setError(err.response?.status === 401 ? "Please log in to follow." : "Failed to update follow.");
    } finally {
      setFollowBusy(false);
    }
  }, [creator, followBusy]);

  // ── Loading / error states ─────────────────────────────────────────────────
  if (loading) return (
    <div style={{ width: "100%" }}>
      <div className="cp-loading">
        <div className="cp-spinner" /> Loading profile…
      </div>
    </div>
  );

  if (!creator && error) return (
    <div style={{ width: "100%" }}>
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "#8B2C1A" }}>{error}</p>
        <button onClick={() => navigate("/outfits/public")}
          style={{
            marginTop: 12, padding: "8px 20px", borderRadius: 8,
            border: "none", background: "#C06038", color: "#fff", cursor: "pointer"
          }}>
          ← Back to feed
        </button>
      </div>
    </div>
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  const coverUrl = creator.coverImage ? withHost(creator.coverImage) : null;
  const avatarUrl = creator.profileImage ? withHost(creator.profileImage) : null;

  // Alternate filled style tags (every other one gets terracotta fill)
  const tagsFilled = new Set(
    (creator.styleTags || []).filter((_, i) => i % 3 === 2)
  );

  return (
    <div style={{ width: "100%" }}>
      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="cp-main">

        {/* ── Centre panel ─────────────────────────────────────────────── */}
        <section className="cp-center">

          {/* Cover photo */}
          {coverUrl
            ? <img src={coverUrl} alt="Cover" className="cp-cover" />
            : <div className="cp-cover" />
          }

          {/* Profile card */}
          <div className="cp-profile-card">

            {/* Avatar (overlaps cover) */}
            <div className="cp-avatar-wrap">
              {avatarUrl
                ? <img src={avatarUrl} alt={creator.fullName} className="cp-avatar" />
                : <div className="cp-avatar-fallback">{getInitials(creator.fullName)}</div>
              }
            </div>

            {/* Name */}
            <h1 className="cp-name">{creator.fullName}</h1>

            {/* Handle + Location */}
            <div className="cp-handle-row">
              {creator.handle && (
                <span className="cp-handle">@{creator.handle}</span>
              )}
              {creator.location && (
                <span className="cp-location">📍 {creator.location}</span>
              )}
            </div>

            {/* Action row */}
            <div className="cp-action-row">
              <button
                className={`cp-btn-follow${creator.isFollowing ? " following" : ""}`}
                onClick={handleFollow}
                disabled={followBusy}
              >
                {followBusy ? "…" : creator.isFollowing ? "✓ Following" : "Follow"}
              </button>

              <button className="cp-btn-message">Message</button>

              {/* Mutual followers */}
              {creator.mutualFollowers?.length > 0 && (
                <div className="cp-mutual">
                  <div className="cp-mutual-avatars">
                    {creator.mutualFollowers.slice(0, 3).map((mf, i) => (
                      mf.profileImage
                        ? <img key={i} src={withHost(mf.profileImage)} alt={mf.fullName} />
                        : <div key={i} className="cp-mutual-av">{getInitials(mf.fullName)}</div>
                    ))}
                  </div>
                  <span>
                    + {creator.mutualFollowers.length} mutual
                    {creator.mutualFollowers.length === 1 ? " follower" : " followers"}
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="cp-stats">
              {[
                { label: "Posts", value: creator.postsCount ?? 0 },
                { label: "Followers", value: formatFollowers(creator.followers) },
                { label: "Following", value: formatFollowers(creator.following) },
                { label: "Outfits Shared", value: creator.outfitsShared ?? outfits.length },
              ].map(st => (
                <div key={st.label} className="cp-stat-box">
                  <div className="cp-stat-label">{st.label}</div>
                  <div className="cp-stat-val">{st.value}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            {creator.bio && <p className="cp-bio">{creator.bio}</p>}

            {/* Style tags */}
            {creator.styleTags?.length > 0 && (
              <div className="cp-tags">
                {creator.styleTags.map(tag => (
                  <span key={tag} className={`cp-tag${tagsFilled.has(tag) ? " filled" : ""}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error banner */}
          {error && <div className="cp-error-banner">{error}</div>}
        </section>

        {/* ── Right rail ───────────────────────────────────────────────── */}
        <aside className="cp-rail">

          {/* Featured outfits */}
          <section>
            <div className="cp-section-title">Featured Outfits</div>
            {outfits.length > 0 ? (
              <div className="cp-feat-row">
                {outfits.map((outfit, i) => (
                  <FeaturedCard
                    key={outfit.id ?? i}
                    outfit={outfit}
                    index={i}
                    onNavigate={(id) => navigate(`/outfits/public?highlight=${id}`)}
                  />
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#8A7060" }}>
                No public outfits yet.
              </p>
            )}
          </section>

          {/* Recent posts */}
          <section>
            <div className="cp-section-title">Recent Posts</div>
            {posts.length > 0 ? (
              <div className="cp-posts-grid">
                {posts.map((post, i) => (
                  <PostCell key={post.id ?? i} post={post} />
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#8A7060" }}>
                No posts shared yet.
              </p>
            )}
          </section>

        </aside>
      </main>
    </div>
  );
}
