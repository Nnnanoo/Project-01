import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildBrandBrain } from "@/lib/ai/brand-brain";
import { extractTextFromBuffer } from "@/lib/ai/pdf-processor";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { OnboardingData, BrandExtraction } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const rawData = formData.get("data") as string;
    const rawExtraction = formData.get("extraction") as string | null;
    const files = formData.getAll("files") as File[];

    const data: OnboardingData = JSON.parse(rawData);
    const extraction: BrandExtraction | null = rawExtraction ? JSON.parse(rawExtraction) : null;

    // Build slug from brand name
    const slug =
      data.brandInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 50) +
      "-" +
      uuidv4().slice(0, 8);

    // Determine primary platform
    const mainPlatform =
      data.platforms.mainPlatform ||
      data.platforms.selectedPlatforms[0] ||
      "instagram";

    // Merge color extraction into preferredColors
    const preferredColors = extraction?.colors.map((c) => c.hex) ?? [];
    const designStyle = extraction?.designStyle || null;
    const typographyStyle = extraction?.typography?.primaryFont || null;

    // Create brand record
    const brand = await prisma.brand.create({
      data: {
        userId: session.user.id,
        name: data.brandInfo.name,
        slug,
        industry: data.brandInfo.industry || null,
        country: data.brandInfo.country || null,
        region: data.brandInfo.region || null,
        description: data.brandInfo.description || null,
        targetAudience: data.brandInfo.targetAudience || null,
        competitors: data.brandInfo.competitors
          ? data.brandInfo.competitors.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        personality: data.brandInfo.personality.length > 0
          ? data.brandInfo.personality
          : (extraction?.personality ?? []),
        toneOfVoice: data.brandInfo.toneOfVoice || extraction?.toneOfVoice || null,
        instagramUsername: data.platforms.instagramUsername || null,
        linkedinUrl: data.platforms.linkedinUrl || null,
        twitterUsername: data.platforms.twitterUsername || null,
        mainPlatform,
        marketingGoals: data.platforms.marketingGoals,
        contentTypes: data.platforms.contentTypes,
        postingFrequency: data.platforms.postingFrequency || null,
        preferredColors,
        typographyStyle,
        designStyle,
        contentStyle: null,
        exampleBrands: [],
        onboardingCompleted: true,
        onboardingStep: 3,
      },
    });

    // Store uploaded files
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

      if (file.type === "application/pdf" && !pdfText) {
        try {
          const result = await extractTextFromBuffer(buffer);
          pdfText = result.text;
        } catch {
          // continue
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

    // If we have an extraction already, create BrandBrain directly as completed.
    // Otherwise, build it async in the background.
    if (extraction && extraction.colors.length > 0) {
      await prisma.brandBrain.create({
        data: {
          brandId: brand.id,
          extractedColors: extraction.colors as object[],
          typography: (extraction.typography as object) ?? {},
          toneProfile: {
            primary: data.brandInfo.toneOfVoice || extraction.toneOfVoice || "",
            adjectives: extraction.personality,
            doList: [],
            dontList: [],
            examplePhrases: [],
            communicationStyle: extraction.toneOfVoice || "",
          },
          logoUsageRules: [],
          spacingRules: [],
          designDirection: extraction.designStyle || "",
          visualLanguage: extraction.designStyle || "",
          brandPersonality: extraction.personality,
          forbiddenUsages: [],
          communicationStyle: extraction.toneOfVoice || "",
          rawExtraction: extraction as object,
          processingStatus: "completed",
        },
      });
    } else {
      // Fallback: async brand brain build
      const brandBrainRecord = await prisma.brandBrain.create({
        data: { brandId: brand.id, processingStatus: "processing" },
      });

      buildBrandBrain({
        pdfText: pdfText || undefined,
        context: {
          brandName: data.brandInfo.name,
          industry: data.brandInfo.industry,
          country: data.brandInfo.country,
          description: data.brandInfo.description,
          targetAudience: data.brandInfo.targetAudience,
          competitors: data.brandInfo.competitors,
          personality: data.brandInfo.personality,
          toneOfVoice: data.brandInfo.toneOfVoice,
          preferredColors: preferredColors.join(", "),
          typographyStyle: typographyStyle || undefined,
          designStyle: designStyle || undefined,
          mainPlatform,
          marketingGoals: data.platforms.marketingGoals,
          contentTypes: data.platforms.contentTypes,
          postingFrequency: data.platforms.postingFrequency,
        },
      })
        .then(async (result) => {
          await prisma.brandBrain.update({
            where: { id: brandBrainRecord.id },
            data: {
              extractedColors: result.extractedColors as object[],
              typography: result.typography as object,
              toneProfile: result.toneProfile as object,
              logoUsageRules: result.logoUsageRules,
              spacingRules: result.spacingRules,
              designDirection: result.designDirection,
              visualLanguage: result.visualLanguage,
              brandPersonality: result.brandPersonality,
              forbiddenUsages: result.forbiddenUsages,
              communicationStyle: result.communicationStyle,
              rawExtraction: result as object,
              processingStatus: "completed",
            },
          });
        })
        .catch(async (err) => {
          await prisma.brandBrain.update({
            where: { id: brandBrainRecord.id },
            data: { processingStatus: "failed", processingError: err.message },
          });
        });
    }

    // Grant initial trial credits record
    await prisma.creditTransaction.create({
      data: {
        userId: session.user.id,
        amount: 5000,
        type: "trial_grant",
        description: "Free trial credits on brand setup",
      },
    }).catch(() => {
      // Non-fatal — credits already set in User.credits default
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
