"use client";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) { 
      setError("로그인 실패"); 
    } else { 
      router.push("/"); 
      router.refresh(); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
      {message && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-lg text-sm border border-blue-100">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="이메일" required className="w-full p-3 bg-gray-50 border rounded-xl" />
        <input name="password" type="password" placeholder="비밀번호" required className="w-full p-3 bg-gray-50 border rounded-xl" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">로그인</button>
      </form>
      <p className="mt-4 text-center text-sm">계정이 없으신가요? <Link href="/auth/signup" className="text-blue-600">회원가입</Link></p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
