"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function NewPostPage() {
  const router = useRouter();
  const { status } = useSession();
  const [content, setContent] = useState("");
  if (status === "unauthenticated") { router.push("/auth/signin"); return null; }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formData.get("title"), category: formData.get("category"), content }),
    });
    if (res.ok) { router.push("/"); router.refresh(); } else { alert("저장 실패"); }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="title" placeholder="제목" required className="w-full p-3 border rounded-xl" />
        <select name="category" className="w-full p-3 border rounded-xl">
          <option value="자유게시판">자유게시판</option><option value="질문답변">질문답변</option>
        </select>
        <ReactQuill theme="snow" value={content} onChange={setContent} className="h-64 mb-12" />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">등록하기</button>
      </form>
    </div>
  );
}
