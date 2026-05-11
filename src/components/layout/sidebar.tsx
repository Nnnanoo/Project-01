"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  Star,
  Camera,
  MessageSquare,
  Settings,
  ChevronDown,
  Plus,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    exact: true,
  },
  {
    href: "/evaluate",
    icon: Star,
    label: "Design Evaluation",
  },
  {
    href: "/instagram",
    icon: Camera,
    label: "Instagram Analysis",
  },
  {
    href: "/assistant",
    icon: MessageSquare,
    label: "Brand Assistant",
    badge: "AI",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

interface SidebarProps {
  brandName?: string;
  brandBrainStatus?: string;
}

export function Sidebar({ brandName, brandBrainStatus }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border/50 bg-[hsl(var(--sidebar))] h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/50">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-base">Whisperly</span>
      </div>

      {/* Brand Selector */}
      {brandName && (
        <div className="px-3 py-3 border-b border-border/50">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-accent transition-colors text-left">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{brandName}</p>
              <p className="text-xs text-muted-foreground">
                {brandBrainStatus === "completed" ? "Brain active" : "Initializing..."}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 group",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="default" className="text-[10px] h-4 px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-0 w-0.5 h-4 bg-primary rounded-l-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* New Evaluation CTA */}
      <div className="px-3 py-3 border-t border-border/50">
        <Link href="/evaluate">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
            <Plus className="w-4 h-4" />
            New Evaluation
          </button>
        </Link>
      </div>

      {/* User Profile */}
      <div className="px-3 pb-4 border-t border-border/50 pt-3">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="text-xs">
              {session?.user?.name?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
