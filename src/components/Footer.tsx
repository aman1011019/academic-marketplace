import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary">
                <span className="font-display text-lg font-bold text-primary-foreground">P</span>
              </div>
              <span className="font-display text-lg font-bold">ProjectHub</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              India's largest digital marketplace for academic projects. Source code, reports, PPTs — instant download.
            </p>
            <div className="mt-4 flex gap-2">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-accent">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Explore" links={[
            { label: "All Categories", to: "/categories" },
            { label: "Featured Projects", to: "/" },
            { label: "About Us", to: "/about" },
            { label: "Contact", to: "/contact" },
          ]} />

          <FooterCol title="Account" links={[
            { label: "Sign in", to: "/login" },
            { label: "Register", to: "/register" },
            { label: "Dashboard", to: "/dashboard" },
            { label: "Wishlist", to: "/dashboard/wishlist" },
          ]} />

          <FooterCol title="Legal" links={[
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms & Conditions", to: "/terms" },
            { label: "Refund Policy", to: "/terms" },
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
          <p>Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-muted-foreground transition hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
