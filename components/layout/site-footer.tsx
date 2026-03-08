export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--header-border)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-[var(--muted)] md:px-6">
        <p>面向芯片硬件测试沟通场景的公开任务终端。</p>
        <p>V1 聚焦三件事：任务接收、状态推进、历史追溯。</p>
      </div>
    </footer>
  );
}
