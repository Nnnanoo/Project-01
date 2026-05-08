import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const brand = await prisma.brand.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      brandBrain: {
        select: { processingStatus: true },
      },
    },
  });

  if (!brand?.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        brandName={brand?.name}
        brandBrainStatus={brand?.brandBrain?.processingStatus}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
