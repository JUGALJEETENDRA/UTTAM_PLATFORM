import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already whitelisted" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        role: "TEACHER"
      }
    });

    return NextResponse.json(newUser);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
