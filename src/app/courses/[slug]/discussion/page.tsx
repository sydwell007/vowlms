"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/data";
import { use } from "react";

type Post = {
  id: string;
  author: string;
  initials: string;
  role: "learner" | "facilitator";
  time: string;
  body: string;
  replies: Reply[];
  pinned?: boolean;
};

type Reply = {
  id: string;
  author: string;
  initials: string;
  role: "learner" | "facilitator";
  time: string;
  body: string;
};

const mockPosts: Post[] = [
  {
    id: "p1",
    author: "Themba Nkosi (Facilitator)",
    initials: "TN",
    role: "facilitator",
    time: "2 days ago",
    body: "Welcome to the course discussion! Use this space to ask questions, share insights, and connect with fellow learners. I review all posts and reply within 24 hours.",
    replies: [],
    pinned: true,
  },
  {
    id: "p2",
    author: "Amina Mokoena",
    initials: "AM",
    role: "learner",
    time: "1 day ago",
    body: "I'm struggling with the VR practice module. Is the headset required or can I use the desktop browser version?",
    replies: [
      { id: "r1", author: "Themba Nkosi", initials: "TN", role: "facilitator", time: "22 hours ago", body: "Great question! You can complete the VR practice on a standard browser — the headset is optional and enhances the experience. The desktop version gives full credit." },
      { id: "r2", author: "Sipho Dlamini", initials: "SD", role: "learner", time: "20 hours ago", body: "I tried the desktop version yesterday and it worked perfectly. The 3D model loads in the browser window." },
    ],
  },
  {
    id: "p3",
    author: "Zanele Mahlangu",
    initials: "ZM",
    role: "learner",
    time: "18 hours ago",
    body: "The career readiness module is very practical. The CV template provided in the resources section is excellent — I already updated mine!",
    replies: [
      { id: "r3", author: "Amina Mokoena", initials: "AM", role: "learner", time: "16 hours ago", body: "Agreed! The PlugConnect integration tip at the end was also really helpful. Looking forward to the assessment." },
    ],
  },
];

export default function CourseDiscussionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  function submitPost() {
    if (!newPost.trim()) return;
    const post: Post = {
      id: `p-local-${posts.length + 1}`,
      author: "You (Amina Mokoena)",
      initials: "AM",
      role: "learner",
      time: "Just now",
      body: newPost,
      replies: [],
    };
    setPosts((ps) => [ps[0], post, ...ps.slice(1)]);
    setNewPost("");
  }

  function submitReply(postId: string) {
    if (!replyText.trim()) return;
    const reply: Reply = {
      id: `r-local-${postId}-${(posts.find((post) => post.id === postId)?.replies.length ?? 0) + 1}`,
      author: "You (Amina Mokoena)",
      initials: "AM",
      role: "learner",
      time: "Just now",
      body: replyText,
    };
    setPosts((ps) =>
      ps.map((p) =>
        p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
      )
    );
    setReplyText("");
    setReplyTo(null);
  }

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-muted">
          <Link href="/courses" className="hover:text-ink">Courses</Link>
          <span>/</span>
          <Link href={`/courses/${slug}`} className="hover:text-ink">{course.title}</Link>
          <span>/</span>
          <span className="text-ink font-medium">Discussion</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Course Discussion</h1>
            <p className="mt-1 text-sm text-muted">{course.title} · {posts.length} posts</p>
          </div>
          <Link href={`/courses/${slug}`} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50">
            ← Back to course
          </Link>
        </div>

        {/* New post form */}
        <div className="premium-card rounded-2xl p-5 mb-6">
          <p className="text-sm font-semibold text-ink mb-3">Start a discussion</p>
          <textarea
            rows={3}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Ask a question, share an insight, or help a fellow learner…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition resize-none"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={submitPost}
              disabled={!newPost.trim()}
              className="rounded-lg bg-[#06111f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0d2239] disabled:opacity-40"
            >
              Post →
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-5">
          {posts.map((post) => (
            <article key={post.id} className={`premium-card rounded-2xl p-5 ${post.pinned ? "border-l-4 border-l-gold" : ""}`}>
              {post.pinned && (
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="text-xs">📌</span>
                  <p className="text-xs font-semibold text-gold uppercase tracking-wide">Pinned by facilitator</p>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${post.role === "facilitator" ? "bg-[#1166c8] text-white" : "bg-gold text-[#06111f]"}`}>
                  {post.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{post.author}</p>
                    {post.role === "facilitator" && (
                      <span className="rounded-full bg-[#1166c8]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1166c8]">Facilitator</span>
                    )}
                    <p className="text-xs text-muted">{post.time}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{post.body}</p>
                  <button
                    onClick={() => setReplyTo(replyTo === post.id ? null : post.id)}
                    className="mt-2 text-xs font-medium text-[#1166c8] hover:underline"
                  >
                    {post.replies.length > 0 ? `${post.replies.length} ${post.replies.length === 1 ? "reply" : "replies"} · ` : ""}Reply
                  </button>
                </div>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="mt-4 ml-12 space-y-3">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${reply.role === "facilitator" ? "bg-[#1166c8] text-white" : "bg-slate-200 text-ink"}`}>
                        {reply.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-ink">{reply.author}</p>
                          {reply.role === "facilitator" && (
                            <span className="rounded-full bg-[#1166c8]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#1166c8]">Facilitator</span>
                          )}
                          <p className="text-[10px] text-muted">{reply.time}</p>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-700">{reply.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyTo === post.id && (
                <div className="mt-4 ml-12">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply…"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition resize-none"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => submitReply(post.id)}
                      disabled={!replyText.trim()}
                      className="rounded-md bg-[#06111f] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0d2239] disabled:opacity-40"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-muted transition hover:text-ink"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
