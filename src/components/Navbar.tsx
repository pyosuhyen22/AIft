"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LogIn, FileText } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">AIft</Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          {session ? (
            <>
              <Link href="/posts/new" className="flex items-center space-x-1 hover:text-blue-600"><FileText size={18} /><span>글쓰기</span></Link>
              <Link href="/profile" className="flex items-center space-x-1 hover:text-blue-600"><User size={18} /><span>마이페이지</span></Link>
              <button onClick={() => signOut()} className="text-red-500 hover:text-red-700">로그아웃</button>
            </>
          ) : (
            <Link href="/auth/signin" className="hover:text-blue-600">로그인</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
