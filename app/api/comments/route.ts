import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST create a new comment
export async function POST(request: NextRequest) {
  try {
    const { content, postId, published } = await request.json();

    console.log("Creating comment:", { content, postId, published });

    if (!content || !postId) {
      return NextResponse.json(
        { error: "Content and postId are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        published: published ?? true,
      },
    });

    console.log("Comment created:", comment);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          return NextResponse.json(
            { error: `Failed to create comment: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// GET comments by postId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { 
        postId: parseInt(postId, 10),
        published: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
