import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { withHost } from "../utils/outfitHelpers";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wardrobe, setWardrobe] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    Promise.allSettled([
      api.get("/users/me", { headers: { Authorization: `Bearer ${token}` } }),
      api.get("/selfies/me", { headers: { Authorization: `Bearer ${token}` } }),
      api.get("/outfits/me", { headers: { Authorization: `Bearer ${token}` } }),
      api.get("/wishlist", { headers: { Authorization: `Bearer ${token}` } }),
      api.get("/useritems", { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([userRes, selfiesRes, outfitsRes, wishlistRes, wardrobeRes]) => {
      if (userRes.status === "fulfilled") setUser(userRes.value.data);
      if (selfiesRes.status === "fulfilled") setPosts(selfiesRes.value.data);
      if (outfitsRes.status === "fulfilled") setOutfits(outfitsRes.value.data);
      if (wishlistRes.status === "fulfilled") setWishlist(wishlistRes.value.data);
      if (wardrobeRes.status === "fulfilled") setWardrobe(wardrobeRes.value.data);
      setLoading(false);
    });
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="profile-loading">Loading your profile...</div>
    );
  }

  if (!user) return null;

  const profileImageUrl = user.profileImage
    ? withHost(user.profileImage)
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div style={{ width: "100%" }}>
      <main className="profile-main">
        {/* Profile Header - Instagram Style */}
        <header className="profile-header">
          <div className="profile-avatar-container">
            <img src={profileImageUrl} alt={user.fullName} className="profile-avatar" />
          </div>
          <div className="profile-info">
            <div className="profile-name-row">
              <h2 className="profile-username">{user.email ? user.email.split('@')[0] : "user"}</h2>
              <button className="profile-edit-btn" onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </button>
            </div>
            
            <div className="profile-stats">
              <span><strong>{posts.length + outfits.length}</strong> posts</span>
              <span><strong>0</strong> followers</span>
              <span><strong>0</strong> following</span>
            </div>

            <div className="profile-bio">
              <span className="profile-fullname">{user.fullName}</span>
              <p>{user.bio || "Welcome to my style diary."}</p>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button className={`profile-tab ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>
            POSTS
          </button>
          <button className={`profile-tab ${activeTab === "outfits" ? "active" : ""}`} onClick={() => setActiveTab("outfits")}>
            OUTFITS
          </button>
          <button className={`profile-tab ${activeTab === "wishlist" ? "active" : ""}`} onClick={() => setActiveTab("wishlist")}>
            WISHLIST
          </button>
          <button className={`profile-tab ${activeTab === "wardrobe" ? "active" : ""}`} onClick={() => setActiveTab("wardrobe")}>
            WARDROBE
          </button>
        </div>

        {/* Tab Content Grid */}
        <div className="profile-grid">
          {activeTab === "posts" && posts.map((post) => (
            <div key={post.id} className="grid-item">
              <img src={withHost(post.imageUrl)} alt="Post" />
            </div>
          ))}
          {activeTab === "posts" && posts.length === 0 && <p className="empty-msg">No posts yet.</p>}

          {activeTab === "outfits" && outfits.map((outfit) => (
            <div key={outfit.id} className="grid-item">
               <div className="outfit-thumb-bg">
                 {outfit.items && outfit.items.length > 0 && outfit.items[0].imageUrl ? (
                   <img src={withHost(outfit.items[0].imageUrl)} alt={outfit.name} />
                 ) : (
                   <span>👗</span>
                 )}
               </div>
            </div>
          ))}
          {activeTab === "outfits" && outfits.length === 0 && <p className="empty-msg">No outfits yet.</p>}

          {activeTab === "wishlist" && wishlist.map((item) => (
            <div key={item.id} className="grid-item">
              <img src={withHost(item.product.imageUrl)} alt={item.product.name} />
            </div>
          ))}
          {activeTab === "wishlist" && wishlist.length === 0 && <p className="empty-msg">Wishlist is empty.</p>}

          {activeTab === "wardrobe" && wardrobe.map((item) => (
            <div key={item.id} className="grid-item">
              <img src={withHost(item.imageUrl)} alt={item.name} />
            </div>
          ))}
          {activeTab === "wardrobe" && wardrobe.length === 0 && <p className="empty-msg">Wardrobe is empty.</p>}
        </div>
      </main>
    </div>
  );
}
