import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | DigiFalah" },
      { name: "description", content: "Sign in to the DigiFalah admin panel." },
    ],
  }),
  component: LoginPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Invalid email").max(150),
  password: z.string().min(8, "Min 8 characters").max(100),
});

function LoginPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [session, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/admin" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: fullName || parsed.data.email },
      },
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — signing you in…");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-primary-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold">
            <Sparkles className="h-5 w-5 text-emerald-deep" />
          </div>
          <span className="font-display text-2xl font-bold">
            DigiFalah<span className="text-gradient-gold">.</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-password">Password</Label>
                  <Input id="si-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-gradient-emerald">
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</> : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-password">Password</Label>
                  <Input id="su-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-gradient-emerald">
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</> : "Create account"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  First account becomes the super admin (assign roles in the database).
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <Link to="/" className="mt-6 block text-center text-sm text-primary-foreground/70 hover:text-gold">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}