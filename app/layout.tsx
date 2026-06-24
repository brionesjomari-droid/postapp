import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Posts App",
  description: "A minimal posts app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        <header style={{ background: "#fff", borderBottom: "1px solid #e6e6e6" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px" }}>
            <h1 style={{ margin: 0, fontWeight: 700 }}>Posts App</h1>
            <nav>
              <Link href="/posts" className="nav-link" style={{ marginRight: 12 }}>Posts</Link>
              <Link href="/drafts" className="nav-link" style={{ marginRight: 12 }}>Drafts</Link>
              <Link href="/add-post" className="nav-link">Add Post</Link>
            </nav>
          </div>
        </header>

        <main className="container" style={{ padding: "32px 24px" }}>{children}</main>
      </body>
    </html>
  );
}
