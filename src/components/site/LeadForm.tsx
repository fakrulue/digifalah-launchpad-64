import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send } from "lucide-react";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[+0-9\s\-()]+$/, "Invalid phone characters"),
  email: z.string().trim().email("Invalid email").max(150).optional().or(z.literal("")),
  business_type: z.string().max(100).optional(),
  message: z.string().trim().max(1000).optional(),
});

const BUSINESS_TYPES = [
  "E-commerce",
  "Restaurant / Food",
  "Real Estate",
  "Education",
  "Healthcare",
  "Fashion / Retail",
  "B2B Services",
  "Other",
];

export function LeadForm({ source = "website", compact = false }: { source?: string; compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    business_type: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      business_type: parsed.data.business_type || null,
      message: parsed.data.message || null,
      source,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send. Please try WhatsApp.");
      return;
    }
    toast.success("Thanks! We'll be in touch within 24 hours.");
    setForm({ name: "", phone: "", email: "", business_type: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="lead-name">Your name *</Label>
          <Input
            id="lead-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Rahim Khan"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-phone">Phone *</Label>
          <Input
            id="lead-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+880 17XX XXXXXX"
            required
          />
        </div>
      </div>
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="lead-email">Email (optional)</Label>
          <Input
            id="lead-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@business.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-business">Business type</Label>
          <Select
            value={form.business_type}
            onValueChange={(v) => setForm({ ...form, business_type: v })}
          >
            <SelectTrigger id="lead-business">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="lead-message">How can we help?</Label>
        <Textarea
          id="lead-message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          placeholder="Tell us about your goals…"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full bg-gradient-emerald shadow-soft hover:opacity-95"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <><Send className="mr-2 h-4 w-4" /> Get My Free Audit</>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        We reply within 24 hours · Your info stays private.
      </p>
    </form>
  );
}