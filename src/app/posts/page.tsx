import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

export default async function PostListPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q, category: cat } = await searchParams;
  const posts = await prisma.post.findMany({
    where: {
      AND: [
        cat && cat !== "all" ? { category: cat } : {},
        q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }] } : {}
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true, _count: { select: { comments: true, likes: true } } }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">커뮤니티 광장</h1>
      <div className="grid gap-6">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
    </div>
  );
}
