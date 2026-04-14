export const Fonts = {
  brand: 'Nunito',
  brandBold: 'Nunito_700Bold',
  brandBlack: 'Nunito_900Black',
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  black: 'Nunito_900Black',
};

export const BrandColors = {
  primary: '#1B7A48',
  primaryLight: '#23A05F',
  primaryDark: '#145939',
  accent: '#E8920A',
  accentLight: '#F5A823',
  accentDark: '#B8720A',
};

export const LightColors = {
  primary: '#1B7A48',
  onPrimary: '#FFFFFF',
  primaryContainer: '#C8F0D8',
  onPrimaryContainer: '#003920',

  secondary: '#E8920A',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#FFDDB5',
  onSecondaryContainer: '#2B1700',

  tertiary: '#185FA5',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#E6F2FF',
  onTertiaryContainer: '#003060',

  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  text: {
    primary: '#1A1C1A',
    secondary: '#414942',
    disabled: '#71796F',
    inverse: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onAccent: '#FFFFFF',
  },

  status: {
    settled: '#1B7A48',
    settledContainer: '#C8F0D8',
    onSettledContainer: '#003920',

    pending: '#E8920A',
    pendingContainer: '#FFDDB5',
    onPendingContainer: '#2B1700',

    disputed: '#BA1A1A',
    disputedContainer: '#FFDAD6',
    onDisputedContainer: '#410002',

    expense: '#5C3E8A',
    expenseContainer: '#EDE0FF',
    onExpenseContainer: '#21005E',

    info: '#185FA5',
    infoContainer: '#E6F2FF',
    onInfoContainer: '#003060',
  },

  border: {
    subtle: 'rgba(0, 0, 0, 0.08)',
    default: 'rgba(0, 0, 0, 0.15)',
    strong: 'rgba(0, 0, 0, 0.25)',
    primary: '#1B7A48',
  },
};

export const DarkColors = {
  primary: '#6EDFA0',
  onPrimary: '#003920',
  primaryContainer: '#005232',
  onPrimaryContainer: '#8BFCBA',

  secondary: '#FFB95A',
  onSecondary: '#462A00',
  secondaryContainer: '#643D00',
  onSecondaryContainer: '#FFDDB5',

  tertiary: '#9ECAFF',
  onTertiary: '#003060',
  tertiaryContainer: '#174480',
  onTertiaryContainer: '#D6E3FF',

  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',

  text: {
    primary: '#E2E3DE',
    secondary: '#C1C9BF',
    disabled: '#8B9389',
    inverse: '#1A1C1A',
    onPrimary: '#003920',
    onAccent: '#462A00',
  },

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

  border: {
    subtle: 'rgba(255, 255, 255, 0.07)',
    default: 'rgba(255, 255, 255, 0.13)',
    strong: 'rgba(255, 255, 255, 0.22)',
    primary: '#6EDFA0',
  },
};

export const TextStyles = {
  displayLarge: { size: 32, weight: '600', lineHeight: 40 },
  displaySmall: { size: 24, weight: '600', lineHeight: 32 },
  headlineMedium: { size: 20, weight: '600', lineHeight: 28 },
  titleLarge: { size: 17, weight: '600', lineHeight: 24 },
  titleMedium: { size: 15, weight: '500', lineHeight: 22 },
  bodyLarge: { size: 16, weight: '400', lineHeight: 24 },
  bodyMedium: { size: 14, weight: '400', lineHeight: 20 },
  bodySmall: { size: 12, weight: '400', lineHeight: 16 },
  labelLarge: { size: 13, weight: '500', lineHeight: 18 },
  labelMedium: { size: 12, weight: '500', lineHeight: 16 },
  labelSmall: { size: 11, weight: '500', lineHeight: 16, letterSpacing: 0.5 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
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

export const ScreenContainer = {
  flex: 1,
  paddingHorizontal: 12,
  gap: Spacing.lg,
};

export const ModalContainer = {
  flex: 1,
  padding: Spacing.lg,
  gap: Spacing.lg,
};

export const Card = {
  paddingSm: 12,
  padding: 16,
  paddingLg: 20,
  gap: 12,
  gapLg: 16,
  radius: Radius.md,
};

export const Border = {
  hairline: 0.5,
  thin: 1,
};
