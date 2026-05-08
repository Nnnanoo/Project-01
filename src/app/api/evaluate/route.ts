import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { evaluateDesign } from "@/lib/ai/design-evaluator";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { PostType } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const brandId = formData.get("brandId") as string;
    const postType = formData.get("postType") as PostType;
    const imageFile = formData.get("image") as File;

    if (!brandId || !imageFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify brand ownership
    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
      include: { brandBrain: true },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Store the uploaded image
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const ext = path.extname(imageFile.name) || ".jpg";
    const storedName = `eval-${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", brandId);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, storedName), buffer);
    const imageUrl = `/uploads/${brandId}/${storedName}`;

    // Convert to base64 for Vision API
    const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    // Run evaluation
    const result = await evaluateDesign(
      base64,
      brand.brandBrain as Parameters<typeof evaluateDesign>[1],
      postType || "instagram_post",
      brand.name
    );

    // Store evaluation in DB
    const evaluation = await prisma.evaluation.create({
      data: {
        brandId,
        postType: postType || "instagram_post",
        imageUrl,
        overallScore: result.overallScore,
        brandConsistency: result.brandConsistency,
        typographyScore: result.typographyScore,
        colorScore: result.colorScore,
        layoutScore: result.layoutScore,
        hierarchyScore: result.hierarchyScore,
        toneScore: result.toneScore,
        emotionalScore: result.emotionalScore,
        aestheticsScore: result.aestheticsScore,
        ctaScore: result.ctaScore,
        audienceFitScore: result.audienceFitScore,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
        fullAnalysis: result.fullAnalysis,
      },
    });

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("brandId");

  if (!brandId) {
    return NextResponse.json({ error: "Missing brandId" }, { status: 400 });
  }

  const brand = await prisma.brand.findFirst({
    where: { id: brandId, userId: session.user.id },
  });
  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  const evaluations = await prisma.evaluation.findMany({
    where: { brandId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ success: true, evaluations });
}
