"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, Building2, Plus, Trash2, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface Props {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    brands: {
      id: string;
      name: string;
      industry: string | null;
      createdAt: Date;
    }[];
  } | null;
}

export function SettingsClient({ user }: Props) {
  if (!user) return null;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm">Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="text-lg font-bold">
                  {user.name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name || "No name set"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Account type</p>
                <Badge variant="secondary">Free Plan</Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Brands</p>
                <p className="font-medium">{user.brands.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Brands */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm">Your Brands</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Manage your brand workspaces
              </CardDescription>
            </div>
            <Link href="/onboarding">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                <Plus className="w-3.5 h-3.5" />
                Add Brand
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {brand.industry || "No industry"} · Created {formatDate(brand.createdAt)}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Configuration */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm">AI Configuration</CardTitle>
            </div>
            <CardDescription className="text-xs">
              AI models used for evaluations and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Design Evaluation", model: "GPT-4o Vision" },
              { label: "PDF Analysis", model: "GPT-4o" },
              { label: "Brand Brain", model: "GPT-4o" },
              { label: "Brand Assistant", model: "GPT-4o" },
              { label: "Instagram Analysis", model: "GPT-4o Vision" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant="outline" className="text-xs font-mono">{item.model}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
