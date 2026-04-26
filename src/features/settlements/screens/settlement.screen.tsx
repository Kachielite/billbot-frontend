import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import ScreenLoader from '@/core/common/components/screen.loader';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import moment from 'moment';
import useSettlementDetail from '@/features/settlements/hooks/use-settlement-detail';
import useConfirmSettlement from '@/features/settlements/hooks/use-confirm-settlement';
import usePoolDetail from '@/features/pools/hooks/use-pool-detail';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import MemberAvatar from '@/core/common/components/member-avatar';
import useGetName from '@/core/common/hooks/use-get-name';
import useProfile from '@/features/user/hooks/use-profile';
import DisputeSettlementModal from '@/features/settlements/components/dispute-settlement-modal';
import ReceiptViewer from '@/features/expenses/components/receipt-viewer';
import { SettlementStatus } from '@/features/settlements/settlements.interface';

type Props = StaticScreenProps<{ settlementId: string; poolId: string }>;

const STATUS_CONFIG: Record<
  SettlementStatus,
  {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    colorKey: 'settled' | 'pending' | 'disputed';
  }
> = {
  settled: { label: 'Confirmed', icon: 'checkmark-circle', colorKey: 'settled' },
  pending_verification: { label: 'Pending Confirmation', icon: 'time', colorKey: 'pending' },
  disputed: { label: 'Disputed', icon: 'alert-circle', colorKey: 'disputed' },
};

