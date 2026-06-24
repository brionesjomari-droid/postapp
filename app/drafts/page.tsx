"use client";

import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  createdAt: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [publishing, setPublishing] = useState<number | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/posts/drafts");
      if (!res.ok) throw new Error("Failed to fetch drafts");
      const data = await res.json();
      setDrafts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (draft: Post) => {
    setEditingId(draft.id);
    setEditTitle(draft.title);
    setEditContent(draft.content || "");
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (!res.ok) throw new Error("Failed to save edit");
      
      setEditingId(null);
      fetchDrafts();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }
  };

  const handlePublish = async (id: number) => {
    setPublishing(id);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });

      if (!res.ok) throw new Error("Failed to publish");
      
      fetchDrafts();
    } catch (err) {
      console.error(err);
      alert("Failed to publish");
    } finally {
      setPublishing(null);
    }
  };

  return (
    <section>
      <h2>Drafts</h2>

      {loading && <p>Loading...</p>}

      {!loading && drafts.length === 0 && (
        <p style={{ marginTop: 16 }}>No drafts found.</p>
      )}

      {drafts.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {drafts.map((draft) => (
            <article
              key={draft.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 12,
                borderRadius: 6,
                background: "#fafafa",
              }}
            >
              {editingId === draft.id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    style={{
                      width: "100%",
                      padding: 8,
                      marginBottom: 8,
                      border: "1px solid #ccc",
                      borderRadius: 4,
                    }}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Content"
                    rows={6}
                    style={{
                      width: "100%",
                      padding: 8,
                      marginBottom: 8,
                      border: "1px solid #ccc",
                      borderRadius: 4,
                    }}
                  />
                  <button
                    onClick={() => handleSaveEdit(draft.id)}
                    style={{
                      padding: "8px 12px",
                      marginRight: 8,
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: "8px 12px",
                      background: "#ccc",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h3 style={{ margin: "0 0 8px 0" }}>{draft.title}</h3>
                  <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: 14 }}>
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </p>
                  {draft.content && <p>{draft.content}</p>}
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(draft)}
                      style={{
                        padding: "8px 12px",
                        background: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlePublish(draft.id)}
                      disabled={publishing === draft.id}
                      style={{
                        padding: "8px 12px",
                        background: publishing === draft.id ? "#ccc" : "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: publishing === draft.id ? "not-allowed" : "pointer",
                      }}
                    >
                      {publishing === draft.id ? "Publishing..." : "Publish"}
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
