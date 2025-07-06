"use client";

import ActiveIndicator from "@/components/common/indicator/active-indicator";
import { ThemeLabel, ThemeValue } from "@/lib/types/theme";

type Props = {
  theme: ThemeValue
  text: ThemeLabel;
  activeTheme: ThemeValue;
};

export default function ThemeSwitch({
  text = "System",
  theme,
  activeTheme,
}: Props) {
  return (
    <p className="text-xs flex items-center gap-2">
      {text} {theme === activeTheme && <ActiveIndicator />}
    </p>
  );
}
