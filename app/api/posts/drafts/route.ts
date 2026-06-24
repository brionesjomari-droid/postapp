import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all draft posts
export async function GET() {
  try {
    const drafts = await prisma.post.findMany({
      where: { published: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(drafts, { status: 200 });
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
}
