export type ThemeColors = ReturnType<typeof getThemeColors>;

export function getThemeColors(isDark: boolean) {
  return {
    // Surfaces
    pageBg: isDark ? "#161616" : "#F4F4F4",
    cardBg: isDark ? "#262626" : "#FFFFFF",
    nestedCardBg: isDark ? "#1F1F1F" : "#F9F9F9",
    cardBorder: isDark ? "#393939" : "#E0E0E0",
    softDivider: isDark ? "#393939" : "#F4F4F4",

    // Typography
    heading: isDark ? "#F4F4F4" : "#161616",
    body: isDark ? "#C6C6C6" : "#525252",
    muted: isDark ? "#A8A8A8" : "#6F6F6F",
    hint: isDark ? "#6F6F6F" : "#A8A8A8",

    // Inputs
    inputBg: isDark ? "#262626" : "#FFFFFF",
    inputBorder: isDark ? "#393939" : "#C6C6C6",
    inputText: isDark ? "#F4F4F4" : "#161616",
    inputFocusBorder: "#0F62FE",

    // Brand / state
    primary: "#0F62FE",
    primaryFg: "#FFFFFF",
    success: "#198038",
    critical: "#DA1E28",

    // Semantic chip backgrounds
    criticalBg: isDark ? "rgba(218,30,40,0.15)" : "#FFF1F1",
    criticalBorder: isDark ? "rgba(218,30,40,0.45)" : "#FFCDD2",
    successBg: isDark ? "rgba(25,128,56,0.15)" : "#DEFBE6",
    successBorder: isDark ? "rgba(25,128,56,0.45)" : "#A7F0BA",
    warningBg: isDark ? "rgba(241,194,27,0.15)" : "#FFF8E1",
    warningBorder: isDark ? "rgba(241,194,27,0.45)" : "#F1C21B",
    warningText: isDark ? "#F1C21B" : "#825200",
    infoBg: isDark ? "rgba(15,98,254,0.15)" : "#EDF5FF",
    infoBorder: isDark ? "rgba(15,98,254,0.5)" : "#0F62FE",
    infoText: isDark ? "#78A9FF" : "#0043CE",
  };
}
