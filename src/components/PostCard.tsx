import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function PostCard({ post }: { post: any }) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User size={16} />
            <span className="font-medium text-gray-700">{post.author?.name || "익명"}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</span>
          </div>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-semibold">{post.category}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{post.title}</h3>
        <p className="text-gray-600 line-clamp-2 mb-4 text-sm leading-relaxed">{post.content.replace(/<[^>]*>?/gm, '')}</p>
        <div className="flex items-center space-x-6 text-sm text-gray-400 font-medium">
          <div className="flex items-center space-x-1"><ThumbsUp size={16} /><span>{post._count?.likes || 0}</span></div>
          <div className="flex items-center space-x-1"><MessageSquare size={16} /><span>{post._count?.comments || 0}</span></div>
          <div className="flex items-center space-x-1"><Eye size={16} /><span>{post.views || 0}</span></div>
        </div>
      </div>
    </Link>
  );
}
