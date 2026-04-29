import { Link } from "@tanstack/react-router";
import { Sparkles, Facebook, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-emerald-deep text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-gold">
                <Sparkles className="h-5 w-5 text-emerald-deep" />
              </div>
              <span className="font-display text-xl font-bold">
                DigiFalah<span className="text-gradient-gold">.</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              Bangladesh's digital marketing partner. AI-powered SEO, content,
              and paid growth — built for local businesses going global.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Facebook" className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold">Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/services" className="text-primary-foreground/70 hover:text-gold">SEO & Local Search</Link></li>
              <li><Link to="/services" className="text-primary-foreground/70 hover:text-gold">AI Blog Writing</Link></li>
              <li><Link to="/services" className="text-primary-foreground/70 hover:text-gold">Social Media</Link></li>
              <li><Link to="/services" className="text-primary-foreground/70 hover:text-gold">Paid Ads</Link></li>
              <li><Link to="/services" className="text-primary-foreground/70 hover:text-gold">Web Design</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="text-primary-foreground/70 hover:text-gold">About Us</Link></li>
              <li><Link to="/blog" className="text-primary-foreground/70 hover:text-gold">Blog</Link></li>
              <li><Link to="/pricing" className="text-primary-foreground/70 hover:text-gold">Pricing</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/70 hover:text-gold">Contact</Link></li>
              <li><Link to="/privacy" className="text-primary-foreground/70 hover:text-gold">Privacy</Link></li>
              <li><Link to="/terms" className="text-primary-foreground/70 hover:text-gold">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>Gulshan, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href="tel:+8801700000000" className="hover:text-gold">+880 1700-000000</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a href="mailto:hello@digifalah.com" className="hover:text-gold">hello@digifalah.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} DigiFalah.com — All rights reserved.</p>
          <p className="font-bangla">ডিজিটাল মার্কেটিং এজেন্সি · ঢাকা</p>
        </div>
      </div>
    </footer>
  );
}