// ─── Brand ────────────────────────────────────────────────────────────────────
// Scheme-independent brand values. Use these only when you need the raw brand
// color regardless of light/dark mode (e.g. a logo tint, a branded splash screen).
// For all UI surfaces, prefer LightColors or DarkColors instead.
export const BrandColors = {
  primary: '#1B7A48', // emerald green — core brand
  primaryLight: '#23A05F', // hover / pressed state
  primaryDark: '#145939', // deep green for high-contrast moments
  accent: '#E8920A', // warm amber — secondary brand
  accentLight: '#F5A823', // hover / pressed state
  accentDark: '#B8720A', // deep amber for high-contrast moments
};

// ─── Light mode ───────────────────────────────────────────────────────────────
export const LightColors = {
  // Surfaces — the layered canvas of the app
  background: '#F4F9F5', // screen background — green-tinted off-white
  surface: '#FFFFFF', // cards, sheets, modals sitting on the background

  // Primary — main actions, active states, key UI chrome
  // Usage: primary buttons, active tab indicators, FAB background
  primary: '#1B7A48',
  onPrimary: '#FFFFFF', // text/icons on a primary-colored surface
  primaryContainer: '#C8F0D8', // tinted surface — chips, tags, subtle highlights
  onPrimaryContainer: '#003920', // text/icons on a primaryContainer surface

  // Secondary — accent actions, supporting UI elements
  // Usage: pending status badges, secondary CTAs, price highlights
  secondary: '#E8920A',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#FFDDB5', // tinted surface for pending states
  onSecondaryContainer: '#2B1700',

  // Tertiary — informational elements
  // Usage: info banners, tooltips, informational badges
  tertiary: '#185FA5',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#E6F2FF',
  onTertiaryContainer: '#003060',

  // Quaternary — for future use if needed (e.g. a green-tinted surface for settled status badges)
  quaternary: '#5C3E8A',
  onQuaternary: '#EDE0FF',
  quaternaryContainer: '#EDE0FF',
  onQuaternaryContainer: '#21005E',

  // Error — destructive actions and error states
  // Usage: delete buttons, disputed status, form validation errors
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6', // tinted surface for error/disputed states
  onErrorContainer: '#410002',

  // Text — readable content across the app
  text: {
    primary: '#1A1C1A', // default — headings, body, primary labels
    secondary: '#414942', // supporting — subtitles, metadata, placeholders
    disabled: '#71796F', // non-interactive — empty states, disabled inputs
    inverse: '#FFFFFF', // text on dark surfaces (e.g. primary-colored cards)
    onPrimary: '#FFFFFF', // text on primary-colored buttons
    onAccent: '#FFFFFF', // text on accent-colored buttons
  },

  // Status — expense and settlement state indicators
  // Each status has three tokens: foreground, container background, text on container
  status: {
    settled: '#1B7A48', // green — payment confirmed
    settledContainer: '#C8F0D8',
    onSettledContainer: '#003920',

    pending: '#E8920A', // amber — awaiting payee confirmation
    pendingContainer: '#FFDDB5',
    onPendingContainer: '#2B1700',

    disputed: '#BA1A1A', // red — payee rejected the proof
    disputedContainer: '#FFDAD6',
    onDisputedContainer: '#410002',

    expense: '#5C3E8A', // purple — expense log entries
    expenseContainer: '#EDE0FF',
    onExpenseContainer: '#21005E',

    info: '#185FA5', // blue — informational notices
    infoContainer: '#E6F2FF',
    onInfoContainer: '#003060',
  },

  // Borders — dividers, input outlines, card edges
  border: {
    subtle: 'rgba(0, 0, 0, 0.08)', // hairline dividers between list rows
    default: 'rgba(0, 0, 0, 0.15)', // card edges, input outlines, Google button border
    strong: 'rgba(0, 0, 0, 0.25)', // emphasis borders, focused input rings
    primary: '#1B7A48', // branded borders — active inputs, selected cards
  },

  // Hero card — for surfaces built on a primary-colored background
  primaryCard: {
    labelText: 'rgba(255, 255, 255, 0.70)',
    subtitleText: 'rgba(255, 255, 255, 0.75)',
    pillBg: 'rgba(255, 255, 255, 0.15)',
  },
  // Group palette — six swatches for group color pickers
  // Each entry: fill = the swatch color, on = text/icon color rendered on top of it
  groupColors: [
    { fill: '#1B7A48', on: '#FFFFFF' }, // emerald green  (= primary)
    { fill: '#E8920A', on: '#FFFFFF' }, // amber          (= secondary)
    { fill: '#5C3E8A', on: '#FFFFFF' }, // violet         (= quaternary)
    { fill: '#185FA5', on: '#FFFFFF' }, // blue           (= tertiary)
    { fill: '#BA1A1A', on: '#FFFFFF' }, // red            (= error)
    { fill: '#71796F', on: '#FFFFFF' }, // slate          (= text.disabled)
  ],

  // Buttons — map directly to color tokens above
  // Primary button:     background=primary,          text=onPrimary
  // Secondary button:   background=primaryContainer, text=onPrimaryContainer
  // Destructive button: background=error,            text=onError
  // Ghost button:       background=transparent,      border=border.default, text=text.primary
  // Apple button:       background=#000000 (brand guideline — do not change)
  // Google button:      background=surface,          border=border.default  (brand guideline)
};

