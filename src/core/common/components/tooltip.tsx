import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Spacing, Radius } from '@/core/common/constants/theme';

type Props = {
  description: string;
  iconName?: string;
  iconSize?: number;
  placement?: PopoverPlacement;
};

export default function Tooltip({
  description,
  iconName = 'help-circle-outline',
  iconSize = 18,
  placement = PopoverPlacement.BOTTOM,
}: Props) {
  const colors = useThemeColors();
  const [visible, setVisible] = React.useState(false);

  return (
    <Popover
      isVisible={visible}
      onRequestClose={() => setVisible(false)}
      placement={placement}
      from={(ref) => (
        <TouchableOpacity
          ref={ref as unknown as React.RefObject<View>}
          onPress={() => setVisible(true)}
          style={styles.iconButton}
        >
          <Ionicons name={iconName as any} size={iconSize} color={colors.text.secondary} />
        </TouchableOpacity>
      )}
      popoverStyle={[styles.popover, { backgroundColor: colors.surface }]}
      backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.12)' }}
    >
      <View style={[styles.content, { backgroundColor: colors.surface }]}>
        <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]}>{description}</Text>
      </View>
    </Popover>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  popover: {
    borderRadius: Radius.md,
    padding: Spacing.sm,
    minWidth: 160,
  },
  content: {
    padding: Spacing.xs,
  },
});
