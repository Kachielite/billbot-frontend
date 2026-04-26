import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'react-query';
import { Toast } from 'toastify-react-native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import BottomModal from '@/core/common/components/layout/bottom-modal';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomButton from '@/core/common/components/form/custom-button';
import SkeletonBox from '@/core/common/components/skeleton-box';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useProfile from '@/features/user/hooks/use-profile';
import useUpdateProfile from '@/features/user/hooks/use-update-profile';
import useThemeStore from '@/core/common/state/theme.state';
import useAuthStore from '@/features/auth/auth.state';
import { UserService } from '@/features/user/user.service';
import { AppError } from '@/core/common/error';
import getInitials from '@/core/common/utils/get-initials';
import moment from 'moment';

const APP_VERSION = '1.0.0';
const TERMS_URL = 'https://billbot.app/terms';
const PRIVACY_URL = 'https://billbot.app/privacy';
const SUPPORT_EMAIL = 'support@billbot.app';

// ── Row ───────────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  rightSlot,
  isLast = false,
  onPress,
  destructive = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  rightSlot?: React.ReactNode;
  isLast?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.default },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: destructive ? colors.error + '1A' : colors.primaryContainer },
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={destructive ? colors.error : colors.onPrimaryContainer}
        />
      </View>
      <Text
        style={[
          TextStyles.bodyMedium,
          styles.rowLabel,
          { color: destructive ? colors.error : colors.text.primary },
        ]}
      >
        {label}
      </Text>
      {rightSlot ?? (
        <>
          {value !== undefined && (
            <Text
              style={[TextStyles.bodySmall, { color: colors.text.secondary }]}
              numberOfLines={1}
            >
              {value}
            </Text>
          )}
          {onPress && (
            <Ionicons
              name="chevron-forward"
              size={16}
              color={destructive ? colors.error : colors.text.disabled}
              style={{ marginLeft: Spacing.xs }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const colors = useThemeColors();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[TextStyles.label, { color: colors.text.secondary, letterSpacing: 0.8 }]}>
          {title}
        </Text>
        {action}
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

const ProfileScreen = () => {
  const colors = useThemeColors();
  const systemScheme = useColorScheme();
  const { profile, isLoading } = useProfile();
  const { form, isUpdating, updateProfile } = useUpdateProfile();
  const { themeMode, setThemeMode } = useThemeStore();
  const { clearAuth } = useAuthStore();

  const isDark = systemScheme === 'dark';

  const [editVisible, setEditVisible] = React.useState(false);
  const [deleteVisible, setDeleteVisible] = React.useState(false);

  const { mutateAsync: deleteAccount, isLoading: isDeleting } = useMutation(
    'delete-account',
    () => UserService.deleteAccount(),
    {
      onSuccess: () => {
        setDeleteVisible(false);
        clearAuth();
      },
      onError: (err: AppError) => Toast.error(err.message ?? 'Failed to schedule account deletion'),
    },
  );

  const openEdit = () => {
    if (!profile) return;
    form.reset({ name: profile.name ?? undefined, phone: profile.phone ?? undefined });
    setEditVisible(true);
  };

  const onSave = form.handleSubmit(async (data) => {
    await updateProfile(data);
    setEditVisible(false);
  });

  const toggleDarkMode = (val: boolean) => setThemeMode(val ? 'dark' : 'light');

  const initials = profile ? getInitials(profile.name) : '';
  const memberSince = profile ? moment(profile.createdAt).format('MMMM YYYY') : '';

  return (
    <ScreenContainer useScrollView={false}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={[TextStyles.headingLarge, { color: colors.text.primary }]}>Profile</Text>
      </View>

      {/* ── Hero (fixed, outside scroll) ── */}
      <View
        style={[
          styles.hero,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
        {isLoading ? (
          <>
            <SkeletonBox
              width={80}
              height={80}
              bg={colors.background}
              style={{ borderRadius: 40 }}
            />
            <View style={{ alignItems: 'center', gap: Spacing.xs }}>
              <SkeletonBox width={140} height={20} bg={colors.background} />
              <SkeletonBox width={180} height={14} bg={colors.background} />
            </View>
          </>
        ) : (
          <>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.initials, { color: colors.onPrimary }]}>{initials}</Text>
              </View>
            )}
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>
                {profile?.name ?? '—'}
              </Text>
              <Text style={[TextStyles.bodySmall, { color: colors.text.secondary }]}>
                {profile?.email ?? profile?.phone ?? '—'}
              </Text>
            </View>
            <View style={[styles.memberBadge, { backgroundColor: colors.primaryContainer }]}>
              <Text style={[TextStyles.caption, { color: colors.onPrimaryContainer }]}>
                Member since {memberSince}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* ── Scrollable sections ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Account ── */}
        <Section
          title="ACCOUNT"
          action={
            <TouchableOpacity onPress={openEdit} disabled={isLoading}>
              <Text
                style={[
                  TextStyles.label,
                  { color: isLoading ? colors.text.disabled : colors.primary },
                ]}
              >
                Edit
              </Text>
            </TouchableOpacity>
          }
        >
          {isLoading ? (
            [0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.row,
                  i < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border.default },
                ]}
              >
                <SkeletonBox
                  width={32}
                  height={32}
                  bg={colors.background}
                  style={{ borderRadius: Radius.sm }}
                />
                <SkeletonBox width={80} height={14} bg={colors.background} />
                <View style={{ flex: 1 }} />
                <SkeletonBox width={120} height={14} bg={colors.background} />
              </View>
            ))
          ) : (
            <>
              <InfoRow icon="person-outline" label="Name" value={profile?.name ?? '—'} />
              <InfoRow icon="mail-outline" label="Email" value={profile?.email ?? '—'} />
              <InfoRow icon="call-outline" label="Phone" value={profile?.phone ?? '—'} isLast />
            </>
          )}
        </Section>

        {/* ── Preferences ── */}
        <Section title="PREFERENCES">
          <InfoRow icon="cash-outline" label="Currency" value={profile?.currency ?? '—'} />
          <InfoRow
            icon={isDark ? 'moon' : 'sunny-outline'}
            label="Dark Mode"
            isLast
            rightSlot={
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ true: colors.primary, false: colors.border.default }}
                thumbColor={colors.surface}
              />
            }
          />
        </Section>

        {/* ── Support ── */}
        <Section title="SUPPORT">
          <InfoRow
            icon="mail-outline"
            label="Contact Us"
            value={SUPPORT_EMAIL}
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            isLast
          />
        </Section>

        {/* ── Legal ── */}
        <Section title="LEGAL">
          <InfoRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Linking.openURL(TERMS_URL)}
          />
          <InfoRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL(PRIVACY_URL)}
            isLast
          />
        </Section>

        {/* ── App ── */}
        <Section title="APP">
          <InfoRow icon="information-circle-outline" label="Version" value={APP_VERSION} />
          <InfoRow
            icon="person-remove-outline"
            label="Delete Account"
            onPress={() => setDeleteVisible(true)}
            destructive
            isLast
          />
        </Section>

        {/* ── Sign out button ── */}
        <TouchableOpacity
          onPress={clearAuth}
          style={[
            styles.signOutBtn,
            { backgroundColor: colors.surface, borderColor: colors.error + '66' },
          ]}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={[TextStyles.button, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Edit Profile modal ── */}
      <BottomModal visible={editVisible} onCancel={() => setEditVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%' }}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[TextStyles.headingSmall, { color: colors.text.primary }]}>
                EDIT PROFILE
              </Text>
              <TouchableOpacity
                onPress={() => setEditVisible(false)}
                style={[styles.closeBtn, { backgroundColor: colors.surface }]}
              >
                <Ionicons name="close" size={18} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <CustomTextInput
              id="name"
              formController={form}
              label="Name"
              placeholder="Your full name"
              type="text"
            />
            <CustomTextInput
              id="phone"
              formController={form}
              label="Phone"
              placeholder="+2348012345678"
              type="phone"
              hint="International format, e.g. +2348012345678"
            />
            <CustomButton label="Save changes" onPress={onSave} loading={isUpdating} />
          </View>
        </KeyboardAvoidingView>
      </BottomModal>

      {/* ── Delete account modal ── */}
      <BottomModal visible={deleteVisible} onCancel={() => setDeleteVisible(false)}>
        <View style={styles.deleteSheet}>
          <View style={[styles.deleteIconWrap, { backgroundColor: colors.error + '1A' }]}>
            <Ionicons name="person-remove-outline" size={28} color={colors.error} />
          </View>

          <View style={styles.deleteTextGroup}>
            <Text
              style={[TextStyles.headingSmall, { color: colors.text.primary, textAlign: 'center' }]}
            >
              Delete your account?
            </Text>
            <Text style={[TextStyles.body, { color: colors.text.secondary, textAlign: 'center' }]}>
              Your account and all associated data will be{' '}
              <Text style={{ fontWeight: '600', color: colors.text.primary }}>
                permanently deleted in 7 days
              </Text>
              . You can log back in before then to cancel the deletion.
            </Text>
          </View>

          <View style={[styles.deleteWarning, { backgroundColor: colors.secondaryContainer }]}>
            <Ionicons name="warning-outline" size={16} color={colors.secondary} />
            <Text style={[TextStyles.caption, { color: colors.onSecondaryContainer, flex: 1 }]}>
              Groups, pools, expenses, and settlements tied to your account will also be affected.
            </Text>
          </View>

          <View style={styles.deleteActions}>
            <TouchableOpacity
              onPress={() => setDeleteVisible(false)}
              style={[
                styles.deleteBtn,
                { backgroundColor: colors.surface, borderColor: colors.border.default },
              ]}
            >
              <Text style={[TextStyles.button, { color: colors.text.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteAccount()}
              disabled={isDeleting}
              style={[
                styles.deleteBtn,
                { backgroundColor: colors.error },
                isDeleting && { opacity: 0.6 },
              ]}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[TextStyles.button, { color: '#fff' }]}>Schedule Deletion</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>
    </ScreenContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  // Hero
  hero: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  memberBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  // Scroll content
  scrollContent: {
    gap: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  // Section
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
    overflow: 'hidden',
  },
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
  },
  // Sign out
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 50,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  // Modal
  modalContent: {
    width: '100%',
    gap: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Delete sheet
  deleteSheet: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  deleteIconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTextGroup: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deleteWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    width: '100%',
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  deleteBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
