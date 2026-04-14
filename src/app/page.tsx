import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { author: true, _count: { select: { comments: true, likes: true } } }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">🔥 실시간 인기글</h1>
      <div className="grid gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500 py-20 text-center border rounded-xl">첫 번째 게시글을 남겨보세요!</p>
        )}
      </div>
    </div>
  );
}
