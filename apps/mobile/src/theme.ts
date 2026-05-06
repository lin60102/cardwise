export const lightColors = {
  background: "#F7F8FB",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF2F7",
  surfaceWarm: "#FFF7ED",
  text: "#111827",
  muted: "#667085",
  border: "#D8DEE8",
  primary: "#3157D5",
  primaryDark: "#1D2F6F",
  accent: "#B86B18",
  accentSoft: "#F9E8D2",
  info: "#4F46E5",
  infoSoft: "#EEF2FF",
  danger: "#B42318",
  success: "#0E7490",
  successSoft: "#E8F7FB",
  ink: "#111827"
};

export const darkColors = {
  background: "#0F1117",
  surface: "#181B23",
  surfaceAlt: "#222733",
  surfaceWarm: "#2A221A",
  text: "#F4F6FA",
  muted: "#A7AFBD",
  border: "#303746",
  primary: "#8EA7FF",
  primaryDark: "#D6DFFF",
  accent: "#F2A65A",
  accentSoft: "#3A2B1D",
  info: "#A5B4FC",
  infoSoft: "#1B2237",
  danger: "#FFB4AB",
  success: "#67E8F9",
  successSoft: "#142A32",
  ink: "#000000"
};

export type ThemeMode = "light" | "dark";
export type AppColors = typeof lightColors;

export const themePalettes: Record<ThemeMode, AppColors> = {
  light: lightColors,
  dark: darkColors
};

export const colors = lightColors;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32
};

