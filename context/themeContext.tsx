"use client";

import { ThemeProvider } from "styled-components";
import { themes } from "@/themes/themes";
import data from "@/config";

export default function ThemeContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={themes[data.theme || "dark"]}>
      {children}
    </ThemeProvider>
  );
}
