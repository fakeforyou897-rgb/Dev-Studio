import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SocialAuth } from "./social-auth";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export function AuthForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent");
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm">
      <div className="flex gap-1 p-1 bg-muted rounded-md text-sm">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`flex-1 py-1.5 rounded transition-all ${mode === "signin" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 py-1.5 rounded transition-all ${mode === "signup" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground ml-1">
              Display name
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full"
              placeholder="Forge Builder"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground ml-1">
            Email
          </label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground ml-1">
            Password
          </label>
          <PasswordInput
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-3 py-2.5 rounded-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <SocialAuth loading={loading} />

      {mode === "signin" && (
        <button
          type="button"
          onClick={handleReset}
          className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Forgot password?
        </button>
      )}
    </div>
  );
}
