"use client";

import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchPosts();
  }, []);

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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
