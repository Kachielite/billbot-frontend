import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import SkeletonBox from '@/core/common/components/skeleton-box';
import { TextStyles } from '@/core/common/constants/fonts';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useNotificationPreferences from '../hooks/use-notification-preferences';
import useUpdateNotificationPreferences from '../hooks/use-update-notification-preferences';
import { NotificationPreferencesUpdate } from '../notifications.push.interface';

const PREF_LABELS: { key: keyof NotificationPreferencesUpdate; label: string; desc: string }[] = [
  { key: 'invite_received', label: 'Invites', desc: 'When someone invites you to a group' },
  { key: 'member_joined', label: 'Members', desc: 'When a new member joins your group' },
  { key: 'expense_created', label: 'Expenses', desc: 'When a new expense is added to a pool' },
  {
    key: 'settlement_submitted',
    label: 'Settlement Requests',
    desc: 'When a settlement is submitted for your review',
  },
  {
    key: 'settlement_confirmed',
    label: 'Settlement Confirmed',
    desc: 'When your settlement is confirmed',
  },
  {
    key: 'settlement_disputed',
    label: 'Settlement Disputes',
    desc: 'When a settlement is disputed',
  },
  { key: 'general', label: 'General', desc: 'General app announcements and updates' },
];

export default function NotificationPreferencesScreen() {
  const colors = useThemeColors();
  const { canGoBack, goBack } = useNavigation();
  const { preferences, isLoading } = useNotificationPreferences();
  const { updatePreferences, isUpdating } = useUpdateNotificationPreferences();

  const toggle = async (key: keyof NotificationPreferencesUpdate, value: boolean) => {
    await updatePreferences({ [key]: value });
  };

  return (
    <ScreenContainer useScrollView={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => canGoBack() && goBack()}
        >
          <FontAwesome6 name="chevron-left" size={16} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>
          Notification Preferences
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border.default },
          ]}
        >
          {PREF_LABELS.map(({ key, label, desc }, index) => {
            const isLast = index === PREF_LABELS.length - 1;
            const value = preferences?.[key] ?? true;

            return (
              <View
                key={key}
                style={[
                  styles.row,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.default },
                ]}
              >
                <View style={styles.rowText}>
                  {isLoading ? (
                    <>
                      <SkeletonBox width={120} height={14} bg={colors.background} />
                      <SkeletonBox width={200} height={12} bg={colors.background} />
                    </>
                  ) : (
                    <>
                      <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                        {label}
                      </Text>
                      <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
                        {desc}
                      </Text>
                    </>
                  )}
                </View>
                <Switch
                  value={isLoading ? false : value}
                  onValueChange={(val) => toggle(key, val)}
                  disabled={isLoading || isUpdating}
                  trackColor={{ true: colors.primary, false: colors.border.default }}
                  thumbColor={colors.surface}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});
