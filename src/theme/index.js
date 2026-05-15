// ─────────────────────────────────────────────────────────────────────────────
// Centralized Theme — colors · spacing · typography · breakpoints
// ─────────────────────────────────────────────────────────────────────────────

// ── Breakpoints ───────────────────────────────────────────────────────────────
export const breakpoints = {
  xs:  "480px",
  sm:  "576px",
  md:  "768px",
  lg:  "992px",
  xl:  "1440px",
  xxl: "1535px",
  xxxl: "1620px"
};

// Helper: min-width media query string  →  use as: ${mq('md')} { ... }
export const mq = (bp) => `@media (min-width: ${breakpoints[bp]})`;
export const mxq = (bp) => `@media (max-width: ${breakpoints[bp]})`;


// ── Responsive typography scale ───────────────────────────────────────────────
// base = mobile-first, md = tablet+, lg = desktop+
export const typography = {
  h1:      { base: "20px", md: "24px", lg: "28px" },
  h2:      { base: "17px", md: "20px", lg: "22px" },
  h3:      { base: "15px", md: "17px", lg: "18px" },
  h4:      { base: "13px", md: "15px", lg: "16px" },
  bodyLg:  { base: "14px", md: "15px", lg: "15px" },
  body:    { base: "13px", md: "13px", lg: "14px" },
  bodySm:  { base: "12px", md: "12px", lg: "13px" },
  label:   { base: "11px", md: "12px", lg: "12px" },
  caption: { base: "10px", md: "11px", lg: "11px" },
};

