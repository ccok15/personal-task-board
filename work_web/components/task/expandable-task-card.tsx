"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

type ExpandableTaskCardProps = {
  title: string;
  badges: ReactNode;
  summaryMeta: ReactNode;
  details?: ReactNode;
  actions?: ReactNode;
};

export function ExpandableTaskCard({
  title,
  badges,
  summaryMeta,
  details,
  actions,
}: ExpandableTaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  function toggleExpanded() {
    setExpanded((current) => !current);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded();
    }
  }

  return (
    <motion.article
      layout
      className="tech-panel rounded-2xl"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-expanded={expanded}
        className="cursor-pointer px-4 py-4 outline-none md:px-5 md:py-5"
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">{badges}</div>
            <h2 className="text-heading text-base font-semibold leading-tight md:text-lg">{title}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
              {summaryMeta}
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="mt-1 shrink-0 text-[var(--muted)]"
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <ChevronDown className="size-4" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="space-y-4 border-t border-[var(--border)] px-4 pb-4 pt-4 md:px-5 md:pb-5"
              onClick={(event) => event.stopPropagation()}
            >
              {details ? <div className="space-y-4">{details}</div> : null}
              {actions ? <div className="flex w-full flex-col items-stretch gap-3">{actions}</div> : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
