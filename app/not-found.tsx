import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="tech-panel rounded-[28px] p-10 text-center">
        <p className="kicker">404</p>
        <h1 className="text-heading mt-4 text-3xl font-semibold">页面不存在</h1>
        <p className="mt-4 text-sm/7 text-[var(--muted)]">
          目标页面可能还没建立，或者已经被移除。
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </section>
    </PublicShell>
  );
}
