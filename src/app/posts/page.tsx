import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function PostListPage({ searchParams }: Props) {
  const { q, category } = await searchParams;
  const posts = await prisma.post.findMany({
    where: {
      AND: [
        category && category !== "all" ? { category } : {},
        q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }] } : {}
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true, _count: { select: { comments: true, likes: true } } }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">전체 게시글</h1>
      <div className="grid gap-6">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
    </div>
  );
}
