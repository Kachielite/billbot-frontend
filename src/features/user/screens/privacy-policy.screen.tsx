import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';

const LAST_UPDATED = 'April 28, 2026';

type SectionProps = { title: string; children: React.ReactNode };

function Section({ title, children }: SectionProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.section}>
      <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>{title}</Text>
      {children}
    </View>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <Text style={[TextStyles.body, styles.para, { color: colors.text.secondary }]}>{children}</Text>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <View style={styles.bullet}>
      <Text style={[TextStyles.body, { color: colors.text.secondary }]}>{'•'}</Text>
      <Text style={[TextStyles.body, { color: colors.text.secondary, flex: 1 }]}>{children}</Text>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation();

  return (
    <ScreenContainer useScrollView={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
        >
          <FontAwesome6 name="chevron-left" size={16} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>
          Privacy Policy
        </Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : 100 },
        ]}
      >
        <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
          Last updated: {LAST_UPDATED}
        </Text>

        <Para>
          At BillBot, we respect your privacy. This policy explains what data we collect, why we
          collect it, and how we protect it. By using BillBot, you agree to the practices described
          here.
        </Para>

        <Section title="1. Information We Collect">
          <Para>We collect information you provide directly:</Para>
          <Bullet>
            <Text style={{ fontWeight: '600' }}>Account details</Text> — your name, email address,
            and phone number when you register.
          </Bullet>
          <Bullet>
            <Text style={{ fontWeight: '600' }}>Profile photo</Text> — if you choose to upload one.
          </Bullet>
          <Bullet>
            <Text style={{ fontWeight: '600' }}>Expense data</Text> — amounts, descriptions,
            categories, currencies, and receipt images you log.
          </Bullet>
          <Bullet>
            <Text style={{ fontWeight: '600' }}>Group and tab data</Text> — names, members, and
            balances associated with your groups.
          </Bullet>
          <Para>We also collect limited technical data automatically:</Para>
          <Bullet>Device type and operating system.</Bullet>
          <Bullet>App version and session activity logs.</Bullet>
          <Bullet>Crash reports to help us fix bugs.</Bullet>
        </Section>

        <Section title="2. How We Use Your Information">
          <Para>We use your data to:</Para>
          <Bullet>Provide and maintain the BillBot service.</Bullet>
          <Bullet>Sync your expenses, groups, and balances across devices.</Bullet>
          <Bullet>Send you relevant notifications about group activity and settlements.</Bullet>
          <Bullet>Improve app performance and fix issues using anonymised crash data.</Bullet>
          <Bullet>Respond to support requests you send us.</Bullet>
          <Para>
            We do not sell your personal data to third parties. We do not use your data for
            advertising.
          </Para>
        </Section>

        <Section title="3. Data Sharing">
          <Para>Your data is shared only in the following limited cases:</Para>
          <Bullet>
            <Text style={{ fontWeight: '600' }}>Group members</Text> — expenses and balances you log
            within a group are visible to all members of that group.
          </Bullet>
          <Bullet>
            <Text style={{ fontWeight: '600' }}>Service providers</Text> — we use trusted
            infrastructure providers (cloud hosting, authentication, file storage) who process data
            on our behalf under strict confidentiality obligations.
          </Bullet>
          <Bullet>
            <Text style={{ fontWeight: '600' }}>Legal requirements</Text> — we may disclose data if
            required by law or to protect the rights and safety of our users.
          </Bullet>
        </Section>

        <Section title="4. Receipt Images">
          <Para>
            When you attach a receipt image to an expense, it is uploaded to secure cloud storage.
            Receipt images are accessible only to you and members of the tab or group the expense
            belongs to. You can delete an expense (and its receipt) at any time.
          </Para>
        </Section>

        <Section title="5. Data Retention">
          <Para>
            We retain your data for as long as your account is active. When you request account
            deletion, your account and all associated personal data are permanently removed within 7
            days. Group expense history that involves other users may be anonymised rather than
            deleted to preserve their records.
          </Para>
        </Section>

        <Section title="6. Security">
          <Para>
            We use industry-standard measures to protect your data, including encrypted connections
            (HTTPS/TLS) for all data in transit and encrypted storage at rest. No system is
            completely secure, however, and we cannot guarantee absolute security.
          </Para>
          <Para>
            If you believe your account has been compromised, contact us immediately at{' '}
            <Text style={{ color: colors.primary }}>derrick.onyekachi@gmail.com</Text>.
          </Para>
        </Section>

        <Section title="7. Your Rights">
          <Para>Depending on your location, you may have the right to:</Para>
          <Bullet>Access the personal data we hold about you.</Bullet>
          <Bullet>Correct inaccurate data in your profile.</Bullet>
          <Bullet>Request deletion of your account and data.</Bullet>
          <Bullet>Object to or restrict how we process your data.</Bullet>
          <Para>
            To exercise any of these rights, contact us at{' '}
            <Text style={{ color: colors.primary }}>derrick.onyekachi@gmail.com</Text>.
          </Para>
        </Section>

        <Section title="8. Children's Privacy">
          <Para>
            BillBot is not intended for children under 16. We do not knowingly collect personal data
            from anyone under 16. If we become aware that a child under 16 has provided us with
            personal data, we will delete it promptly.
          </Para>
        </Section>

        <Section title="9. Third-Party Services">
          <Para>
            BillBot uses third-party authentication providers (Google Sign-In, Apple Sign-In). When
            you sign in through these services, their own privacy policies apply to the data they
            process.
          </Para>
        </Section>

        <Section title="10. Changes to This Policy">
          <Para>
            We may update this Privacy Policy from time to time. When we do, we&apos;ll update the
            &quot;Last updated&quot; date above. We encourage you to review this policy
            periodically. Continued use of BillBot after changes take effect means you accept the
            updated policy.
          </Para>
        </Section>

        <Section title="11. Contact Us">
          <Para>
            If you have questions or concerns about this Privacy Policy or how we handle your data,
            please contact us at:{'\n'}
            <Text style={{ color: colors.primary }}>derrick.onyekachi@gmail.com</Text>
          </Para>
        </Section>
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
    width: 45,
    height: 45,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  section: {
    gap: Spacing.sm,
  },
  para: {
    lineHeight: 22,
  },
  bullet: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
});
