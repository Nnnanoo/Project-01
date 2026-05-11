import Link from "next/link";
import { Sparkles } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Design Evaluation", href: "/evaluate" },
    { label: "Feed Analysis", href: "/instagram" },
    { label: "Brand Assistant", href: "/assistant" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#09090B] border-t border-white/[0.06] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">Whisperly</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              AI-powered brand evaluation for social media teams. Powered by Brand Whisper 01.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">{section}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Whisperly. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Powered by{" "}
            <span className="text-zinc-500 font-medium">Brand Whisper 01</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
