import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBrandAssistantResponse } from "@/lib/ai/brand-assistant";
import type { AssistantMessage } from "@/lib/ai/brand-assistant";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { brandId, sessionId, message } = body;

    if (!brandId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
      include: { brandBrain: true },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Find or create chat session
    let chatSession = sessionId
      ? await prisma.chatSession.findFirst({
          where: { id: sessionId, brandId },
          include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
        })
      : null;

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          brandId,
          title: message.slice(0, 60),
          messages: {
            create: {
              role: "user",
              content: message,
            },
          },
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    } else {
      await prisma.chatMessage.create({
        data: { chatSessionId: chatSession.id, role: "user", content: message },
      });
    }

    // Build history for context
    const history: AssistantMessage[] = chatSession.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Add current message if not already added
    if (!history.find((h) => h.content === message && h.role === "user")) {
      history.push({ role: "user", content: message });
    }

    const response = await getBrandAssistantResponse(
      history,
      brand.brandBrain as Parameters<typeof getBrandAssistantResponse>[1],
      brand.name
    );

    // Store assistant response
    await prisma.chatMessage.create({
      data: {
        chatSessionId: chatSession.id,
        role: "assistant",
        content: response,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: chatSession.id,
      response,
    });
  } catch (error) {
    console.error("Assistant error:", error);
    return NextResponse.json({ error: "Assistant failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("brandId");
  const sessionId = searchParams.get("sessionId");

  if (!brandId) {
    return NextResponse.json({ error: "Missing brandId" }, { status: 400 });
  }

  if (sessionId) {
    const chatSession = await prisma.chatSession.findFirst({
      where: { id: sessionId, brandId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    return NextResponse.json({ success: true, session: chatSession });
  }

  const sessions = await prisma.chatSession.findMany({
    where: { brandId },
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: {
      messages: { take: 1, orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json({ success: true, sessions });
}
