"use client";

import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { Sun, Moon, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
          <Menu className="w-4 h-4" />
        </Button>
        <div>
          {title && <h1 className="text-sm font-semibold">{title}</h1>}
          {subtitle && (
            <p className="text-xs text-muted-foreground hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Avatar className="h-7 w-7 cursor-pointer">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback className="text-xs">
            {session?.user?.name?.slice(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
