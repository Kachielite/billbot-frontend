import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import InfoBox from '@/core/common/components/info-box';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '@/core/common/components/form/custom-button';
import { Border, Input, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { useNavigation } from '@react-navigation/native';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useGroups from '@/features/groups/hooks/use-groups';
import useGroupsStore from '@/features/groups/groups.state';
import useGroupPools from '@/features/pools/hooks/use-group-pools';
import usePoolsStore from '@/features/pools/pools.state';

export default function NewExpenseHomeScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();

  const [step, setStep] = React.useState<1 | 2>(1);

  // ── Step 1: Group ────────────────────────────────────────────────────────────
  const { groups, isLoading: isLoadingGroups } = useGroups();
  const { selectedGroup, setSelectedGroup } = useGroupsStore();
  const [openGroups, setOpenGroups] = React.useState(false);
  const groupItems = React.useMemo(
    () => groups.map((g) => ({ label: g.name, value: g.id })),
    [groups],
  );

  // ── Step 2: Tab (Pool) ───────────────────────────────────────────────────────
  const { pools, isLoading: isLoadingPools } = useGroupPools(selectedGroup?.id ?? '');
  const { selectedPool, setSelectedPool } = usePoolsStore();
  const [openPools, setOpenPools] = React.useState(false);
  const poolItems = React.useMemo(
    () => pools.map((p) => ({ label: p.name, value: p.id })),
    [pools],
  );

  // Reset pool selection when group changes
  React.useEffect(() => {
    setSelectedPool(null);
  }, [selectedGroup?.id]);

  const handleGroupChange = (valueOrFn: any) => {
    const nextValue =
      typeof valueOrFn === 'function' ? valueOrFn(selectedGroup?.id ?? null) : valueOrFn;
    const group = groups.find((g) => g.id === nextValue) ?? null;
    setSelectedGroup(group);
  };

  const handlePoolChange = (valueOrFn: any) => {
    const nextValue =
      typeof valueOrFn === 'function' ? valueOrFn(selectedPool?.id ?? null) : valueOrFn;
    const pool = pools.find((p) => p.id === nextValue) ?? null;
    setSelectedPool(pool);
  };

  const canContinueStep1 = !!selectedGroup && !isLoadingGroups;
  const canContinueStep2 = !!selectedPool && !isLoadingPools;

  const isStep1 = step === 1;

  return (
    <CustomFormSheet>
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRight}>
            <View>
              <Text
                style={[
                  TextStyles.headingSmall,
                  { color: colors.text.primary, textTransform: 'uppercase' },
                ]}
              >
                NEW EXPENSE
              </Text>
            </View>
          </View>
          <View style={styles.backBtnContainer}>
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: colors.surface }]}
              onPress={() => {
                if (step === 2) {
                  setStep(1);
                } else {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons
                name={step === 2 ? 'arrow-back' : 'close'}
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Step indicator ── */}
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
          <View
            style={[
              styles.stepLine,
              { backgroundColor: isStep1 ? colors.primary : colors.border.default },
            ]}
          />
          <Text
            style={[styles.stepLabel, { color: isStep1 ? colors.primary : colors.text.secondary }]}
          >
            {isStep1 ? 'Select Group' : 'Select Tab'}
          </Text>
          <View
            style={[
              styles.stepLine,
              { backgroundColor: isStep1 ? colors.border.default : colors.primary },
            ]}
          />
          <View
            style={[
              styles.stepDot,
              { backgroundColor: step === 2 ? colors.primary : colors.border.default },
            ]}
          />
        </View>

        {/* ── Step 1: Group ── */}
        {isStep1 && (
          <>
            <InfoBox
              title="Expenses live inside tabs."
              description="First, select the group this expense belongs to. You'll pick the tab next."
            />
            <View style={styles.optionContainer}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Group</Text>
              <DropDownPicker
                open={openGroups}
                value={selectedGroup?.id ?? null}
                items={groupItems}
                setOpen={setOpenGroups}
                setItems={() => {}}
                setValue={handleGroupChange}
                placeholder="Select a group"
                disabled={isLoadingGroups}
                dropDownDirection="AUTO"
                style={[
                  styles.dropdown,
                  { borderColor: colors.border.default, backgroundColor: colors.surface },
                  isLoadingGroups && { opacity: 0.6 },
                ]}
                dropDownContainerStyle={[
                  styles.dropdownContainer,
                  { borderColor: colors.border.default, backgroundColor: colors.surface },
                ]}
                listItemContainerStyle={{ backgroundColor: colors.surface }}
                listItemLabelStyle={[styles.itemText, { color: colors.text.primary }]}
                selectedItemContainerStyle={{ backgroundColor: colors.primaryContainer }}
                selectedItemLabelStyle={{ color: colors.primary }}
                textStyle={[styles.selectedTextStyle, { color: colors.text.primary }]}
                placeholderStyle={[styles.placeholderStyle, { color: colors.text.inverse }]}
                zIndex={3000}
                zIndexInverse={1000}
                listMode="SCROLLVIEW"
                maxHeight={280}
              />
            </View>
            <CustomButton
              label="Next → Pick a Tab"
              onPress={() => setStep(2)}
              disabled={!canContinueStep1}
            />
          </>
        )}

        {/* ── Step 2: Pool (Tab) ── */}
        {!isStep1 && (
          <>
            <InfoBox
              title={`Group: ${selectedGroup?.name}`}
              description="Now select which tab this expense should go into."
            />
            <View style={styles.optionContainer}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Tab</Text>
              <DropDownPicker
                open={openPools}
                value={selectedPool?.id ?? null}
                items={poolItems}
                setOpen={setOpenPools}
                setItems={() => {}}
                setValue={handlePoolChange}
                placeholder={isLoadingPools ? 'Loading tabs…' : 'Select a tab'}
                disabled={isLoadingPools}
                dropDownDirection="AUTO"
                style={[
                  styles.dropdown,
                  { borderColor: colors.border.default, backgroundColor: colors.surface },
                  isLoadingPools && { opacity: 0.6 },
                ]}
                dropDownContainerStyle={[
                  styles.dropdownContainer,
                  { borderColor: colors.border.default, backgroundColor: colors.surface },
                ]}
                listItemContainerStyle={{ backgroundColor: colors.surface }}
                listItemLabelStyle={[styles.itemText, { color: colors.text.primary }]}
                selectedItemContainerStyle={{ backgroundColor: colors.primaryContainer }}
                selectedItemLabelStyle={{ color: colors.primary }}
                textStyle={[styles.selectedTextStyle, { color: colors.text.primary }]}
                placeholderStyle={[styles.placeholderStyle, { color: colors.text.inverse }]}
                zIndex={3000}
                zIndexInverse={1000}
                listMode="SCROLLVIEW"
                maxHeight={280}
              />
            </View>
            <CustomButton
              label="Continue to Expense"
              onPress={() => {
                navigation.navigate('NewExpense');
              }}
              disabled={!canContinueStep2}
            />
          </>
        )}
      </View>
    </CustomFormSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    gap: Spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  backBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.sm,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: Spacing.xs,
  },
  stepLabel: {
    ...TextStyles.bodySmall,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginHorizontal: Spacing.xs,
  },
  optionContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
    width: '100%',
  },
  label: {
    ...TextStyles.label,
  },
  dropdown: {
    ...Input,
    borderWidth: Border.thin,
    borderRadius: Radius.md,
    minHeight: 48,
  },
  dropdownContainer: {
    borderWidth: Border.thin,
    borderRadius: Radius.md,
  },
  placeholderStyle: {
    ...TextStyles.bodySmall,
  },
  selectedTextStyle: {
    ...TextStyles.bodySmall,
  },
  itemText: {
    ...TextStyles.bodySmall,
  },
});
