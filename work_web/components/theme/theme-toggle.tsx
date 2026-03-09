"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  THEME_COOKIE_NAME,
  type ThemeValue,
  isThemeValue,
} from "@/lib/theme";

type ThemeToggleProps = {
  initialTheme: ThemeValue;
};

function persistTheme(theme: ThemeValue) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_COOKIE_NAME, theme);
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeValue>(initialTheme);

  useEffect(() => {
    if (isThemeValue(theme)) {
      persistTheme(theme);
    }
  }, [theme]);

  return (
    <Button
      className="min-w-[5.5rem]"
      size="sm"
      variant="secondary"
      onClick={() => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        persistTheme(nextTheme);
      }}
    >
      {theme === "dark" ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
      <span className="hidden sm:inline">{theme === "dark" ? "浅色" : "深色"}</span>
    </Button>
  );
}
