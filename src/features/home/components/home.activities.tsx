import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useActivities from '@/features/activities/hooks/use-activities';
import SkeletonBox from '@/core/common/components/skeleton-box';
import EmptyState from '@/core/common/components/empty-state';
import ActivityCard from '@/features/activities/components/activity-card';
import { useNavigation } from '@react-navigation/native';

const PREVIEW_COUNT = 5;

export default function HomeActivities() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { activities, isLoading } = useActivities(PREVIEW_COUNT);
  const preview = activities.slice(0, PREVIEW_COUNT);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Recent Activities</Text>
        {preview.length > 0 ? (
          <TouchableOpacity onPress={() => navigation.navigate('Activity' as never)}>
            <Text style={[TextStyles.label, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View
        style={[
          styles.cardContainer,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={{ padding: Spacing.md }}>
              <SkeletonBox width={'100%'} height={64} bg={colors.surface} />
            </View>
          ))
        ) : preview.length === 0 ? (
          <EmptyState
            title="No recent activity"
            subtitle="You don't have any recent activity yet."
          />
        ) : (
          preview.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isLast={index === preview.length - 1}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
  },
});
