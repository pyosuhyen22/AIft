import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 중복 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "이미 가입된 이메일입니다." },
        { status: 400 }
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "회원가입 성공", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error details:", error);
    // Prisma 관련 에러 메시지 세분화
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 400 });
    }
    return NextResponse.json(
      { message: `서버 오류: ${error.message || "알 수 없는 오류"}` },
      { status: 500 }
    );
  }
}
