import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { User, ThumbsUp, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// Next.js 15의 새로운 타입 규칙 적용 (Promise 기반)
export default async function PostDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const post = await prisma.post.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: { 
      author: true, 
      _count: { select: { comments: true, likes: true } }
    }
  }).catch(() => null);

  if (!post) notFound();

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-10 space-y-4">
        <span className="text-blue-600 font-bold text-sm"># {post.category}</span>
        <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
        <div className="flex items-center space-x-4 py-4 border-y border-gray-100">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <User size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900">{post.author?.name || "익명"}</p>
            <p className="text-xs text-gray-500 flex items-center space-x-1">
              <Calendar size={12} />
              <span>{format(new Date(post.createdAt), "yyyy. MM. dd.", { locale: ko })}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="prose lg:prose-xl max-w-none mb-16 text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="flex justify-center space-x-8 py-8 border-t border-gray-100">
        <div className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition">
            <ThumbsUp size={24} />
          </div>
          <span className="text-sm font-bold text-gray-600 mt-2">{post._count.likes}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <MessageSquare size={24} />
          </div>
          <span className="text-sm font-bold text-gray-600 mt-2">{post._count.comments}</span>
        </div>
      </div>
    </article>
  );
}
