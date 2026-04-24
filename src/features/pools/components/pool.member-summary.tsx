import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MemberSummary } from '@/features/balances/balances.interface';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import useGetName from '@/core/common/hooks/use-get-name';
import SkeletonBox from '@/core/common/components/skeleton-box';

type Props = {
  memberSummary: MemberSummary[];
  isLoading: boolean;
};

const POSITIVE_BG = '#5DBF7E';
const NEGATIVE_BG = '#D96B6B';
const PILL_TEXT = '#FFFFFF';

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (amount >= 0 ? '+ ' : '- ') + '$' + abs;
}

export default function PoolMemberSummary({ memberSummary, isLoading }: Props) {
  const colors = useThemeColors();
  const getName = useGetName();

  if (isLoading) {
    // Render a skeleton that mirrors the members summary layout: title + rows with left/right halves
    return (
      <View style={styles.container}>
        <View style={{ width: '50%' }}>
          <SkeletonBox width={'50%'} height={22} bg={colors.surface} />
        </View>

        <View
          style={[
            styles.summaryContainer,
            { backgroundColor: colors.surface, borderColor: colors.border.default },
          ]}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const leftIsName = i % 2 === 0; // alternate to reflect both positive and negative layouts
            return (
              <View
                key={`skel-${i}`}
                style={[
                  styles.row,
                  i < 4 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border.subtle,
                    paddingBottom: Spacing.sm,
                    marginBottom: Spacing.sm,
                  },
                ]}
              >
                <View style={styles.half}>
                  {leftIsName ? (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <SkeletonBox width={160} height={18} bg={colors.surface} />
                    </View>
                  ) : (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <SkeletonBox
                        width={110}
                        height={36}
                        bg={colors.surface}
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      />
                    </View>
                  )}
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border.default }]} />

                <View style={styles.half}>
                  {leftIsName ? (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <SkeletonBox
                        width={110}
                        height={36}
                        bg={colors.surface}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      />
                    </View>
                  ) : (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <SkeletonBox width={160} height={18} bg={colors.surface} />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Members Summary</Text>
      <View
        style={[
          styles.summaryContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border.default,
          },
        ]}
      >
        {memberSummary.map((item) => {
          const isPositive = item.netBalance >= 0;
          const pillBg = isPositive ? POSITIVE_BG : NEGATIVE_BG;
          const label = formatAmount(item.netBalance);
          const displayName = item.user.name;

          // Square the corner that sits against the divider line
          const pillRadius = isPositive
            ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
            : { borderTopRightRadius: 0, borderBottomRightRadius: 0 };

          return (
            <View key={item.user.id} style={styles.row}>
              {/* Left half */}
              <View style={styles.half}>
                {isPositive ? (
                  <Text
                    style={[styles.nameRight, { color: colors.text.primary }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {getName({ name: displayName, id: item.user.id })}
                  </Text>
                ) : (
                  // pill right-aligned, square on right edge (against line)
                  <View style={styles.pillRight}>
                    <View style={[styles.pill, { backgroundColor: pillBg }, pillRadius]}>
                      <Text style={styles.pillText} numberOfLines={1}>
                        {label}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Centre divider */}
              <View style={[styles.divider]} />

              {/* Right half */}
              <View style={styles.half}>
                {isPositive ? (
                  // pill left-aligned, square on left edge (against line)
                  <View style={styles.pillLeft}>
                    <View style={[styles.pill, { backgroundColor: pillBg }, pillRadius]}>
                      <Text style={styles.pillText} numberOfLines={1}>
                        {label}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={[styles.nameLeft, { color: colors.text.primary }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {getName({ name: displayName, id: item.user.id })}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
    width: '100%',
  },
  summaryContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
    width: '100%',
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  half: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    alignSelf: 'stretch',
    marginHorizontal: Spacing.xs,
  },
  nameRight: {
    ...TextStyles.bodyMedium,
    flex: 1,
    textAlign: 'right',
  },
  nameLeft: {
    ...TextStyles.bodyMedium,
    flex: 1,
    textAlign: 'left',
  },
  pillRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pillLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pill: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    ...TextStyles.label,
    color: PILL_TEXT,
  },
});
