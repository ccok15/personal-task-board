"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button, type ButtonProps } from "@/components/ui/button";

type SignOutButtonProps = {
  callbackUrl?: string;
  label?: string;
} & Pick<ButtonProps, "size" | "variant" | "className">;

export function SignOutButton({
  callbackUrl = "/",
  label = "退出",
  className,
  size = "sm",
  variant = "ghost",
}: SignOutButtonProps) {
  return (
    <Button className={className} variant={variant} size={size} onClick={() => signOut({ callbackUrl })}>
      <LogOut className="size-4" />
      {label}
    </Button>
  );
}
