import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
        CM
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">ChurchFlow</p>
        <p className="text-base font-semibold text-foreground">Management System</p>
      </div>
    </Link>
  );
}