// ─── Dark mode ────────────────────────────────────────────────────────────────
export const DarkColors = {
  // Surfaces
  background: '#0F1410', // dark green-tinted black — screen background
  surface: '#1C2420', // slightly lifted — cards, sheets, modals

  // Primary — lighter green for legibility on dark surfaces
  primary: '#6EDFA0',
  onPrimary: '#003920',
  primaryContainer: '#005232',
  onPrimaryContainer: '#8BFCBA',

  // Secondary
  secondary: '#FFB95A',
  onSecondary: '#462A00',
  secondaryContainer: '#643D00',
  onSecondaryContainer: '#FFDDB5',

  // Tertiary
  tertiary: '#9ECAFF',
  onTertiary: '#003060',
  tertiaryContainer: '#174480',
  onTertiaryContainer: '#D6E3FF',

  // Quaternary
  quaternary: '#CEB3E5',
  onQuaternary: '#42287A',
  quaternaryContainer: '#42287A',
  onQuaternaryContainer: '#EDE0FF',

  // Error
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',

  // Text
  text: {
    primary: '#E2E3DE', // default — near-white with a warm tint
    secondary: '#C1C9BF', // supporting — muted on dark backgrounds
    disabled: '#8B9389', // non-interactive
    inverse: '#1A1C1A', // text on light surfaces within a dark UI
    onPrimary: '#003920', // text on primary-colored buttons (dark green on light green)
    onAccent: '#462A00', // text on accent-colored buttons
  },

  // Status — lifted versions of light mode colors for dark surface legibility
  status: {
    settled: '#6EDFA0',
    settledContainer: '#005232',
    onSettledContainer: '#8BFCBA',

    pending: '#FFB95A',
    pendingContainer: '#643D00',
    onPendingContainer: '#FFDDB5',

    disputed: '#FFB4AB',
    disputedContainer: '#93000A',
    onDisputedContainer: '#FFDAD6',

    expense: '#CEB3E5',
    expenseContainer: '#42287A',
    onExpenseContainer: '#EDE0FF',

    info: '#9ECAFF',
    infoContainer: '#174480',
    onInfoContainer: '#D6E3FF',
  },

  // Borders — white-alpha equivalents of light mode borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.07)', // hairline dividers
    default: 'rgba(255, 255, 255, 0.13)', // card edges, input outlines
    strong: 'rgba(255, 255, 255, 0.22)', // emphasis borders, focused inputs
    primary: '#6EDFA0', // branded borders in dark mode
  },

  // Hero card — for surfaces built on a primary-colored background
  primaryCard: {
    labelText: 'rgba(0, 0, 0, 0.55)',
    subtitleText: 'rgba(0, 0, 0, 0.55)',
    pillBg: 'rgba(0, 0, 0, 0.10)',
  },

  // Group palette — dark-mode lifted versions for legibility on dark surfaces
  groupColors: [
    { fill: '#6EDFA0', on: '#003920' }, // lifted green   (= primary dark)
    { fill: '#FFB95A', on: '#462A00' }, // lifted amber   (= secondary dark)
    { fill: '#CEB3E5', on: '#42287A' }, // lifted violet  (= quaternary dark)
    { fill: '#9ECAFF', on: '#003060' }, // lifted blue    (= tertiary dark)
    { fill: '#FFB4AB', on: '#690005' }, // lifted red     (= error dark)
    { fill: '#8B9389', on: '#1A1C1A' }, // lifted slate   (= text.disabled dark)
  ],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  extraLarge: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Elevation = {
  card: {
    android: 2,
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
  },
  modal: {
    android: 8,
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
  },
};

export const Input = {
  height: 48,
  paddingHorizontal: 14,
  paddingVertical: 12,
  gap: 8,
  radius: Radius.sm,
};

export const TextAreaInput = {
  minHeight: 100,
  paddingHorizontal: 14,
  paddingVertical: 12,
  gap: 8,
  radius: Radius.sm,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const ScreenContainerStyle = {
  flex: 1,
  paddingHorizontal: 12,
  paddingBottom: 20,
  gap: Spacing.xl,
};

export const ModalContainer = {
  flex: 1,
  padding: Spacing.lg,
  gap: Spacing.lg,
};

export const Card = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: Spacing.md,
  padding: Spacing.md,
  borderRadius: Radius.lg,
  width: '100%',
  ...Shadow.sm,
};

export const Border = {
  hairline: 0.5,
  thin: 1,
};
