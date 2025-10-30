"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "New recipe" },
    { href: "/recipes", label: "Recipes" },
    { href: "/cookbooks", label: "Cookbooks" },
  ];

  return (
    <aside className="w-64 bg-butcher-paper border-r border-outline-gray">
      <div className="p-6">
        <h1 className="font-spectral text-logo text-text-charcoal mb-8">
          mise
        </h1>

        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block mise-sidebar-link ${
                pathname === link.href ? "text-text-charcoal font-medium" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
