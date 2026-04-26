import { ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainerStyle } from '@/core/common/constants/theme';

type ScreenContainerProps = {
  children: React.ReactNode;
  useScrollView?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const ScreenContainer = ({
  children,
  useScrollView = true,
  contentContainerStyle,
}: ScreenContainerProps) => {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {useScrollView ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    ...ScreenContainerStyle,
  },
  scrollContent: {
    ...ScreenContainerStyle,
    flexGrow: 1,
  },
});

export default ScreenContainer;
