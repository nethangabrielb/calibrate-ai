import { extractText, getDocumentProxy } from "unpdf";

import { NextRequest, NextResponse } from "next/server";

import { isUserAuthenticated } from "@/lib/isAuthenticated";

export const POST = async (_request: NextRequest) => {
  // First we check if user is authenticated
  const { isAuthenticated, user } = await isUserAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await _request.formData();

  const file = formData.get("resume") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = await file?.arrayBuffer();
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });

  return NextResponse.json({ success: true, resume: text });
};
