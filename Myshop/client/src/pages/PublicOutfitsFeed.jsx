import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  clamp,
  formatDate,
  formatFollowers,
  getInitials,
  getProductItemIds,
  seedNumber,
  withHost,
} from "../utils/outfitHelpers";
import "./PublicOutfitsFeed.css";

const ITEM_SIZE = 110;
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 230;

const NOW = Date.now();
const daysAgo = (days) => new Date(NOW - days * 24 * 60 * 60 * 1000).toISOString();

const FALLBACK_OUTFITS = [
  {
    id: "seed-1",
    name: "Linen Gallery Walk",
    createdByName: "Nora Vale",
    description: "Soft neutrals and light tailoring for gallery afternoons.",
    createdAt: daysAgo(1),
    items: [
      { id: "seed-1-a", displayName: "Linen blazer", positionX: 16, positionY: 18 },
      { id: "seed-1-b", displayName: "Wrap skirt", positionX: 162, positionY: 62 },
      { id: "seed-1-c", displayName: "Leather flats", positionX: 86, positionY: 128 },
    ],
  },
  {
    id: "seed-2",
    name: "Studio Black Layers",
    createdByName: "Iris Stone",
    description: "Sculpted darks with a soft sheen and clean lines.",
    createdAt: daysAgo(3),
    items: [
      { id: "seed-2-a", displayName: "Long coat", positionX: 24, positionY: 10 },
      { id: "seed-2-b", displayName: "Tapered pants", positionX: 150, positionY: 84 },
      { id: "seed-2-c", displayName: "Ankle boots", positionX: 90, positionY: 140 },
    ],
  },
  {
    id: "seed-3",
    name: "Coastal Morning Set",
    createdByName: "Mara Lane",
    description: "Airy knits, warm sand tones, and light accessories.",
    createdAt: daysAgo(5),
    items: [
      { id: "seed-3-a", displayName: "Open knit", positionX: 12, positionY: 24 },
      { id: "seed-3-b", displayName: "Wide leg pants", positionX: 170, positionY: 52 },
      { id: "seed-3-c", displayName: "Canvas tote", positionX: 96, positionY: 136 },
    ],
  },
  {
    id: "seed-4",
    name: "Street Luxe Utility",
    createdByName: "Jade Kim",
    description: "Utility cargo pieces with polished metallic accents.",
    createdAt: daysAgo(2),
    items: [
      { id: "seed-4-a", displayName: "Structured jacket", positionX: 18, positionY: 16 },
      { id: "seed-4-b", displayName: "Cargo skirt", positionX: 168, positionY: 62 },
      { id: "seed-4-c", displayName: "High tops", positionX: 96, positionY: 132 },
    ],
  },
  {
    id: "seed-5",
    name: "Coffee Toned Office",
    createdByName: "Theo Hart",
    description: "Warm browns with sharp tailoring and soft texture.",
    createdAt: daysAgo(7),
    items: [
      { id: "seed-5-a", displayName: "Tailored blazer", positionX: 18, positionY: 18 },
      { id: "seed-5-b", displayName: "Wide trousers", positionX: 164, positionY: 72 },
      { id: "seed-5-c", displayName: "Loafers", positionX: 92, positionY: 138 },
    ],
  },
  {
    id: "seed-6",
    name: "Resort Ready",
    createdByName: "Pia Noor",
    description: "Bright linen layers with a relaxed silhouette.",
    createdAt: daysAgo(4),
    items: [
      { id: "seed-6-a", displayName: "Linen shirt", positionX: 20, positionY: 18 },
      { id: "seed-6-b", displayName: "Pleated shorts", positionX: 160, positionY: 70 },
      { id: "seed-6-c", displayName: "Strappy sandals", positionX: 92, positionY: 130 },
    ],
  },
];

const FALLBACK_SELFIES = FALLBACK_OUTFITS.map((outfit, index) => ({
  id: `selfie-seed-${index + 1}`,
  userId: null,
  userName: outfit.createdByName,
  caption: `Selfie check: ${outfit.name}.`,
  createdAt: outfit.createdAt,
  imageUrl: null,
}));

const FEATURE_CHIPS = [
  { title: "Follow creators", caption: "Stay close to their newest drops." },
  { title: "Like outfits", caption: "Save the looks that spark you." },
  { title: "Comment", caption: "Give feedback and styling notes." },
  { title: "Public selfies", caption: "Share a selfie to the public feed." },
  { title: "Trending outfits", caption: "Track what is rising today." },
];

const COLOR_STORIES = [
  { name: "Cocoa", tone: "#7c5f4c" },
  { name: "Clay", tone: "#c4765a" },
  { name: "Seafoam", tone: "#6d8c80" },
  { name: "Ivory", tone: "#f4eee6" },
];

const ITEM_TONES = [
  ["#f7e3d4", "#efc6af"],
  ["#e6ece7", "#c9d6cf"],
  ["#f0e7db", "#e0cbb8"],
  ["#f4dfd7", "#e8c5b6"],
  ["#e6d8c8", "#d4b59e"],
  ["#e5efe8", "#c2d7c8"],
];

const TRENDING_HASHTAGS = [
  { tag: "#StreetStyle", count: "12.4k" },
  { tag: "#SpringEdit", count: "8.9k" },
  { tag: "#VintageFinds", count: "6.2k" },
  { tag: "#OOTD", count: "45k" },
  { tag: "#SlowFashion", count: "3.1k" },
];

const TRENDING_COLORS_RAIL = [
  { name: "Ivory", tone: "#f5f0e8" },
  { name: "Terracotta", tone: "#c4765a" },
  { name: "Sage", tone: "#7a9e7e" },
  { name: "Ecru", tone: "#d9cfc0" },
  { name: "Cobalt", tone: "#2a57a4" },
  { name: "Chocolate", tone: "#5a3320" },
];

const LEFT_NAV_LINKS = [
  { id: "home", label: "Home Feed", icon: "🏠", mode: "trending" },
  { id: "trending", label: "Trending", icon: "🔥", mode: "trending" },
  { id: "following", label: "Following", icon: "👤", mode: "following" },
  { id: "discover", label: "Discover", icon: "🔍", mode: "new" },
  { id: "saved", label: "Saved Posts", icon: "🔖", mode: null },
];

const SHOP_ITEM_PRICES = [
  285, 210, 425, 295, 189, 340, 175, 260, 390, 145,
  320, 230, 480, 160, 275, 199, 350, 220, 310, 400,
];

