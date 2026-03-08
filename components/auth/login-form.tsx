"use client";

import { useState, useTransition } from "react";
import { AlertCircle, LoaderCircle, LockKeyhole } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = String(formData.get("username") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        if (!username || !password) {
          setError("请输入用户名和密码。");
          return;
        }

        startTransition(async () => {
          const result = await signIn("credentials", {
            username,
            password,
            callbackUrl,
            redirect: false,
          });

          if (!result || result.error) {
            setError("登录失败，请确认账号密码。");
            return;
          }

          window.location.href = result.url ?? callbackUrl;
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="username">用户名或邮箱</Label>
        <Input id="username" name="username" autoComplete="username" placeholder="admin" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="请输入管理员密码"
        />
      </div>
      {error ? (
        <div className="notice-error rounded-xl border px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4" />
            <span>{error}</span>
          </div>
        </div>
      ) : null}
      <Button className="w-full" type="submit" size="lg" disabled={isPending}>
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
        {isPending ? "登录中..." : "进入后台"}
      </Button>
    </form>
  );
}
