import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostCard from "@/components/PostCard";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { posts: { include: { author: true, _count: { select: { comments: true, likes: true } } } } }
  });
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>
      <div className="bg-gray-50 p-6 rounded-2xl mb-10">
        <p className="text-xl font-bold">{user?.name}</p>
        <p className="text-gray-500">{user?.email}</p>
      </div>
      <h2 className="text-xl font-bold mb-6">내가 쓴 글</h2>
      <div className="grid gap-6">{user?.posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
    </div>
  );
}
