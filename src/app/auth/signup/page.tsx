"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignUpPage() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });
      
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok) {
        alert("가입 성공! 로그인해주세요.");
        router.push("/auth/signin");
      } else {
        const errorMessage = data?.message || `오류 발생 (상태 코드: ${res.status})`;
        console.error("Signup failed:", data || res.statusText);
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="이름" required className="w-full p-3 bg-gray-50 border rounded-xl" />
        <input name="email" type="email" placeholder="이메일" required className="w-full p-3 bg-gray-50 border rounded-xl" />
        <input name="password" type="password" placeholder="비밀번호" required className="w-full p-3 bg-gray-50 border rounded-xl" />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">가입하기</button>
      </form>
    </div>
  );
}
