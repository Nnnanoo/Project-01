import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildBrandBrain } from "@/lib/ai/brand-brain";
import { extractTextFromBuffer } from "@/lib/ai/pdf-processor";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { OnboardingData } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const rawData = formData.get("data") as string;
    const files = formData.getAll("files") as File[];

    const data: OnboardingData = JSON.parse(rawData);

    // Create slug from brand name
    const slug =
      data.brandInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 50) +
      "-" +
      uuidv4().slice(0, 8);

    // Create brand record
    const brand = await prisma.brand.create({
      data: {
        userId: session.user.id,
        name: data.brandInfo.name,
        slug,
        industry: data.brandInfo.industry,
        country: data.brandInfo.country,
        description: data.brandInfo.description,
        targetAudience: data.brandInfo.targetAudience,
        competitors: data.brandInfo.competitors
          ? data.brandInfo.competitors.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        personality: data.brandInfo.personality,
        toneOfVoice: data.brandInfo.toneOfVoice,
        mission: data.brandInfo.mission,
        vision: data.brandInfo.vision,
        instagramUsername: data.socialMedia.instagramUsername,
        mainPlatform: data.socialMedia.mainPlatform,
        marketingGoals: data.socialMedia.marketingGoals,
        contentTypes: data.socialMedia.contentTypes,
        postingFrequency: data.socialMedia.postingFrequency,
        preferredColors: data.visualIdentity.preferredColors
          ? data.visualIdentity.preferredColors.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        typographyStyle: data.visualIdentity.typographyStyle,
        designStyle: data.visualIdentity.designStyle,
        contentStyle: data.visualIdentity.contentStyle,
        exampleBrands: data.visualIdentity.exampleBrands
          ? data.visualIdentity.exampleBrands.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        onboardingCompleted: true,
        onboardingStep: 4,
      },
    });

    // Process and store uploaded files
    const uploadDir = path.join(process.cwd(), "public", "uploads", brand.id);
    await mkdir(uploadDir, { recursive: true });

    let pdfText = "";
    const assetRecords = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name);
      const storedName = `${uuidv4()}${ext}`;
      const filePath = path.join(uploadDir, storedName);
      await writeFile(filePath, buffer);

      const fileUrl = `/uploads/${brand.id}/${storedName}`;

      // Extract text from PDF
      if (file.type === "application/pdf" && !pdfText) {
        try {
          const extraction = await extractTextFromBuffer(buffer);
          pdfText = extraction.text;
        } catch {
          // PDF extraction failed — continue without it
        }
      }

      let assetType = "other";
      if (file.type === "application/pdf") assetType = "brand_guidelines";
      else if (file.name.toLowerCase().includes("logo")) assetType = "logo";
      else if (file.name.toLowerCase().includes("mood")) assetType = "moodboard";
      else if (file.type.startsWith("font") || [".ttf", ".otf", ".woff", ".woff2"].includes(ext)) {
        assetType = "font";
      } else if (file.type.startsWith("image")) assetType = "image";

      assetRecords.push({
        brandId: brand.id,
        type: assetType,
        fileName: file.name,
        fileUrl,
        mimeType: file.type,
        fileSize: file.size,
      });
    }

    if (assetRecords.length > 0) {
      await prisma.brandAsset.createMany({ data: assetRecords });
    }

    // Initialize Brand Brain record as pending
    const brandBrainRecord = await prisma.brandBrain.create({
      data: {
        brandId: brand.id,
        processingStatus: "processing",
      },
    });

    // Build Brand Brain asynchronously (don't await — let it process in background)
    buildBrandBrain({
      pdfText: pdfText || undefined,
      onboardingData: data,
      brandName: data.brandInfo.name,
    })
      .then(async (extraction) => {
        await prisma.brandBrain.update({
          where: { id: brandBrainRecord.id },
          data: {
            extractedColors: extraction.extractedColors as object[],
            typography: extraction.typography as object,
            toneProfile: extraction.toneProfile as object,
            logoUsageRules: extraction.logoUsageRules,
            spacingRules: extraction.spacingRules,
            designDirection: extraction.designDirection,
            visualLanguage: extraction.visualLanguage,
            brandPersonality: extraction.brandPersonality,
            forbiddenUsages: extraction.forbiddenUsages,
            communicationStyle: extraction.communicationStyle,
            rawExtraction: extraction as object,
            processingStatus: "completed",
          },
        });
      })
      .catch(async (error) => {
        await prisma.brandBrain.update({
          where: { id: brandBrainRecord.id },
          data: {
            processingStatus: "failed",
            processingError: error.message,
          },
        });
      });

    return NextResponse.json({
      success: true,
      brandId: brand.id,
      brandName: brand.name,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
