import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-glow px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <AuthForm />
      </div>
    </main>
  );
}