const COMMENT_SEEDS = [
  { userName: "Lia", text: "The proportions feel clean and elevated." },
  { userName: "Mina", text: "Those neutrals look expensive." },
  { userName: "Owen", text: "Great mix of texture and structure." },
  { userName: "Ava", text: "Perfect palette for daytime looks." },
  { userName: "Ezra", text: "The silhouettes are sharp." },
];

const buildSeedComments = (key) => {
  const seed = seedNumber(key);
  const first = COMMENT_SEEDS[seed % COMMENT_SEEDS.length];
  const second = COMMENT_SEEDS[(seed + 2) % COMMENT_SEEDS.length];
  return [
    { id: `${key}-seed-1`, ...first },
    { id: `${key}-seed-2`, ...second },
  ];
};

export default function PublicOutfitsFeed() {
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState([]);
  const [selfies, setSelfies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useFallback, setUseFallback] = useState(false);
  const [useSelfieFallback, setUseSelfieFallback] = useState(false);
  const [boards, setBoards] = useState([]);
  const [activeFeed, setActiveFeed] = useState("trending");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [openComments, setOpenComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentsByOutfit, setCommentsByOutfit] = useState({});
  const [commentsLoading, setCommentsLoading] = useState({});
  const [buyLoading, setBuyLoading] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [storyIndex, setStoryIndex] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyUploading, setStoryUploading] = useState(false);
  const [storyUploadOpen, setStoryUploadOpen] = useState(false);
  const [storyUploadFile, setStoryUploadFile] = useState(null);
  const [storyUploadCaption, setStoryUploadCaption] = useState("");
  const [storyUploadPublic, setStoryUploadPublic] = useState(true);

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const res = await api.get("/outfits/public");
        setOutfits(Array.isArray(res.data) ? res.data : []);
        setError("");
        setUseFallback(false);
      } catch (err) {
        console.error("Error loading public outfits:", err);
        setError("Unable to reach the live feed. Showing curated picks instead.");
        setUseFallback(true);
      } finally {
        setLoading(false);
      }
    };

    const loadSelfies = async () => {
      try {
        const res = await api.get("/selfies/public");
        setSelfies(Array.isArray(res.data) ? res.data : []);
        setUseSelfieFallback(false);
      } catch (err) {
        console.error("Error loading public selfies:", err);
        setUseSelfieFallback(true);
      }
    };

    const loadBoards = async () => {
      try {
        const res = await api.get("/outfit-boards/me");
        setBoards(Array.isArray(res.data) ? res.data : []);
      } catch {
        setBoards([]);
      }
    };

    loadOutfits();
    loadSelfies();
    loadBoards();
  }, []);

  const resolvedOutfits = useFallback ? FALLBACK_OUTFITS : outfits;
  const resolvedSelfies = useSelfieFallback ? FALLBACK_SELFIES : selfies;

  const enrichedOutfits = useMemo(
    () =>
      resolvedOutfits.map((outfit, index) => {
        const key = outfit.id ? `outfit-${outfit.id}` : `seed-${index}`;
        const isFallback = useFallback || typeof outfit.id !== "number";
        const tags = Array.isArray(outfit.tags)
          ? outfit.tags
            .map((tag) => String(tag).trim())
            .filter(Boolean)
          : [];
        const createdAt = outfit.createdAt ?? daysAgo(index + 2);
        const createdByName = outfit.createdByName || "Style Creator";
        const creatorImage =
          outfit.creatorImage ||
          outfit.createdByImage ||
          outfit.creatorAvatar ||
          outfit.creatorProfileImage ||
          outfit.profileImage ||
          outfit.userProfileImage ||
          outfit.avatarUrl ||
          outfit.createdByAvatar ||
          null;
        const creatorKey = outfit.userId || outfit.createdById || createdByName || key;
        return {
          ...outfit,
          key,
          type: "outfit",
          isFallback,
          tags,
          createdAt,
          createdByName,
          creatorImage,
          creatorAvatar: creatorImage,
          creatorKey,
          creatorFollowers: typeof outfit.creatorFollowers === "number" ? outfit.creatorFollowers : 0,
          isLikedByMe: Boolean(outfit.isLikedByMe),
          isSavedByMe: Boolean(outfit.isSavedByMe),
          isFollowingCreator: Boolean(outfit.isFollowingCreator),
          stats: {
            likeCount: typeof outfit.likeCount === "number" ? outfit.likeCount : 0,
            commentCount: typeof outfit.commentCount === "number" ? outfit.commentCount : 0,
            saveCount: typeof outfit.saveCount === "number" ? outfit.saveCount : 0,
          },
        };
      }),
    [resolvedOutfits, useFallback]
  );

  const enrichedSelfies = useMemo(
    () =>
      resolvedSelfies.map((selfie, index) => {
        const key = selfie.id ? `selfie-${selfie.id}` : `selfie-${index}`;
        const isFallback = useSelfieFallback || typeof selfie.id !== "number";
        const createdAt = selfie.createdAt ?? daysAgo(index + 1);
        const createdByName = selfie.userName || selfie.createdByName || "Creator";
        const creatorKey = selfie.userId || selfie.createdById || createdByName || key;
        const creatorAvatar =
          selfie.profileImage ||
          selfie.creatorAvatar ||
          selfie.userProfileImage ||
          selfie.avatarUrl ||
          selfie.creatorImage ||
          null;
        const creatorImage =
          selfie.imageUrl ||
          selfie.photoUrl ||
          selfie.selfieUrl ||
          selfie.creatorImage ||
          creatorAvatar ||
          null;
        return {
          ...selfie,
          key,
          type: "selfie",
          isFallback,
          createdAt,
          createdByName,
          creatorKey,
          creatorImage,
          creatorAvatar,
          isLikedByMe: Boolean(selfie.isLikedByMe),
          isFollowingCreator: Boolean(selfie.isFollowingCreator),
          stats: {
            likeCount: typeof selfie.likeCount === "number" ? selfie.likeCount : 0,
            commentCount: typeof selfie.commentCount === "number" ? selfie.commentCount : 0,
          },
        };
      }),
    [resolvedSelfies, useSelfieFallback]
  );

  const derivedSelfies = useMemo(() => {
    const existing = new Set(enrichedSelfies.map((selfie) => String(selfie.creatorKey)));
    return enrichedOutfits
      .filter((outfit) => outfit.createdByName)
      .filter((outfit) => {
        const key = String(outfit.creatorKey);
        if (existing.has(key)) return false;
        existing.add(key);
        return true;
      })
      .map((outfit) => ({
        key: `derived-selfie-${outfit.creatorKey}`,
        type: "selfie",
        id: `derived-selfie-${outfit.creatorKey}`,
        isFallback: true,
        createdAt: outfit.createdAt,
        createdByName: outfit.createdByName,
        creatorKey: outfit.creatorKey,
        creatorImage: outfit.creatorImage,
        creatorAvatar: outfit.creatorImage,
        caption: `Selfie from ${outfit.createdByName}.`,
        isLikedByMe: false,
        isFollowingCreator: outfit.isFollowingCreator,
        stats: { likeCount: 0, commentCount: 0 },
      }));
  }, [enrichedOutfits, enrichedSelfies]);

  const seededComments = useMemo(() => {
    if (!useFallback) return {};
    const map = {};
    enrichedOutfits.forEach((outfit) => {
      map[outfit.key] = buildSeedComments(outfit.key);
    });
    return map;
  }, [enrichedOutfits, useFallback]);

  const seededSelfieComments = useMemo(() => {
    if (!useSelfieFallback) return {};
    const map = {};
    enrichedSelfies.forEach((selfie) => {
      map[selfie.key] = buildSeedComments(selfie.key);
    });
    return map;
  }, [enrichedSelfies, useSelfieFallback]);

  const availableTags = useMemo(() => {
    const set = new Set();
    enrichedOutfits.forEach((outfit) => {
      (outfit.tags || []).forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [enrichedOutfits]);

  useEffect(() => {
    if (activeTag !== "All" && !availableTags.includes(activeTag)) {
      setActiveTag("All");
    }
  }, [activeTag, availableTags]);

  const getLikeCount = (outfit) => outfit.stats.likeCount;
  const getCommentCount = (outfit) => outfit.stats.commentCount;
  const getTrendScore = (outfit) =>
    getLikeCount(outfit) * 0.9 + getCommentCount(outfit) * 5 + outfit.stats.saveCount * 1.6;
  const getSelfieLikeCount = (selfie) => selfie.stats.likeCount;
  const getSelfieCommentCount = (selfie) => selfie.stats.commentCount;
  const getSelfieTrendScore = (selfie) =>
    getSelfieLikeCount(selfie) * 1.1 + getSelfieCommentCount(selfie) * 6;

  const feedItems = useMemo(() => {
    const combined = [...enrichedOutfits];
    return combined;
  }, [enrichedOutfits]);

  const storySelfies = useMemo(() => {
    const base = enrichedSelfies.length > 0 ? enrichedSelfies : derivedSelfies;
    return base.slice(0, 12);
  }, [derivedSelfies, enrichedSelfies]);

  const activeStory = storyIndex === null ? null : storySelfies[storyIndex] || null;

  useEffect(() => {
    if (!activeStory) return undefined;
    setStoryProgress(0);
    const duration = 4500;
    const started = Date.now();
    const tick = () => {
      const elapsed = Date.now() - started;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setStoryProgress(pct);
      if (pct >= 100) {
        setStoryIndex((prev) => {
          if (prev === null) return prev;
          const next = prev + 1;
          return next >= storySelfies.length ? null : next;
        });
      }
    };
    const interval = setInterval(tick, 80);
    return () => clearInterval(interval);
  }, [activeStory, storySelfies.length]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = [...feedItems];

    if (activeTag !== "All") {
      list = list.filter(
        (item) => item.type === "outfit" && item.tags.includes(activeTag)
      );
    }

    if (query) {
      list = list.filter((item) => {
        if (item.type === "outfit") {
          const haystack = `${item.name} ${item.description} ${item.createdByName}`.toLowerCase();
          return haystack.includes(query);
        }
        const haystack = `${item.caption || ""} ${item.createdByName}`.toLowerCase();
        return haystack.includes(query);
      });
    }

    if (activeFeed === "following") {
      list = list.filter((item) => item.isFollowingCreator);
    }

    if (activeFeed === "trending") {
      list.sort((a, b) => {
        const scoreA = a.type === "outfit" ? getTrendScore(a) : getSelfieTrendScore(a);
        const scoreB = b.type === "outfit" ? getTrendScore(b) : getSelfieTrendScore(b);
        return scoreB - scoreA;
      });
    }

    if (activeFeed === "new") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [activeTag, activeFeed, feedItems, search]);

  const trendingOutfits = useMemo(
    () => [...enrichedOutfits].sort((a, b) => getTrendScore(b) - getTrendScore(a)).slice(0, 5),
    [enrichedOutfits]
  );

  const realCreatorIds = useMemo(
    () =>
      new Set(
        [...enrichedOutfits, ...enrichedSelfies].map((item) => item.userId).filter(Boolean)
      ),
    [enrichedOutfits, enrichedSelfies]
  );

  const creatorList = useMemo(() => {
    const map = new Map();
    enrichedOutfits.forEach((outfit) => {
      if (!map.has(outfit.creatorKey)) {
        map.set(outfit.creatorKey, {
          key: outfit.userId || outfit.creatorKey,
          name: outfit.createdByName,
          vibe: outfit.tags[0] || "Style",
          followers: outfit.creatorFollowers,
          isFollowing: outfit.isFollowingCreator,
          isReal: Boolean(outfit.userId),
          avatar: outfit.creatorAvatar,
        });
      }
    });

    enrichedSelfies.forEach((selfie) => {
      if (!map.has(selfie.creatorKey)) {
        map.set(selfie.creatorKey, {
          key: selfie.userId || selfie.creatorKey,
          name: selfie.createdByName,
          vibe: "Selfie",
          followers: selfie.creatorFollowers || 0,
          isFollowing: selfie.isFollowingCreator,
          isReal: Boolean(selfie.userId),
          avatar: selfie.creatorAvatar,
        });
      }
    });

    return Array.from(map.values()).slice(0, 6);
  }, [enrichedOutfits, enrichedSelfies]);

  const handleActionError = (err, fallbackMessage) => {
    setStatusMessage("");
    const status = err?.response?.status;
    if (status === 401) {
      setError("Please log in to like, save, follow, and comment.");
      return;
    }
    if (status === 403) {
      setError("You do not have permission to do that.");
      return;
    }
    setError(err?.response?.data?.message || fallbackMessage);
  };

  // const handleShopEdit = async () => {
  //   try {
  //     const res = await api.get("/outfits/edit-products");
  //     const ids = Array.isArray(res.data?.productIds) ? res.data.productIds : [];
  //     if (ids.length) {
  //       navigate(`/products?ids=${ids.join(",")}&page=1`);
  //       return;
  //     }
  //   } catch (err) {
  //     console.error("Failed to load edit products:", err);
  //   }

  //   navigate("/products");
  // };

  const handleBuyLook = async (outfit, productIds) => {
    if (!outfit) return;
    const validIds = Array.isArray(productIds) ? productIds.filter(Boolean) : [];
    if (validIds.length === 0) {
      setStatusMessage("No purchasable items found in this look.");
      setError("");
      return;
    }

    setStatusMessage("");
    setBuyLoading((prev) => ({ ...prev, [outfit.key]: true }));
    try {
      for (const productId of validIds) {
        await api.post("/cart/items", { ProductId: productId, quantity: 1 });
      }
      setError("");
      setStatusMessage(
        `${validIds.length} item${validIds.length === 1 ? "" : "s"} added to your cart.`
      );
    } catch (err) {
      handleActionError(err, "Failed to add look to cart.");
    } finally {
      setBuyLoading((prev) => ({ ...prev, [outfit.key]: false }));
    }
  };

  const handleCreatorClick = (creatorId) => {
    if (!creatorId) return;
    navigate(`/users/${creatorId}/outfits`);
  };

  const handleCreatorKeyDown = (event, creatorId) => {
    if (!creatorId) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCreatorClick(creatorId);
    }
  };

  const handleLikeToggle = async (outfit) => {
    if (!outfit || typeof outfit.id !== "number") return;
    try {
      const res = await api.post(`/outfits/${outfit.id}/likes/toggle`);
      const { liked, likeCount } = res.data || {};
      setError("");
      setOutfits((prev) =>
        prev.map((item) =>
          item.id === outfit.id ? { ...item, isLikedByMe: liked, likeCount } : item
        )
      );
    } catch (err) {
      handleActionError(err, "Failed to toggle like.");
    }
  };

  const handleSelfieLikeToggle = async (selfie) => {
    if (!selfie || typeof selfie.id !== "number") return;
    try {
      const res = await api.post(`/selfies/${selfie.id}/likes/toggle`);
      const { liked, likeCount } = res.data || {};
      setError("");
      setSelfies((prev) =>
        prev.map((item) =>
          item.id === selfie.id ? { ...item, isLikedByMe: liked, likeCount } : item
        )
      );
    } catch (err) {
      handleActionError(err, "Failed to toggle selfie like.");
    }
  };

  const handleSaveToggle = async (outfit) => {
    if (!outfit || typeof outfit.id !== "number") return;
    try {
      const res = await api.post(`/outfits/${outfit.id}/save`);
      const { saved, saveCount } = res.data || {};
      setError("");
      setOutfits((prev) =>
        prev.map((item) =>
          item.id === outfit.id ? { ...item, isSavedByMe: saved, saveCount } : item
        )
      );
    } catch (err) {
      handleActionError(err, "Failed to toggle save.");
    }
  };

  const handleFollowToggle = async (creatorKey) => {
    if (!creatorKey) return;
    const targetCreatorId = String(creatorKey);
    if (!realCreatorIds.has(targetCreatorId)) return;
    try {
      const res = await api.post(`/follows/${targetCreatorId}/toggle`);
      const { following, followerCount } = res.data || {};
      setError("");
      setOutfits((prev) =>
        prev.map((item) =>
          item.userId === targetCreatorId
            ? { ...item, isFollowingCreator: following, creatorFollowers: followerCount }
            : item
        )
      );
    } catch (err) {
      handleActionError(err, "Failed to toggle follow.");
    }
  };

  const loadComments = async (outfit) => {
    if (!outfit || typeof outfit.id !== "number") return;
    if (commentsByOutfit[outfit.key]) return;

    setCommentsLoading((prev) => ({ ...prev, [outfit.key]: true }));
    try {
      const res = await api.get(`/outfits/${outfit.id}/comments`);
      setError("");
      setCommentsByOutfit((prev) => ({
        ...prev,
        [outfit.key]: Array.isArray(res.data) ? res.data : [],
      }));
    } catch (err) {
      handleActionError(err, "Failed to load comments.");
    } finally {
      setCommentsLoading((prev) => ({ ...prev, [outfit.key]: false }));
    }
  };

  const loadSelfieComments = async (selfie) => {
    if (!selfie || typeof selfie.id !== "number") return;
    if (commentsByOutfit[selfie.key]) return;

    setCommentsLoading((prev) => ({ ...prev, [selfie.key]: true }));
    try {
      const res = await api.get(`/selfies/${selfie.id}/comments`);
      setError("");
      setCommentsByOutfit((prev) => ({
        ...prev,
        [selfie.key]: Array.isArray(res.data) ? res.data : [],
      }));
    } catch (err) {
      handleActionError(err, "Failed to load selfie comments.");
    } finally {
      setCommentsLoading((prev) => ({ ...prev, [selfie.key]: false }));
    }
  };

  const handleCommentToggle = (item, type) => {
    if (!item) return;
    setOpenComments((prev) => {
      const next = !prev[item.key];
      if (next) {
        if (type === "selfie") {
          if (useSelfieFallback && seededSelfieComments[item.key]) {
            setCommentsByOutfit((prevComments) => ({
              ...prevComments,
              [item.key]: seededSelfieComments[item.key],
            }));
          } else {
            loadSelfieComments(item);
          }
        } else if (useFallback && seededComments[item.key]) {
          setCommentsByOutfit((prevComments) => ({
            ...prevComments,
            [item.key]: seededComments[item.key],
          }));
        } else {
          loadComments(item);
        }
      }
      return { ...prev, [item.key]: next };
    });
  };

  const handleCommentSubmit = async (outfit) => {
    if (!outfit || typeof outfit.id !== "number") return;
    const message = (commentDrafts[outfit.key] || "").trim();
    if (!message) return;

    try {
      const res = await api.post(`/outfits/${outfit.id}/comments`, { text: message });
      const comment = res.data?.comment;
      const commentCount = res.data?.commentCount;
      setError("");

      if (comment) {
        setCommentsByOutfit((prev) => ({
          ...prev,
          [outfit.key]: [...(prev[outfit.key] || []), comment],
        }));
      }

      if (typeof commentCount === "number") {
        setOutfits((prev) =>
          prev.map((item) =>
            item.id === outfit.id ? { ...item, commentCount } : item
          )
        );
      }
    } catch (err) {
      handleActionError(err, "Failed to post comment.");
    } finally {
      setCommentDrafts((prev) => ({ ...prev, [outfit.key]: "" }));
      setOpenComments((prev) => ({ ...prev, [outfit.key]: true }));
    }
  };

  const handleSelfieCommentSubmit = async (selfie) => {
    if (!selfie || typeof selfie.id !== "number") return;
    const message = (commentDrafts[selfie.key] || "").trim();
    if (!message) return;

    try {
      const res = await api.post(`/selfies/${selfie.id}/comments`, { text: message });
      const comment = res.data?.comment;
      const commentCount = res.data?.commentCount;
      setError("");

      if (comment) {
        setCommentsByOutfit((prev) => ({
          ...prev,
          [selfie.key]: [...(prev[selfie.key] || []), comment],
        }));
      }

      if (typeof commentCount === "number") {
        setSelfies((prev) =>
          prev.map((item) =>
            item.id === selfie.id ? { ...item, commentCount } : item
          )
        );
      }
    } catch (err) {
      handleActionError(err, "Failed to post selfie comment.");
    } finally {
      setCommentDrafts((prev) => ({ ...prev, [selfie.key]: "" }));
      setOpenComments((prev) => ({ ...prev, [selfie.key]: true }));
    }
  };

  const getCreatorAvatar = (item) => {
    const url = item.creatorAvatar || item.creatorImage;
    return url ? withHost(url) : "";
  };

  const openStoryAt = (index) => {
    if (index == null || index < 0 || index >= storySelfies.length) return;
    setStoryIndex(index);
  };

  const closeStory = () => setStoryIndex(null);

  const goStoryPrev = () => {
    setStoryIndex((prev) => {
      if (prev == null) return prev;
      const next = prev - 1;
      return next < 0 ? 0 : next;
    });
  };

  const goStoryNext = () => {
    setStoryIndex((prev) => {
      if (prev == null) return prev;
      const next = prev + 1;
      return next >= storySelfies.length ? null : next;
    });
  };

  const handleStoryUpload = async (event) => {
    event.preventDefault();
    if (!storyUploadFile) return;
    setStoryUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", storyUploadFile);
      formData.append("caption", storyUploadCaption);
      formData.append("isPublic", storyUploadPublic ? "true" : "false");
      const res = await api.post("/selfies/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const created = res.data;
      setSelfies((prev) => [created, ...prev]);
      setStoryUploadOpen(false);
      setStoryUploadFile(null);
      setStoryUploadCaption("");
      setStoryUploadPublic(true);
    } catch (err) {
      handleActionError(err, "Failed to upload selfie.");
    } finally {
      setStoryUploading(false);
    }
  };

  return (
    <div className="outfits-page">
      <div className="outfits-shell">
        {/* <header className="outfits-hero">
          <div className="hero-copy">
            <p className="eyebrow">Pinterest x Zara x Instagram</p>
            <h1>Outfitverse</h1>
            <p className="hero-lead">
              Follow creators, save looks, and shop modern styling in one fashion forward feed.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/user/outfit-builder")}
              >
                Create look
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveFeed("trending")}
              >
                Explore trends
              </button>
            </div>
            <div className="feature-row">
              {FEATURE_CHIPS.map((feature) => (
                <div key={feature.title} className="feature-chip">
                  <div className="feature-title">{feature.title}</div>
                  <div className="feature-caption">{feature.caption}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-card">
            {/* <div className="hero-card-header">
              <span className="pill">Trending now</span>
              <span className="hero-date">{formatDate(NOW)}</span>
            </div> */}
        {/* <h2>Daily edit</h2>
            <p>
              A curated mix of warm neutrals, soft tailoring, and sculpted silhouettes. Built for the city, inspired
              by modern ateliers.
            </p>
            <div className="hero-stats">
              <div>
                <div className="stat-value">28k</div>
                <div className="stat-label">Saves today</div>
              </div>
              <div>
                <div className="stat-value">4.6k</div>
                <div className="stat-label">New follows</div>
              </div>
              <div>
                <div className="stat-value">120</div>
                <div className="stat-label">Creators featured</div>
              </div>
            </div>
            <button type="button" className="btn btn-ghost" onClick={handleShopEdit}>
              Shop the edit
            </button>
          </div> */}


        <section className="stories-panel">
          <div className="stories-header">
            <h3>Selfie stories</h3>
            <p>Fresh selfies from creators you follow and the public feed.</p>
          </div>
          <div className="stories-row">
            <button
              type="button"
              className="story-card story-add"
              onClick={() => setStoryUploadOpen(true)}
            >
              <div className="story-avatar">
                <span className="story-plus">+</span>
              </div>
              <span className="story-name">Your story</span>
            </button>
            {storySelfies.length === 0 ? (
              <div className="creator-meta">No stories yet.</div>
            ) : (
              storySelfies.map((story, index) => {
                const avatar = getCreatorAvatar(story);
                return (
                  <button
                    key={story.key}
                    type="button"
                    className="story-card story-card-clickable"
                    onClick={() => openStoryAt(index)}
                  >
                    <div className="story-avatar">
                      {avatar ? (
                        <img src={avatar} alt={`${story.createdByName} story`} />
                      ) : (
                        <span>{getInitials(story.createdByName)}</span>
                      )}
                    </div>
                    <span className="story-name">{story.createdByName}</span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <div className="outfits-toolbar">
          <div className="feed-toggle">
            {["trending", "new", "following"].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`toggle ${activeFeed === mode ? "active" : ""}`}
                onClick={() => setActiveFeed(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="search-wrap">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search outfits, selfies, creators, or tags"
              aria-label="Search outfits"
            />
          </div>
        </div>

        {error && <div className="notice">{error}</div>}
        {!error && statusMessage && (
          <div className="notice notice-success">{statusMessage}</div>
        )}

        <div className="outfits-layout">
          <aside className="left-rail">
            <div className="panel">
              <h3>Style boards</h3>
              {boards.length === 0 ? (
                <div className="creator-meta">Create or save to a board to see it here.</div>
              ) : (
                <div className="board-list">
                  {boards.map((board) => (
                    <div key={board.id || board.name} className="board-item">
                      <div className="board-name">{board.name}</div>
                      <div className="board-count">
                        {board.itemCount ?? board.ItemCount ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Trending hashtags ── */}
            <div className="panel">
              <h3>Trending Hashtags</h3>
              <div className="hashtag-list">
                {TRENDING_HASHTAGS.map((ht) => (
                  <div
                    key={ht.tag}
                    className="hashtag-row"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSearch(ht.tag.replace("#", ""))}
                    onKeyDown={(e) => e.key === "Enter" && setSearch(ht.tag.replace("#", ""))}
                  >
                    <span className="hashtag-name">{ht.tag}</span>
                    <span className="hashtag-count">{ht.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <h3>Trending tags</h3>
              <div className="tag-list">
                <button
                  type="button"
                  className={`tag ${activeTag === "All" ? "active" : ""}`}
                  onClick={() => setActiveTag("All")}
                >
                  All
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag ${activeTag === tag ? "active" : ""}`}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
                {availableTags.length === 0 && <span className="creator-meta">No tags yet.</span>}
              </div>
            </div>
          </aside>

          <main className="outfits-feed">
            {loading && <div className="loading">Loading feed...</div>}

            {!loading && filteredItems.length === 0 && (
              <div className="empty-state">
                No looks match that filter yet. Try another tag or search.
              </div>
            )}

            <div className="outfits-masonry">
              {filteredItems.map((outfit, index) => {
                if (outfit.type === "selfie") {
                  const likeCount = getSelfieLikeCount(outfit);
                  const commentCount = getSelfieCommentCount(outfit);
                  const isLiked = Boolean(outfit.isLikedByMe);
                  const isFollowing = Boolean(outfit.isFollowingCreator);
                  const creatorId = outfit.userId;
                  const canViewCreator = Boolean(creatorId);
                  const canFollow = canViewCreator;
                  const comments = commentsByOutfit[outfit.key] || [];
                  const creatorAvatar = getCreatorAvatar(outfit);
                  return (
                    <article key={outfit.key} className="outfit-card selfie-card" style={{ "--i": index }}>
                      <div className="card-header">
                        <div
                          className={`creator ${canViewCreator ? "creator-clickable" : ""}`}
                          role={canViewCreator ? "button" : undefined}
                          tabIndex={canViewCreator ? 0 : undefined}
                          onClick={() => canViewCreator && handleCreatorClick(creatorId)}
                          onKeyDown={
                            canViewCreator ? (event) => handleCreatorKeyDown(event, creatorId) : undefined
                          }
                        >
                          <div className="avatar selfie-avatar">
                            {creatorAvatar ? (
                              <img src={creatorAvatar} alt={`${outfit.createdByName} selfie`} />
                            ) : (
                              getInitials(outfit.createdByName)
                            )}
                          </div>
                          <div>
                            <div className="creator-name">{outfit.createdByName}</div>
                            <div className="creator-meta">Selfie</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-pill ${isFollowing ? "active" : ""}`}
                          disabled={!canFollow}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (canFollow) handleFollowToggle(outfit.userId);
                          }}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                      </div>

                      {outfit.caption && <p className="outfit-desc selfie-caption">{outfit.caption}</p>}

                      <div className="outfit-canvas selfie-canvas">
                        {outfit.creatorImage ? (
                          <img src={withHost(outfit.creatorImage)} alt={outfit.caption || "Selfie"} />
                        ) : (
                          <div className="selfie-placeholder">
                            <span>{getInitials(outfit.createdByName)}</span>
                            <p>Public selfie</p>
                          </div>
                        )}
                      </div>

                      <div className="outfit-actions">
                        <button
                          type="button"
                          className={`btn btn-ghost ${isLiked ? "active" : ""}`}
                          onClick={() => handleSelfieLikeToggle(outfit)}
                        >
                          Like <span className="count">{likeCount}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => handleCommentToggle(outfit, "selfie")}
                        >
                          Comment <span className="count">{commentCount}</span>
                        </button>
                      </div>

                      {openComments[outfit.key] && (
                        <div className="comment-panel">
                          {commentsLoading[outfit.key] && <div className="comment">Loading comments...</div>}
                          <div className="comment-list">
                            {comments.map((comment) => (
                              <div key={comment.id} className="comment">
                                <span className="comment-user">{comment.userName || comment.user || "User"}</span>
                                <span className="comment-text">{comment.text}</span>
                              </div>
                            ))}
                          </div>
                          <div className="comment-input">
                            <input
                              type="text"
                              value={commentDrafts[outfit.key] || ""}
                              onChange={(event) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [outfit.key]: event.target.value,
                                }))
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  handleSelfieCommentSubmit(outfit);
                                }
                              }}
                              placeholder="Add a comment"
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleSelfieCommentSubmit(outfit)}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="card-footer">
                        <span>{formatDate(outfit.createdAt)}</span>
                        <span className="divider">|</span>
                        <span>{likeCount} likes</span>
                      </div>
                    </article>
                  );
                }

                const likeCount = getLikeCount(outfit);
                const commentCount = getCommentCount(outfit);
                const isLiked = Boolean(outfit.isLikedByMe);
                const isSaved = Boolean(outfit.isSavedByMe);
                const isFollowing = Boolean(outfit.isFollowingCreator);
                const creatorId = outfit.userId;
                const canViewCreator = Boolean(creatorId);
                const canFollow = canViewCreator;
                const buyableProductIds = getProductItemIds(outfit.items);
                const hasBuyItems = buyableProductIds.length > 0;
                const isBuyLoading = Boolean(buyLoading[outfit.key]);
                const comments = commentsByOutfit[outfit.key] || [];
                const seed = seedNumber(outfit.key);
                const creatorAvatar = getCreatorAvatar(outfit);
                return (
                  <article key={outfit.key} className="outfit-card" style={{ "--i": index }}>
                    <div className="card-header">
                      <div
                        className={`creator ${canViewCreator ? "creator-clickable" : ""}`}
                        role={canViewCreator ? "button" : undefined}
                        tabIndex={canViewCreator ? 0 : undefined}
                        onClick={() => canViewCreator && handleCreatorClick(creatorId)}
                        onKeyDown={canViewCreator ? (event) => handleCreatorKeyDown(event, creatorId) : undefined}
                      >
                        <div className="avatar">
                          {creatorAvatar ? (
                            <img src={creatorAvatar} alt={`${outfit.createdByName} avatar`} />
                          ) : (
                            getInitials(outfit.createdByName)
                          )}
                        </div>
                        <div>
                          <div className="creator-name">{outfit.createdByName}</div>
                          <div className="creator-meta">
                            {outfit.tags.length ? outfit.tags.join(" | ") : "No tags yet"}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`btn btn-pill ${isFollowing ? "active" : ""}`}
                        disabled={!canFollow}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (canFollow) handleFollowToggle(outfit.userId);
                        }}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>

                    <h3 className="outfit-title">{outfit.name || "Untitled look"}</h3>
                    {outfit.description && <p className="outfit-desc">{outfit.description}</p>}

                    <div className="outfit-canvas">
                      {(outfit.items || []).map((item, idx) => {
                        const fallbackX = (idx % 3) * 90 + (seed % 14);
                        const fallbackY = Math.floor(idx / 3) * 90 + ((seed >> 3) % 18);
                        const left = clamp(item.positionX ?? fallbackX, 0, CANVAS_WIDTH - ITEM_SIZE);
                        const top = clamp(item.positionY ?? fallbackY, 0, CANVAS_HEIGHT - ITEM_SIZE);
                        const tone = ITEM_TONES[(seed + idx) % ITEM_TONES.length];
                        return (
                          <div
                            key={`${outfit.key}_${item.id || idx}`}
                            className="outfit-item"
                            style={{
                              left: `${left}px`,
                              top: `${top}px`,
                              zIndex: item.layerOrder || idx + 1,
                              "--tone-a": tone[0],
                              "--tone-b": tone[1],
                            }}
                          >
                            {item.imageUrl ? (
                              <img src={withHost(item.imageUrl)} alt={item.displayName || "Outfit item"} />
                            ) : (
                              <div className="item-label">{item.displayName || "Item"}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* ── Shop This Look inline panel ── */}
                    {/* {(outfit.items || []).length > 0 && (
                      <div className="shop-look-panel">
                        <div className="shop-look-header">
                          <span className="shop-look-title">Shop This Look</span>
                          <button
                            type="button"
                            className="shop-look-chevron"
                            aria-label="See more items"
                          >
                            ›
                          </button>
                        </div>
                        <div className="shop-look-items">
                          {(outfit.items || []).slice(0, 4).map((item, idx) => {
                            const tone = ITEM_TONES[(seedNumber(outfit.key) + idx) % ITEM_TONES.length];
                            const price = SHOP_ITEM_PRICES[(seedNumber(outfit.key) + idx) % SHOP_ITEM_PRICES.length];
                            return (
                              <div key={item.id || idx} className="shop-look-item">
                                <div
                                  className="shop-look-thumb"
                                  style={{ "--tone-a": tone[0], "--tone-b": tone[1] }}
                                >
                                  {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.displayName || "Item"} />
                                  ) : (
                                    <span className="shop-look-initials">
                                      {(item.displayName || "Item").slice(0, 2)}
                                    </span>
                                  )}
                                </div>
                                <div className="shop-look-name">
                                  {(item.displayName || "Item").split(" ")[0]}
                                </div>
                                <div className="shop-look-price">${price}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )} */}

                    <div className="outfit-tags">
                      {outfit.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                      <span className="item-count">{(outfit.items || []).length} items</span>
                    </div>

                    <div className="outfit-actions">
                      <button
                        type="button"
                        className={`btn btn-ghost ${isLiked ? "active" : ""}`}
                        onClick={() => handleLikeToggle(outfit)}
                      >
                        Like <span className="count">{likeCount}</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => handleCommentToggle(outfit, "outfit")}
                      >
                        Comment <span className="count">{commentCount}</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-ghost ${isSaved ? "active" : ""}`}
                        onClick={() => handleSaveToggle(outfit)}
                      >
                        Save <span className="count">{outfit.stats.saveCount}</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary buy-button"
                        disabled={!hasBuyItems || isBuyLoading}
                        onClick={() => handleBuyLook(outfit, buyableProductIds)}
                      >
                        {isBuyLoading ? "Adding…" : "Buy this look"}
                      </button>
                    </div>

                    {openComments[outfit.key] && (
                      <div className="comment-panel">
                        {commentsLoading[outfit.key] && <div className="comment">Loading comments...</div>}
                        <div className="comment-list">
                          {comments.map((comment) => (
                            <div key={comment.id} className="comment">
                              <span className="comment-user">{comment.userName || comment.user || "User"}</span>
                              <span className="comment-text">{comment.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="comment-input">
                          <input
                            type="text"
                            value={commentDrafts[outfit.key] || ""}
                            onChange={(event) =>
                              setCommentDrafts((prev) => ({
                                ...prev,
                                [outfit.key]: event.target.value,
                              }))
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                handleCommentSubmit(outfit);
                              }
                            }}
                            placeholder="Add a comment"
                          />
                          <button type="button" className="btn btn-primary" onClick={() => handleCommentSubmit(outfit)}>
                            Post
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="card-footer">
                      <span>{formatDate(outfit.createdAt)}</span>
                      <span className="divider">|</span>
                      <span>{outfit.stats.saveCount} saves</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </main>

          <aside className="right-rail">
            {/* ── Trending Styles ── */}
            <div className="panel">
              <h3>Trending Styles</h3>
              <div className="trend-list">
                {trendingOutfits.map((outfit) => {
                  const creatorId = outfit.userId;
                  const canVisitCreator = Boolean(creatorId);
                  const seed = seedNumber(outfit.key);
                  const tone = ITEM_TONES[seed % ITEM_TONES.length];
                  const viewCount = (seed % 20 + 10) * 1000;
                  const viewLabel =
                    viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount;
                  return (
                    <div
                      key={outfit.key}
                      className={`trend-style-item ${canVisitCreator ? "trend-item-clickable" : ""}`}
                      role={canVisitCreator ? "button" : undefined}
                      tabIndex={canVisitCreator ? 0 : undefined}
                      onClick={() => canVisitCreator && handleCreatorClick(creatorId)}
                      onKeyDown={
                        canVisitCreator ? (event) => handleCreatorKeyDown(event, creatorId) : undefined
                      }
                    >
                      <div
                        className="trend-style-thumb"
                        style={{ "--tone-a": tone[0], "--tone-b": tone[1] }}
                      />
                      <div className="trend-style-info">
                        <div className="trend-name">{outfit.name || "Editorial Style"}</div>
                        <div className="trend-style-views">👁 {viewLabel}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Popular Products ── */}
            <div className="panel">
              <h3>Popular Products</h3>
              <div className="popular-products">
                {(enrichedOutfits[0]?.items || []).slice(0, 2).map((item, idx) => {
                  const tone = ITEM_TONES[idx % ITEM_TONES.length];
                  const price = SHOP_ITEM_PRICES[idx];
                  return (
                    <div key={item.id || idx} className="popular-product-row">
                      <div
                        className="popular-product-thumb"
                        style={{ "--tone-a": tone[0], "--tone-b": tone[1] }}
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.displayName || "Product"} />
                        ) : null}
                      </div>
                      <div className="popular-product-info">
                        <div className="popular-product-name">
                          Mini-Style {item.displayName || "Item"}
                        </div>
                        <div className="popular-product-price">${price}</div>
                      </div>
                    </div>
                  );
                })}
                {(enrichedOutfits[0]?.items || []).length === 0 && (
                  <div className="creator-meta">Products appear here when outfits load.</div>
                )}
              </div>
            </div>

            {/* ── Trending Colors ── */}
            <div className="panel">
              <h3>Trending Colors</h3>
              <div className="trending-colors-swatches">
                {TRENDING_COLORS_RAIL.map((color) => (
                  <div key={color.name} className="trending-color-item">
                    <div
                      className="trending-color-swatch"
                      style={{ background: color.tone }}
                      title={color.name}
                    />
                    <span className="trending-color-name">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Top Creators This Week ── */}
            <div className="panel">
              <h3>Top Creators This Week</h3>
              {creatorList.length === 0 ? (
                <div className="creator-meta">No creators found in the current feed.</div>
              ) : (
                <div className="creator-list">
                  {creatorList.slice(0, 3).map((creator) => {
                    const creatorId = creator.isReal ? creator.key : null;
                    const canVisitCreator = Boolean(creatorId);
                    const creatorAvatar = creator.avatar ? withHost(creator.avatar) : "";
                    return (
                      <div
                        key={creator.key}
                        className={`creator-item ${canVisitCreator ? "creator-item-clickable" : ""}`}
                        role={canVisitCreator ? "button" : undefined}
                        tabIndex={canVisitCreator ? 0 : undefined}
                        onClick={() => canVisitCreator && handleCreatorClick(creatorId)}
                        onKeyDown={
                          canVisitCreator ? (event) => handleCreatorKeyDown(event, creatorId) : undefined
                        }
                      >
                        <div className="avatar small">
                          {creatorAvatar ? (
                            <img src={creatorAvatar} alt={`${creator.name} avatar`} />
                          ) : (
                            getInitials(creator.name)
                          )}
                        </div>
                        <div className="creator-info">
                          <div className="creator-name">{creator.name}</div>
                          <div className="creator-meta">
                            {formatFollowers(creator.followers)} followers
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-pill ${creator.isFollowing ? "active" : ""}`}
                          disabled={!creator.isReal || !realCreatorIds.has(creator.key)}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (creator.isReal) handleFollowToggle(creator.key);
                          }}
                        >
                          {creator.isFollowing ? "Following" : "Follow"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>

        {activeStory && (
          <div className="story-viewer" role="dialog" aria-modal="true">
            <button type="button" className="story-backdrop" onClick={closeStory} />
            <div className="story-stage">
              <div className="story-progress">
                <span style={{ width: `${storyProgress}%` }} />
              </div>
              <div className="story-header">
                <div className="story-header-left">
                  <div className="story-header-avatar">
                    {getCreatorAvatar(activeStory) ? (
                      <img
                        src={getCreatorAvatar(activeStory)}
                        alt={`${activeStory.createdByName} avatar`}
                      />
                    ) : (
                      <span>{getInitials(activeStory.createdByName)}</span>
                    )}
                  </div>
                  <div>
                    <div className="story-header-name">{activeStory.createdByName}</div>
                    <div className="story-header-time">{formatDate(activeStory.createdAt)}</div>
                  </div>
                </div>
                <button type="button" className="btn btn-ghost" onClick={closeStory}>
                  Close
                </button>
              </div>
              <div className="story-media">
                {activeStory.creatorImage ? (
                  <img
                    src={withHost(activeStory.creatorImage)}
                    alt={activeStory.caption || "Selfie story"}
                  />
                ) : (
                  <div className="selfie-placeholder">
                    <span>{getInitials(activeStory.createdByName)}</span>
                    <p>Public selfie</p>
                  </div>
                )}
              </div>
              {activeStory.caption && <div className="story-caption">{activeStory.caption}</div>}
              <div className="story-controls">
                <button type="button" className="btn btn-ghost" onClick={goStoryPrev}>
                  Prev
                </button>
                <button type="button" className="btn btn-primary" onClick={goStoryNext}>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {storyUploadOpen && (
          <div className="story-viewer" role="dialog" aria-modal="true">
            <button type="button" className="story-backdrop" onClick={() => setStoryUploadOpen(false)} />
            <div className="story-stage story-upload">
              <div className="story-header">
                <div className="story-header-left">
                  <div className="story-header-name">Upload story</div>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => setStoryUploadOpen(false)}>
                  Close
                </button>
              </div>
              <form className="story-upload-form" onSubmit={handleStoryUpload}>
                <label className="story-upload-field">
                  <span>Selfie image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setStoryUploadFile(event.target.files?.[0] || null)}
                    required
                  />
                </label>
                <label className="story-upload-field">
                  <span>Caption</span>
                  <input
                    type="text"
                    value={storyUploadCaption}
                    onChange={(event) => setStoryUploadCaption(event.target.value)}
                    placeholder="Add a caption"
                  />
                </label>
                <label className="story-upload-toggle">
                  <input
                    type="checkbox"
                    checked={storyUploadPublic}
                    onChange={(event) => setStoryUploadPublic(event.target.checked)}
                  />
                  <span>Make story public</span>
                </label>
                <button type="submit" className="btn btn-primary" disabled={storyUploading}>
                  {storyUploading ? "Uploading..." : "Post story"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
