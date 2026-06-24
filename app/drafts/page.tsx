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

  useEffect(() => {
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

    fetchDrafts();
  }, []);

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
              <h3 style={{ margin: "0 0 8px 0" }}>{draft.title}</h3>
              <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: 14 }}>
                {new Date(draft.createdAt).toLocaleDateString()}
              </p>
              {draft.content && <p>{draft.content}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
