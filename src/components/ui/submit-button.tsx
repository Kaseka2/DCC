"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SubmitButton({
  label,
  pendingLabel,
  ...props
}: ButtonProps & { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" isLoading={pending}>
      {pending && <Spinner className="h-4 w-4" />}
      {pending ? pendingLabel ?? label : label}
    </Button>
  );
}
