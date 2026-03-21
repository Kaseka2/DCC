import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-glow px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-muted-foreground">
          Need an account?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/80">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
