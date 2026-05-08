import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { analyzeInstagramFeed } from "@/lib/ai/instagram-analyzer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const brandId = formData.get("brandId") as string;
    const username = formData.get("username") as string;
    const images = formData.getAll("images") as File[];

    if (!brandId || images.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
      include: { brandBrain: true },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", brandId, "instagram");
    await mkdir(uploadDir, { recursive: true });

    const imageDataUrls: string[] = [];
    const storedImages: string[] = [];

    for (const img of images.slice(0, 9)) {
      const buffer = Buffer.from(await img.arrayBuffer());
      const ext = path.extname(img.name) || ".jpg";
      const storedName = `ig-${uuidv4()}${ext}`;
      await writeFile(path.join(uploadDir, storedName), buffer);
      storedImages.push(`/uploads/${brandId}/instagram/${storedName}`);
      imageDataUrls.push(`data:${img.type};base64,${buffer.toString("base64")}`);
    }

    const result = await analyzeInstagramFeed(
      imageDataUrls,
      brand.brandBrain as Parameters<typeof analyzeInstagramFeed>[1],
      brand.name,
      username || brand.instagramUsername || "unknown"
    );

    const analysis = await prisma.instagramAnalysis.create({
      data: {
        brandId,
        username: username || brand.instagramUsername || "unknown",
        feedConsistency: result.feedConsistency,
        brandConsistency: result.brandConsistency,
        engagementQuality: result.engagementQuality,
        contentDirection: result.contentDirection,
        visualStorytelling: result.visualStorytelling,
        postCount: images.length,
        analysisReport: result.analysisReport,
        recommendations: result.recommendations,
        analyzedImages: storedImages,
      },
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Instagram analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
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

  const analyses = await prisma.instagramAnalysis.findMany({
    where: { brandId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ success: true, analyses });
}
