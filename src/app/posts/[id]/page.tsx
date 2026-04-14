import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { User, ThumbsUp, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.update({
    where: { id: (await params).id },
    data: { views: { increment: 1 } },
    include: { author: true, _count: { select: { comments: true, likes: true } } }
  }).catch(() => null);

  if (!post) notFound();

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-10 space-y-4">
        <span className="text-blue-600 font-bold text-sm"># {post.category}</span>
        <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
        <div className="flex items-center space-x-4 py-4 border-y border-gray-100">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><User size={20} /></div>
          <div>
            <p className="font-bold">{post.author?.name || "익명"}</p>
            <p className="text-xs text-gray-500">{format(new Date(post.createdAt), "yyyy. MM. dd.", { locale: ko })}</p>
          </div>
        </div>
      </header>
      <div className="prose lg:prose-xl max-w-none mb-16" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="flex justify-center space-x-8 py-8 border-t">
        <div className="flex flex-col items-center"><ThumbsUp className="text-gray-400" size={32} /><span>{post._count.likes}</span></div>
        <div className="flex flex-col items-center"><MessageSquare className="text-gray-400" size={32} /><span>{post._count.comments}</span></div>
      </div>
    </article>
  );
}
