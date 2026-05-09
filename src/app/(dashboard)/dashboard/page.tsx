import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [brand, recentEvaluations, recentAnalyses] = await Promise.all([
    prisma.brand.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        brandBrain: true,
        _count: {
          select: { evaluations: true, analyses: true, chatSessions: true },
        },
      },
    }),
    prisma.evaluation.findMany({
      where: {
        brand: { userId: session.user.id },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { brand: { select: { name: true } } },
    }),
    prisma.instagramAnalysis.findMany({
      where: {
        brand: { userId: session.user.id },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { brand: { select: { name: true } } },
    }),
  ]);

  const avgScore =
    recentEvaluations.length > 0
      ? Math.round(
          recentEvaluations.reduce((sum: number, e: { overallScore: number }) => sum + e.overallScore, 0) /
            recentEvaluations.length
        )
      : null;

  return (
    <div>
      <Header
        title={`Welcome back${session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
        subtitle={brand?.name ? `Managing ${brand.name}` : "Brand Performance Dashboard"}
      />
      <DashboardClient
        brand={brand}
        recentEvaluations={recentEvaluations}
        recentAnalyses={recentAnalyses}
        avgScore={avgScore}
      />
    </div>
  );
}
