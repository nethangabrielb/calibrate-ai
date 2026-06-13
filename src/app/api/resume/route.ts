import { extractText, getDocumentProxy } from "unpdf";

import { NextRequest, NextResponse } from "next/server";

import { isUserAuthenticated } from "@/lib/isAuthenticated";
import prisma from "@/lib/prisma";

export const POST = async (_request: NextRequest) => {
  // First we check if user is authenticated
  const { isAuthenticated, user } = await isUserAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = _request.nextUrl.searchParams;
  const save = searchParams.get("save");
  const contentType = _request.headers.get("content-type") || "";

  let text = "";
  let name = "";

  if (contentType.includes("application/json")) {
    const body = await _request.json();
    text = body.content || "";
    name = body.name || "Enhanced Resume.pdf";

    if (!text) {
      return NextResponse.json({ error: "No resume content provided" }, { status: 400 });
    }
  } else {
    const formData = await _request.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file?.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text: extractedText } = await extractText(pdf, { mergePages: true });
    text = extractedText;
    name = file.name;
  }

  // save resume and associate it with current user in database
  if (save === "true") {
    const resume = await prisma.resume.create({
      data: {
        content: text,
        userId: user.id,
        name: name,
      },
    });

    // Return the resume data in the response
    return NextResponse.json({ success: true, resume: resume });
  } else {
    // Return the resume content in the response
    return NextResponse.json({ success: true, resume: text });
  }
};
