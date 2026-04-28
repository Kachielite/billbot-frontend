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

export default function TermsOfServiceScreen() {
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
          Terms of Service
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
          Welcome to BillBot. By using the app, you agree to these Terms of Service. Please read
          them carefully. If you do not agree, do not use BillBot.
        </Para>

        <Section title="1. Who Can Use BillBot">
          <Para>
            You must be at least 16 years old to use BillBot. By creating an account, you confirm
            that the information you provide is accurate and that you have the legal capacity to
            enter into these terms.
          </Para>
        </Section>

        <Section title="2. What BillBot Does">
          <Para>
            BillBot is an expense-tracking and bill-splitting tool. It helps you log shared
            expenses, track balances within groups and tabs, and coordinate settlements between
            members. BillBot does not process payments itself — it records and tracks what users
            report.
          </Para>
        </Section>

        <Section title="3. Your Account">
          <Para>You are responsible for:</Para>
          <Bullet>Keeping your login credentials confidential.</Bullet>
          <Bullet>All activity that occurs under your account.</Bullet>
          <Bullet>Notifying us immediately if you suspect unauthorised access.</Bullet>
          <Para>
            We reserve the right to suspend or terminate accounts that violate these terms.
          </Para>
        </Section>

        <Section title="4. User Responsibilities">
          <Para>When using BillBot, you agree not to:</Para>
          <Bullet>Enter false, misleading, or fraudulent expense data.</Bullet>
          <Bullet>Use the app for any unlawful purpose.</Bullet>
          <Bullet>Attempt to gain unauthorised access to other users&apos; data.</Bullet>
          <Bullet>Reverse-engineer, scrape, or abuse the BillBot API.</Bullet>
          <Para>
            You are solely responsible for the accuracy of expenses and settlements you record.
            BillBot is not liable for disputes arising from inaccurate data entered by users.
          </Para>
        </Section>

        <Section title="5. Groups and Tabs">
          <Para>
            When you create a group or tab and invite others, you take on the role of administrator
            for that group. You are responsible for managing membership and ensuring that invited
            members have consented to join.
          </Para>
          <Para>
            Members can leave a group at any time. Leaving a group does not erase historical expense
            records — those remain visible to remaining members.
          </Para>
        </Section>

        <Section title="6. Data and Privacy">
          <Para>
            Your use of BillBot is also governed by our Privacy Policy, which is incorporated into
            these terms by reference. By using BillBot, you consent to the data practices described
            in the Privacy Policy.
          </Para>
        </Section>

        <Section title="7. Intellectual Property">
          <Para>
            All content, branding, and software within BillBot are owned by or licensed to
            Kachielite. You may not copy, modify, distribute, or create derivative works without our
            express written permission.
          </Para>
        </Section>

        <Section title="8. Disclaimers">
          <Para>
            BillBot is provided &quot;as is&quot; without warranties of any kind, express or
            implied. We do not guarantee that the app will be error-free, uninterrupted, or free
            from security vulnerabilities.
          </Para>
          <Para>
            BillBot is not a financial services provider. Any financial decisions you make based on
            data within the app are your own responsibility.
          </Para>
        </Section>

        <Section title="9. Limitation of Liability">
          <Para>
            To the fullest extent permitted by law, Kachielite shall not be liable for any indirect,
            incidental, special, or consequential damages arising from your use of BillBot,
            including but not limited to loss of data, financial loss, or disputes between group
            members.
          </Para>
        </Section>

        <Section title="10. Termination">
          <Para>
            You may delete your account at any time from the Profile screen. Upon deletion, your
            account is scheduled for permanent removal within 7 days. During that window, you may
            log back in to cancel the deletion.
          </Para>
          <Para>
            We may suspend or terminate your access if you violate these terms or if we discontinue
            the service, with reasonable notice where possible.
          </Para>
        </Section>

        <Section title="11. Changes to These Terms">
          <Para>
            We may update these terms from time to time. When we do, we&apos;ll update the
            &quot;Last updated&quot; date above. Continued use of BillBot after changes take effect
            constitutes your acceptance of the revised terms.
          </Para>
        </Section>

        <Section title="12. Contact">
          <Para>
            If you have questions about these Terms, please reach out to us at{'\n'}
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
