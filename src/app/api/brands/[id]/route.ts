import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const brand = await prisma.brand.findFirst({
    where: { id, userId: session.user.id },
    include: {
      brandBrain: true,
      assets: {
        orderBy: { createdAt: "desc" },
      },
      evaluations: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: {
          evaluations: true,
          analyses: true,
          chatSessions: true,
        },
      },
    },
  });

  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, brand });
}
