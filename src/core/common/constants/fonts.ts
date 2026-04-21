export const Fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const FontSize = {
  xs: 12, // captions, error text, badges
  sm: 14, // secondary text, labels
  md: 16, // body text (default)
  lg: 18, // emphasized body, subtitles
  xl: 20, // section headings
  xxl: 24, // screen titles
  xxxl: 32, // hero display, large amounts
  hero: 40, // full-screen balance display
};

export const LineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 28,
  xxl: 32,
  xxxl: 40,
  hero: 48,
};

export const TextStyles = {
  // ── Display — full-screen hero moments, large balance numbers ──────────
  displayLarge: {
    fontFamily: Fonts.extraBold,
    fontSize: FontSize.hero,
    lineHeight: LineHeight.hero,
    letterSpacing: -1,
  },
  displaySmall: {
    fontFamily: Fonts.extraBold,
    fontSize: FontSize.xxxl,
    lineHeight: LineHeight.xxxl,
    letterSpacing: -0.5,
  },

  // ── Headings — screen titles, section headers ──────────────────────────
  headingLarge: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.xxl,
    lineHeight: LineHeight.xxl,
    letterSpacing: -0.3,
  },
  headingMedium: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
  },
  headingSmall: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
  },

  // ── Subtitle — section subheadings, card titles ────────────────────────
  subtitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
  },
  subtitleSmall: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
  },

  // ── Body — readable content ────────────────────────────────────────────
  body: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
  },
  bodyMedium: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
  },
  bodySmall: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
  },

  // ── Amount — currency figures throughout the app ───────────────────────
  amountLarge: {
    fontFamily: Fonts.extraBold,
    fontSize: FontSize.xxxl,
    lineHeight: LineHeight.xxxl,
    letterSpacing: -0.5,
  },
  amountMedium: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
  },
  amountSmall: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
  },

  // ── UI elements ────────────────────────────────────────────────────────
  button: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
  },
  captionBold: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
  },
  error: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.sm,
  },
};
