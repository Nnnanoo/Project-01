import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brands = await prisma.brand.findMany({
    where: { userId: session.user.id },
    include: {
      brandBrain: {
        select: {
          id: true,
          processingStatus: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          evaluations: true,
          analyses: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ success: true, brands });
}
