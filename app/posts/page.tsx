"use client";

import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  createdAt: string;
}

interface Comment {
  id: number;
  content: string;
  postId: number;
  published: boolean;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = (postId: number) => {
    if (!expandedComments[postId]) {
      fetchComments(postId);
    }
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const openCommentModal = (postId: number) => {
    setSelectedPostId(postId);
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPostId(null);
    setCommentContent("");
  };

  const submitComment = async () => {
    if (!commentContent.trim() || !selectedPostId) return;

    setSubmittingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentContent,
          postId: selectedPostId,
          published: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit comment");

      // Refresh comments for this post
      await fetchComments(selectedPostId);
      closeCommentModal();
    } catch (err) {
      console.error(err);
      alert("Failed to submit comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <section>
      <h2>Posts</h2>

      {loading && <p>Loading...</p>}

      {!loading && posts.length === 0 && (
        <p style={{ marginTop: 16 }}>No published posts found.</p>
      )}

      {posts.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {posts.map((post) => (
            <article
              key={post.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 12,
                borderRadius: 6,
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>{post.title}</h3>
              <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: 14 }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              {post.content && <p>{post.content}</p>}

              {/* Comment Button and Comments Section */}
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button
                  onClick={() => openCommentModal(post.id)}
                  style={{
                    padding: "8px 12px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Comment
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  style={{
                    padding: "8px 12px",
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {expandedComments[post.id] ? "Hide Comments" : "View Comments"}
                </button>
              </div>

              {/* Comments Display */}
              {expandedComments[post.id] && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #eee" }}>
                  {comments[post.id]?.length === 0 ? (
                    <p style={{ color: "#999", fontSize: 14 }}>No comments yet.</p>
                  ) : (
                    <div>
                      {comments[post.id]?.map((comment) => (
                        <div
                          key={comment.id}
                          style={{
                            background: "#f9fafb",
                            padding: 8,
                            marginBottom: 8,
                            borderRadius: 4,
                            borderLeft: "3px solid #3b82f6",
                          }}
                        >
                          <p style={{ margin: "0 0 4px 0", fontSize: 14 }}>
                            {comment.content}
                          </p>
                          <p style={{ margin: 0, color: "#999", fontSize: 12 }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Comment Modal Overlay */}
      {showCommentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeCommentModal}
        >
          <div
            style={{
              background: "white",
              borderRadius: 8,
              padding: 24,
              maxWidth: 500,
              width: "90%",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0" }}>Add a Comment</h3>

            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Share your feedback..."
              rows={6}
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: 14,
                fontFamily: "inherit",
                marginBottom: 16,
              }}
            />

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={closeCommentModal}
                disabled={submittingComment}
                style={{
                  padding: "8px 16px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitComment}
                disabled={submittingComment || !commentContent.trim()}
                style={{
                  padding: "8px 16px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: submittingComment || !commentContent.trim() ? "not-allowed" : "pointer",
                  opacity: submittingComment || !commentContent.trim() ? 0.6 : 1,
                  fontSize: 14,
                }}
              >
                {submittingComment ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
