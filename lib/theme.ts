export const THEME_COOKIE_NAME = "theme";
export const THEME_VALUES = ["dark", "light"] as const;

export type ThemeValue = (typeof THEME_VALUES)[number];

export function isThemeValue(value: unknown): value is ThemeValue {
  return typeof value === "string" && THEME_VALUES.includes(value as ThemeValue);
}
