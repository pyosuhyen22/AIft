import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// 허용할 이미지 타입과 최대 용량(바이트) 설정
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    // 로그인한 사용자만 업로드 가능
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "파일이 없습니다." }, { status: 400 });
    }

    // 카메라 사진(jpeg/jpg)도 포함해서 허용 타입인지 확인
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: `지원하지 않는 파일 형식입니다: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "파일 용량이 너무 큽니다. (최대 10MB)" },
        { status: 400 }
      );
    }

    // 파일명이 중복되지 않도록 타임스탬프 + 원본 이름 조합
    const filename = `${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
    });

    // 업로드 성공 시 접근 가능한 URL 반환 → 에디터 본문에 삽입됨
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}
