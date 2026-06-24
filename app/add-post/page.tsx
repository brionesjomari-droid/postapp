"use client";

import { useState } from "react";

export default function AddPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, published: true }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to post");
      }

      setSuccess("Post published!");
      setTitle("");
      setContent("");
      
      // Redirect to posts page after 1 second
      setTimeout(() => {
        window.location.href = "/posts";
      }, 1000);
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, published: false }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save draft");
      }

      setSuccess("Draft saved!");
      setTitle("");
      setContent("");
      
      // Redirect to drafts page after 1 second
      setTimeout(() => {
        window.location.href = "/drafts";
      }, 1000);
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Create Post</h2>

      {error && (
        <p style={{ marginTop: 16, color: "red", padding: 8, background: "#ffe0e0", borderRadius: 4 }}>
          {error}
        </p>
      )}

      {success && (
        <p
          style={{
            marginTop: 16,
            color: "green",
            padding: 8,
            background: "#e0ffe0",
            borderRadius: 4,
          }}
        >
          {success}
        </p>
      )}

      <form onSubmit={handlePublish} style={{ marginTop: 16, maxWidth: 700 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content (optional)"
            rows={8}
            style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Publishing..." : "Add Post"}
          </button>
          <button 
            type="button" 
            onClick={handleSaveDraft}
            disabled={loading}
            style={{
              padding: "10px 16px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
        </div>
      </form>
    </section>
  );
}
