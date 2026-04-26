import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { GroupMember } from '@/features/groups/groups.interface';
import { Settlement } from '@/features/settlements/settlements.interface';
import SettlementCard from '@/features/settlements/components/settlement-card';
import DisputeSettlementModal from '@/features/settlements/components/dispute-settlement-modal';
import usePoolSettlements from '@/features/settlements/hooks/use-pool-settlements';
import useConfirmSettlement from '@/features/settlements/hooks/use-confirm-settlement';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  poolId: string;
  members: GroupMember[];
  onRecordPayment: () => void;
};

export default function PoolSettlementsSection({ poolId, members, onRecordPayment }: Props) {
  const colors = useThemeColors();
  const { settlements, isLoading } = usePoolSettlements(poolId);
  const { confirmSettlement, isConfirming } = useConfirmSettlement(poolId);

  const [disputeTarget, setDisputeTarget] = React.useState<Settlement | null>(null);

  return (
    <View style={styles.container}>
      {/* ── Section title row ── */}
      <View style={styles.titleRow}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Settlements</Text>
        <TouchableOpacity
          style={[
            styles.recordBtn,
            { backgroundColor: colors.primaryContainer, borderColor: colors.primary },
          ]}
          onPress={onRecordPayment}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text style={[TextStyles.label, { color: colors.primary }]}>Record Payment</Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : settlements.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: colors.surface, borderColor: colors.border.default },
          ]}
        >
          <Ionicons name="swap-horizontal-outline" size={28} color={colors.text.disabled} />
          <Text style={[TextStyles.bodySmall, { color: colors.text.disabled }]}>
            No settlements recorded yet
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {settlements.map((s) => (
            <SettlementCard
              key={s.id}
              settlement={s}
              members={members}
              onConfirm={confirmSettlement}
              onDispute={(settlement) => setDisputeTarget(settlement)}
              isConfirming={isConfirming}
            />
          ))}
        </View>
      )}

      <DisputeSettlementModal
        visible={!!disputeTarget}
        onClose={() => setDisputeTarget(null)}
        settlement={disputeTarget}
        poolId={poolId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.md,
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  list: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  center: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