export default function SettlementScreen({ route }: Props) {
  const { settlementId, poolId } = route.params;
  const { canGoBack, goBack } = useNavigation();
  const colors = useThemeColors();
  const getName = useGetName();
  const { profile } = useProfile();

  const { settlement, isLoading } = useSettlementDetail(settlementId);
  const { pool } = usePoolDetail(poolId);
  const { group } = useGroupDetail(pool?.groupId ?? '');
  const members = group?.members ?? [];

  const { confirmSettlement, isConfirming } = useConfirmSettlement(poolId);

  const [showDisputeModal, setShowDisputeModal] = React.useState(false);
  const [showProof, setShowProof] = React.useState(false);

  if (isLoading) return <ScreenLoader />;

  if (!settlement) {
    return (
      <ScreenContainer>
        <Text style={[TextStyles.body, { color: colors.text.secondary }]}>
          Settlement not found.
        </Text>
      </ScreenContainer>
    );
  }

  const fromMember = members.find((m) => m.userId === settlement.fromUser) ?? null;
  const toMember = members.find((m) => m.userId === settlement.toUser) ?? null;
  const fromName = fromMember
    ? getName({ id: fromMember.userId, name: fromMember.name })
    : 'Unknown';
  const toName = toMember ? getName({ id: toMember.userId, name: toMember.name }) : 'Unknown';

  const cfg = STATUS_CONFIG[settlement.status];
  const badgeBg = colors.status[`${cfg.colorKey}Container` as keyof typeof colors.status] as string;
  const badgeFg = colors.status[
    `on${cfg.colorKey.charAt(0).toUpperCase()}${cfg.colorKey.slice(1)}Container` as keyof typeof colors.status
  ] as string;
  const badgeIcon = colors.status[cfg.colorKey] as string;

  const canAct = profile?.id === settlement.toUser && settlement.status === 'pending_verification';

  const amount = settlement.amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleConfirm = async () => {
    await confirmSettlement(settlement.id);
    if (canGoBack()) goBack();
  };

  return (
    <ScreenContainer useScrollView={false}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => {
            if (canGoBack()) goBack();
          }}
        >
          <FontAwesome6 name="chevron-left" size={16} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>Settlement</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : 100,
          gap: Spacing.xxl,
        }}
      >
        {/* ── Hero card ── */}
        <View
          style={[styles.heroCard, { backgroundColor: badgeBg, borderColor: badgeIcon + '40' }]}
        >
          <View style={styles.heroBadge}>
            <Ionicons name={cfg.icon} size={16} color={badgeIcon} />
            <Text style={[TextStyles.captionBold, { color: badgeFg }]}>{cfg.label}</Text>
          </View>
          <Text style={[TextStyles.displaySmall, { color: colors.text.primary }]}>
            {settlement.currency} {amount}
          </Text>
          <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
            {moment(settlement.createdAt).isValid()
              ? moment(settlement.createdAt).format('MMMM D, YYYY [at] h:mm A')
              : '—'}
          </Text>
        </View>

        {/* ── Participants ── */}
        <View style={styles.section}>
          <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Participants</Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border.default },
            ]}
          >
            <View style={styles.participantRow}>
              <View style={styles.participantUser}>
                <MemberAvatar
                  name={fromMember?.name ?? 'U'}
                  avatarUrl={fromMember?.avatarUrl ?? null}
                  avatarSize={40}
                />
                <View>
                  <Text style={[TextStyles.label, { color: colors.text.disabled }]}>FROM</Text>
                  <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                    {fromName}
                  </Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color={colors.text.disabled} />
              <View style={styles.participantUser}>
                <MemberAvatar
                  name={toMember?.name ?? 'U'}
                  avatarUrl={toMember?.avatarUrl ?? null}
                  avatarSize={40}
                />
                <View>
                  <Text style={[TextStyles.label, { color: colors.text.disabled }]}>TO</Text>
                  <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                    {toName}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Details ── */}
        <View style={styles.section}>
          <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Details</Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border.default },
            ]}
          >
            {[
              { label: 'CURRENCY', value: settlement.currency },
              {
                label: 'CONFIRMED AT',
                value: settlement.confirmedAt
                  ? moment(settlement.confirmedAt).format('MMMM D, YYYY')
                  : '—',
              },
            ].map((row, index, arr) => (
              <View
                key={row.label}
                style={[
                  styles.infoRow,
                  index < arr.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border.subtle,
                    paddingBottom: Spacing.sm,
                    marginBottom: Spacing.sm,
                  },
                ]}
              >
                <Text style={[TextStyles.label, { color: colors.text.disabled }]}>{row.label}</Text>
                <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Note ── */}
        {settlement.note ? (
          <View style={styles.section}>
            <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Note</Text>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border.default },
              ]}
            >
              <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]}>
                {settlement.note}
              </Text>
            </View>
          </View>
        ) : null}

        {/* ── Disputed reason ── */}
        {settlement.status === 'disputed' && settlement.disputedReason ? (
          <View style={styles.section}>
            <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>
              Dispute Reason
            </Text>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.status.disputedContainer,
                  borderColor: colors.status.disputed + '40',
                },
              ]}
            >
              <Text style={[TextStyles.bodySmall, { color: colors.status.onDisputedContainer }]}>
                {settlement.disputedReason}
              </Text>
            </View>
          </View>
        ) : null}

        {/* ── Proof image ── */}
        {settlement.proofUrl ? (
          <View style={styles.section}>
            <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>
              Proof of Payment
            </Text>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setShowProof(true)}>
              <Image
                source={{ uri: settlement.proofUrl }}
                style={[styles.proofImage, { borderColor: colors.border.default }]}
                resizeMode="cover"
              />
              <View style={[styles.proofOverlay, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
                <Ionicons name="expand-outline" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ── Actions ── */}
        {canAct && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.status.settledContainer, flex: 1 },
              ]}
              onPress={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <ActivityIndicator size="small" color={colors.status.settled} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={colors.status.settled}
                  />
                  <Text style={[TextStyles.label, { color: colors.status.onSettledContainer }]}>
                    Confirm Payment
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.status.disputedContainer, flex: 1 },
              ]}
              onPress={() => setShowDisputeModal(true)}
            >
              <Ionicons name="alert-circle-outline" size={18} color={colors.status.disputed} />
              <Text style={[TextStyles.label, { color: colors.status.onDisputedContainer }]}>
                Dispute
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <DisputeSettlementModal
        visible={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        settlement={settlement}
        poolId={poolId}
      />

      {settlement.proofUrl && (
        <ReceiptViewer
          uri={settlement.proofUrl}
          visible={showProof}
          onClose={() => setShowProof(false)}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderWidth: Border.thin,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  section: {
    gap: Spacing.md,
  },
  card: {
    borderWidth: Border.thin,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  participantUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  proofImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
  },
  proofOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
});
