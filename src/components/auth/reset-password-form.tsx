import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/" });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm"
    >
      <div className="flex items-center gap-2.5 mb-6">
        <div className="size-8 rounded-md bg-primary/10 grid place-items-center">
          <Lock className="size-4 text-primary" />
        </div>
        <h1 className="font-semibold tracking-tight">Set a new password</h1>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground ml-1">
          New password
        </label>
        <PasswordInput
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          placeholder="Min. 6 characters"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-3 py-2.5 rounded-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
      >
        {loading && <Loader2 className="size-4 animate-spin" />} Update password
      </button>
    </form>
  );
}
