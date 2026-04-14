import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauth" }, { status: 401 });
    const { title, content, category } = await req.json();
    const post = await prisma.post.create({
      data: { title, content, category, authorId: (session.user as any).id },
    });
    return NextResponse.json(post);
  } catch (error) { return NextResponse.json({ message: "Error" }, { status: 500 }); }
}
