import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { InstagramClient } from "./instagram-client";

export default async function InstagramPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [brands, recentAnalyses] = await Promise.all([
    prisma.brand.findMany({
      where: { userId: session.user.id, onboardingCompleted: true },
      select: { id: true, name: true, instagramUsername: true },
    }),
    prisma.instagramAnalysis.findMany({
      where: { brand: { userId: session.user.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { brand: { select: { name: true } } },
    }),
  ]);

  return (
    <div>
      <Header
        title="Instagram Analysis"
        subtitle="Feed consistency & brand performance"
      />
      <InstagramClient
        brands={brands}
        recentAnalyses={recentAnalyses.map((a) => ({
          ...a,
          contentDirection: a.contentDirection ?? "",
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
