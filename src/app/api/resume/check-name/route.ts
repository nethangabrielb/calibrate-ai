import { NextRequest, NextResponse } from "next/server";

import { isUserAuthenticated } from "@/lib/isAuthenticated";
import prisma from "@/lib/prisma";

export const GET = async (request: NextRequest) => {
  // First we check if user is authenticated
  const { isAuthenticated, user } = await isUserAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumeName = request.nextUrl.searchParams.get("resumeName");

  if (!resumeName) {
    return NextResponse.json(
      { error: "Resume name is required" },
      { status: 400 },
    );
  }

  try {
    const existingResume = await prisma.resume.findFirst({
      where: {
        name: {
          startsWith: resumeName,
        },
        userId: user.id,
      },
    });
    if (existingResume) {
      return NextResponse.json({ success: true, exists: true });
    } else {
      return NextResponse.json({ success: true, exists: false });
    }
  } catch (error) {
    console.error("Error checking resume name:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
