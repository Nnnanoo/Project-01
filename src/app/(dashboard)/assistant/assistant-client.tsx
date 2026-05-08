"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Sparkles, Brain,
  Plus, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface Props {
  brands: { id: string; name: string }[];
  recentSessions: {
    id: string;
    title?: string | null;
    brandId: string;
    updatedAt: Date;
    messages: { content: string; role: string }[];
  }[];
}

const QUICK_PROMPTS = [
  "Does this caption fit our brand tone?",
  "Write a caption in our tone of voice",
  "Suggest 5 CTA ideas for our audience",
  "What are our brand color rules?",
  "Generate Instagram post ideas for this week",
  "How should we write for our target audience?",
];

export function AssistantClient({ brands, recentSessions }: Props) {
  const [selectedBrand, setSelectedBrand] = useState(brands[0]?.id || "");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions] = useState(recentSessions);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleNewChat() {
    setSessionId(undefined);
    setMessages([]);
  }

  async function loadSession(id: string, brandId: string) {
    setSelectedBrand(brandId);
    setSessionId(id);
    const res = await fetch(`/api/assistant?brandId=${brandId}&sessionId=${id}`);
    const data = await res.json();
    if (data.session?.messages) {
      setMessages(
        data.session.messages.map((m: { id: string; role: string; content: string; createdAt: string }) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          createdAt: new Date(m.createdAt),
        }))
      );
    }
  }

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || !selectedBrand || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: selectedBrand,
          sessionId,
          message: messageText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (!sessionId) setSessionId(data.sessionId);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      toast.error("Assistant failed to respond");
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const brandName = brands.find((b) => b.id === selectedBrand)?.name || "Brand";

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-border/50 bg-muted/20">
        <div className="p-3 border-b border-border/50">
          <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); handleNewChat(); }}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-2 border-b border-border/50">
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-8" onClick={handleNewChat}>
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => loadSession(s.id, s.brandId)}
                className={cn(
                  "w-full text-left p-2 rounded-lg transition-colors",
                  sessionId === s.id ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
                )}
              >
                <p className="text-xs font-medium truncate">{s.title || "New conversation"}</p>
                <p className="text-[10px] mt-0.5 opacity-70">{formatDate(s.updatedAt)}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4 lg:p-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto pt-8">
              {/* Welcome */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/20">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-lg font-bold mb-1">
                  {brandName} Brand Assistant
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ask me anything about your brand — guidelines, tone, copy ideas, or feedback.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border/50 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span className="text-xs">{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className={cn(
                        "text-xs font-bold",
                        msg.role === "assistant"
                          ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                          : "bg-muted"
                      )}>
                        {msg.role === "assistant" ? "AI" : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-bold">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border/50 p-3 lg:p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 bg-muted/40 rounded-xl border border-border/50 p-2 pl-3 focus-within:border-primary/40 transition-colors">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${brandName} Assistant anything...`}
                className="flex-1 min-h-0 max-h-28 bg-transparent border-0 p-0 resize-none focus-visible:ring-0 text-sm"
                rows={1}
              />
              <Button
                size="icon"
                variant="gradient"
                className="h-8 w-8 shrink-0 rounded-lg"
                disabled={!input.trim() || loading}
                onClick={() => sendMessage()}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
