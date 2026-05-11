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

  if (status === "loading") return <div className="text-center py-20">로딩 중...</div>;
  if (status === "unauthenticated") { router.push("/auth/signin"); return null; }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    
    if (!content || content === "<p><br></p>") {
      alert("내용을 입력해주세요.");
      return;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category: formData.get("category"), content }),
    });

    if (res.ok) { 
      router.push("/"); 
      router.refresh(); 
    } else { 
      const error = await res.json();
      alert(`저장 실패: ${error.message || "알 수 없는 오류"}`); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="title" placeholder="제목을 입력하세요" required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        <select name="category" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="general">자유게시판</option>
          <option value="qna">질문답변</option>
          <option value="info">정보공유</option>
        </select>
        <div className="h-80 mb-12">
          <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full" />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-colors">
          등록하기
        </button>
      </form>
    </div>
  );
}