// ── Shared tokens (same across light & dark) ──────────────────────────────────
const shared = {
  typography,
  breakpoints,

  spacing: {
    xs:  "4px",
    sm:  "8px",
    md:  "16px",
    lg:  "24px",
    xl:  "32px",
    xxl: "48px",
  },

  radius: {
    xs:   "4px",
    sm:   "6px",
    md:   "10px",
    lg:   "14px",
    xl:   "20px",
    full: "9999px",
  },

  font: {
    family:         "'DM Sans', 'Segoe UI', sans-serif",
    // static aliases kept for backwards compat
    sizeXs:         "11px",
    sizeSm:         "12px",
    sizeMd:         "13px",
    sizeLg:         "15px",
    sizeXl:         "18px",
    weightNormal:   400,
    weightMedium:   500,
    weightSemiBold: 600,
    weightBold:     700,
  },

  transition:       "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
  sidebarWidth:     "180px",
  sidebarCollapsed: "64px",
  headerHeight:     "60px",

  table: {
    headerHeight: "42px",
    rowHeight:    "48px",
    rowHeightSm:  "40px",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Light Theme
// ─────────────────────────────────────────────────────────────────────────────
export const lightTheme = {
  ...shared,
  mode: "light",

  colors: {
    // Page
    bgBase:            "#F4F7FA",
    bgSurface:         "#FFFFFF",
    bgSurfaceAlt:      "#F8FAFF",
    bgHeader:          "linear-gradient(120deg, #00e4d0 , #5983e8)",
    bgSidebar:         "#FFFFFF",
    bgSidebarHover:    "linear-gradient(120deg, #00e4d0 , #5983e8)",
    bgSidebarActive:   "linear-gradient(90deg, #00e4d0 , #5983e8 )",
    bgContent:         "#F4F6FA",
    bgFloatMenu:       "#FFFFFF",

    // Table
    bgTableHeader:     "linear-gradient(120deg, #00e4d0 , #5983e8)",
    bgTableRow:        "#FFFFFF",
    bgTableRowAlt:     "linear-gradient(120deg, #00e4d0 , #5983e8)",
    bgTableRowHover:   "#F0F4FF",

    // Cards (premium boxes)
    bgCard:            "#FFFFFF",
    bgCardBuy:         "#F0FFF8",
    bgCardSell:        "#FFF5F5",

    // Text
    textPrimary:       "#1a1f3c",
    textSecondary:     "#5A6482",
    textMuted:         "#9AA3BE",
    textOnDark:        "#FFFFFF",
    textOnPrimary:     "#FFFFFF",
    textSidebarItem:   "#3D4566",
    textSidebarActive: "#FFFFFF",
    textTableHeader:   "#FFFFFF",
    textBuy:           "#00875A",
    textSell:          "#D32F2F",

    // Brand
    primary:           "linear-gradient(135deg, #00e4d0 , #5983e8)",
    primaryLight:      "linear-gradient(135deg, #00e4d0 , #5983e8)",
    secondaryButtonText : "rgb(0, 130, 122)",
    primaryDark:       "#1a38cc",
    accent:            "#FF6B6B",

    // Status
    success:           "#00C48C",
    successLight:      "#E6FAF5",
    warning:           "#FF9800",
    warningLight:      "#FFF3E0",
    error:             "#F44336",
    errorLight:        "#FFEBEE",
    info:              "#2979FF",
    infoLight:         "#E3F2FD",

    // Borders
    border:            "#E3E8F5",
    borderStrong:      "#C5CEEC",
    divider:           "#EDF0FA",

    // Step buttons (+/−)
    bgStepBtn:         "#EEF1FF",
    bgStepBtnHover:    "#3D5AFE",
    textStepBtn:       "#3D5AFE",
    textStepBtnHover:  "#FFFFFF",

    // Inputs
    bgInput:           "#F8FAFF",
    bgInputFocus:      "#FFFFFF",
    borderInput:       "#D0D7F0",
    borderInputFocus:  "#3D5AFE",

    // Misc
    badgeBg:           "rgba(61,90,254,0.1)",
    badgeText:         "#3D5AFE",
    badgeBorder:       "rgba(61,90,254,0.25)",
    avatarBg:          "#FFE0B2",
    avatarText:        "#E65100",
    toggleBg:          "#E3E8F5",
    toggleActive:      "#3D5AFE",
    toggleThumb:       "#FFFFFF",
    logoutText:        "rgba(255,255,255,0.85)",
    logoutBg:          "rgba(255,255,255,0.08)",
    logoutBorder:      "rgba(255,255,255,0.2)",

    // Shadows
    shadowCard:        "0 2px 16px rgba(61,90,254,0.08)",
    shadowCardHover:   "0 6px 24px rgba(61,90,254,0.14)",
    shadowHeader:      "0 4px 24px rgba(26,31,60,0.18)",
    shadowSidebar:     "2px 0 20px rgba(61,90,254,0.08)",
    shadowFloatMenu:   "0 8px 32px rgba(61,90,254,0.16)",
    shadowSidebarItem: "0 4px 12px rgba(61,90,254,0.3)",
    shadowInput:       "0 0 0 3px rgba(61,90,254,0.12)",
    shadowTable:       "0 2px 12px rgba(61,90,254,0.06)",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Dark Theme
// ─────────────────────────────────────────────────────────────────────────────
export const darkTheme = {
  ...shared,
  mode: "dark",

  colors: {
    // Page
    bgBase:            "#0F1117",
    bgSurface:         "#181C2A",
    bgSurfaceAlt:      "#1C2035",
    bgHeader:          "linear-gradient(135deg, #0a0d1a 0%, #141829 60%, #0e1426 100%)",
    bgSidebar:         "#0e1120",
    bgSidebarHover:    "rgba(61,90,254,0.12)",
    bgSidebarActive:   "linear-gradient(90deg, #0a0d1a 0%, #1a1f3c 100%)",
    bgContent:         "#0F1117",
    bgFloatMenu:       "#FFFFFF",

    // Table
    bgTableHeader:     "linear-gradient(135deg, #0a0d1a 0%, #1a1f3c 100%)",
    bgTableRow:        "#181C2A",
    bgTableRowAlt:     "#1C2035",
    bgTableRowHover:   "rgba(83,109,254,0.08)",

    // Cards
    bgCard:            "#181C2A",
    bgCardBuy:         "rgba(0,196,140,0.08)",
    bgCardSell:        "rgba(244,67,54,0.08)",

    // Text
    textPrimary:       "#E8ECFF",
    textSecondary:     "#8B93BB",
    textMuted:         "#555E82",
    textOnDark:        "#FFFFFF",
    textOnPrimary:     "#FFFFFF",
    textSidebarItem:   "#9AA3CC",
    textSidebarActive: "#FFFFFF",
    textTableHeader:   "rgba(255,255,255,0.85)",
    textBuy:           "#00C48C",
    textSell:          "#FF5252",

    // Brand
    primary:           "linear-gradient(135deg, #0a0d1a, #1a1f3c)",
    primaryLight:      "rgba(83,109,254,0.15)",
    primaryDark:       "#3D5AFE",
    accent:            "#FF6B6B",

    // Status
    success:           "#00C48C",
    successLight:      "rgba(0,196,140,0.12)",
    warning:           "#FF9800",
    warningLight:      "rgba(255,152,0,0.12)",
    error:             "#F44336",
    errorLight:        "rgba(244,67,54,0.12)",
    info:              "#2979FF",
    infoLight:         "rgba(41,121,255,0.12)",

    // Borders
    border:            "#272D45",
    borderStrong:      "#333B5E",
    divider:           "#1E2436",

    // Step buttons
    bgStepBtn:         "rgba(83,109,254,0.15)",
    bgStepBtnHover:    "#536DFE",
    textStepBtn:       "#8499FF",
    textStepBtnHover:  "#FFFFFF",

    // Inputs
    bgInput:           "#1C2035",
    bgInputFocus:      "#222844",
    borderInput:       "#333B5E",
    borderInputFocus:  "#536DFE",

    // Misc
    badgeBg:           "rgba(83,109,254,0.15)",
    badgeText:         "#8499FF",
    badgeBorder:       "rgba(83,109,254,0.3)",
    avatarBg:          "#3D2B00",
    avatarText:        "#FFB74D",
    toggleBg:          "#272D45",
    toggleActive:      "#536DFE",
    toggleThumb:       "#FFFFFF",
    logoutText:        "rgba(255,255,255,0.7)",
    logoutBg:          "rgba(255,255,255,0.05)",
    logoutBorder:      "rgba(255,255,255,0.12)",

    // Shadows
    shadowCard:        "0 2px 16px rgba(0,0,0,0.4)",
    shadowCardHover:   "0 6px 24px rgba(0,0,0,0.55)",
    shadowHeader:      "0 4px 24px rgba(0,0,0,0.5)",
    shadowSidebar:     "2px 0 20px rgba(0,0,0,0.4)",
    shadowFloatMenu:   "0 8px 32px rgba(0,0,0,0.5)",
    shadowSidebarItem: "0 4px 12px rgba(62, 76, 158, 0.35)",
    shadowInput:       "0 0 0 3px rgba(83,109,254,0.2)",
    shadowTable:       "0 2px 12px rgba(0,0,0,0.3)",
  },
};