import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { User, ThumbsUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type Props = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: { author: true, _count: { select: { comments: true, likes: true } } }
  }).catch(() => null);

  if (!post) notFound();

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-10 space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
        <div className="flex items-center space-x-4 py-4 border-y">
          <User size={20} className="text-blue-600" />
          <span className="font-bold">{post.author?.name || "익명"}</span>
          <span className="text-gray-400">|</span>
          <span className="text-sm text-gray-500">{format(new Date(post.createdAt), "yyyy. MM. dd.", { locale: ko })}</span>
        </div>
      </header>
      <div className="prose lg:prose-xl max-w-none mb-16" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
