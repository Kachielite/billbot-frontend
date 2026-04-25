import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import React from 'react';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import { Fonts, FontSize, TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import InfoBox from '@/core/common/components/info-box';
import RNPickerSelect from 'react-native-picker-select';
import CustomButton from '@/core/common/components/form/custom-button';
import { Border, Input, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { useNavigation, StackActions } from '@react-navigation/native';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useGroups from '@/features/groups/hooks/use-groups';
import useGroupsStore from '@/features/groups/groups.state';
import useGroupPools from '@/features/pools/hooks/use-group-pools';
import usePoolsStore from '@/features/pools/pools.state';

export default function NewExpenseHomeScreen() {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const colors = useThemeColors();

  const [step, setStep] = React.useState<1 | 2>(1);

  // ── Step 1: Group ────────────────────────────────────────────────────────────
  const { groups, isLoading: isLoadingGroups } = useGroups();
  const sortedGroups = React.useMemo(() => {
    return [...groups].sort((a, b) => {
      const nameA = a.name?.trim() ?? '';
      const nameB = b.name?.trim() ?? '';
      if (nameA === '' && nameB === '') return 0;
      if (nameA === '') return 1;
      if (nameB === '') return -1;
      return nameA.localeCompare(nameB);
    });
  }, [groups]);
  const { selectedGroup, setSelectedGroup } = useGroupsStore();
  const groupItems = React.useMemo(
    () => sortedGroups.map((g) => ({ label: g.name, value: g.id })),
    [groups],
  );
  const [isGroupOpen, setIsGroupOpen] = React.useState(false);
  const groupPickerRef = React.useRef<any>(null);

  // ── Step 2: Pool (Tab) ───────────────────────────────────────────────────────
  const { pools, isLoading: isLoadingPools } = useGroupPools(selectedGroup?.id ?? '');
  const sortedPools = React.useMemo(() => {
    return [...pools].sort((a, b) => {
      const nameA = a.name?.trim() ?? '';
      const nameB = b.name?.trim() ?? '';
      if (nameA === '' && nameB === '') return 0;
      if (nameA === '') return 1;
      if (nameB === '') return -1;
      return nameA.localeCompare(nameB);
    });
  }, [pools]);
  const { selectedPool, setSelectedPool } = usePoolsStore();
  const poolItems = React.useMemo(
    () => sortedPools.map((p) => ({ label: p.name, value: p.id })),
    [pools],
  );
  const [isPoolOpen, setIsPoolOpen] = React.useState(false);
  const poolPickerRef = React.useRef<any>(null);

  React.useEffect(() => {
    setSelectedPool(null);
  }, [selectedGroup?.id]);

  const canContinueStep1 = !!selectedGroup && !isLoadingGroups;
  const canContinueStep2 = !!selectedPool && !isLoadingPools;
  const isStep1 = step === 1;

  const makePickerStyle = (isFocused: boolean, isDisabled: boolean) => {
    const borderColor = isFocused
      ? colors.primary
      : isDisabled
        ? colors.border.subtle
        : colors.border.default;
    const inputBase = {
      height: Input.height,
      paddingHorizontal: Input.paddingHorizontal,
      paddingRight: 40,
      borderRadius: Radius.md,
      borderWidth: isFocused ? 2 : Border.thin,
      borderColor,
      backgroundColor: colors.surface,
      color: colors.text.primary,
      fontFamily: Fonts.regular,
      fontSize: FontSize.sm,
    };
    return {
      inputIOS: inputBase,
      inputAndroid: inputBase,
      placeholder: {
        color: colors.text.disabled,
        fontFamily: Fonts.regular,
        fontSize: FontSize.sm,
      },
    };
  };

  return (
    <CustomFormSheet>
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRight}>
            <Text
              style={[
                TextStyles.headingSmall,
                { color: colors.text.primary, textTransform: 'uppercase' },
              ]}
            >
              NEW EXPENSE
            </Text>
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
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  activeOpacity={1}
                  disabled={isLoadingGroups}
                  onPress={() => groupPickerRef.current?.togglePicker(true)}
                  style={[
                    styles.pickerWrapper,
                    isGroupOpen && styles.pickerFocus,
                    isLoadingGroups && { opacity: 0.6 },
                  ]}
                >
                  <View pointerEvents="none">
                    <RNPickerSelect
                      ref={groupPickerRef}
                      items={groupItems}
                      value={selectedGroup?.id ?? null}
                      onValueChange={(value) => {
                        const group = value ? (groups.find((g) => g.id === value) ?? null) : null;
                        setSelectedGroup(group);
                      }}
                      placeholder={{
                        label: 'Select a group',
                        value: null,
                        color: colors.text.disabled,
                      }}
                      disabled={isLoadingGroups}
                      useNativeAndroidPickerStyle={false}
                      darkTheme={scheme === 'dark'}
                      onOpen={() => setIsGroupOpen(true)}
                      onClose={() => setIsGroupOpen(false)}
                      style={makePickerStyle(isGroupOpen, isLoadingGroups)}
                    />
                  </View>
                  <View style={styles.iconOverlay} pointerEvents="none">
                    <Ionicons
                      name={isGroupOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={isLoadingGroups ? colors.text.disabled : colors.text.secondary}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.pickerWrapper,
                    isGroupOpen && styles.pickerFocus,
                    isLoadingGroups && { opacity: 0.6 },
                  ]}
                >
                  <RNPickerSelect
                    items={groupItems}
                    value={selectedGroup?.id ?? null}
                    onValueChange={(value) => {
                      const group = value ? (groups.find((g) => g.id === value) ?? null) : null;
                      setSelectedGroup(group);
                    }}
                    placeholder={{
                      label: 'Select a group',
                      value: null,
                      color: colors.text.disabled,
                    }}
                    disabled={isLoadingGroups}
                    useNativeAndroidPickerStyle={false}
                    darkTheme={scheme === 'dark'}
                    onOpen={() => setIsGroupOpen(true)}
                    onClose={() => setIsGroupOpen(false)}
                    style={makePickerStyle(isGroupOpen, isLoadingGroups)}
                  />
                  <View style={styles.iconOverlay} pointerEvents="none">
                    <Ionicons
                      name={isGroupOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={isLoadingGroups ? colors.text.disabled : colors.text.secondary}
                    />
                  </View>
                </View>
              )}
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
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  activeOpacity={1}
                  disabled={isLoadingPools}
                  onPress={() => poolPickerRef.current?.togglePicker(true)}
                  style={[
                    styles.pickerWrapper,
                    isPoolOpen && styles.pickerFocus,
                    isLoadingPools && { opacity: 0.6 },
                  ]}
                >
                  <View pointerEvents="none">
                    <RNPickerSelect
                      ref={poolPickerRef}
                      items={poolItems}
                      value={selectedPool?.id ?? null}
                      onValueChange={(value) => {
                        const pool = value ? (pools.find((p) => p.id === value) ?? null) : null;
                        setSelectedPool(pool);
                      }}
                      placeholder={{
                        label: isLoadingPools ? 'Loading tabs…' : 'Select a tab',
                        value: null,
                        color: colors.text.disabled,
                      }}
                      disabled={isLoadingPools}
                      useNativeAndroidPickerStyle={false}
                      darkTheme={scheme === 'dark'}
                      onOpen={() => setIsPoolOpen(true)}
                      onClose={() => setIsPoolOpen(false)}
                      style={makePickerStyle(isPoolOpen, isLoadingPools)}
                    />
                  </View>
                  <View style={styles.iconOverlay} pointerEvents="none">
                    <Ionicons
                      name={isPoolOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={isLoadingPools ? colors.text.disabled : colors.text.secondary}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.pickerWrapper,
                    isPoolOpen && styles.pickerFocus,
                    isLoadingPools && { opacity: 0.6 },
                  ]}
                >
                  <RNPickerSelect
                    items={poolItems}
                    value={selectedPool?.id ?? null}
                    onValueChange={(value) => {
                      const pool = value ? (pools.find((p) => p.id === value) ?? null) : null;
                      setSelectedPool(pool);
                    }}
                    placeholder={{
                      label: isLoadingPools ? 'Loading tabs…' : 'Select a tab',
                      value: null,
                      color: colors.text.disabled,
                    }}
                    disabled={isLoadingPools}
                    useNativeAndroidPickerStyle={false}
                    darkTheme={scheme === 'dark'}
                    onOpen={() => setIsPoolOpen(true)}
                    onClose={() => setIsPoolOpen(false)}
                    style={makePickerStyle(isPoolOpen, isLoadingPools)}
                  />
                  <View style={styles.iconOverlay} pointerEvents="none">
                    <Ionicons
                      name={isPoolOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={isLoadingPools ? colors.text.disabled : colors.text.secondary}
                    />
                  </View>
                </View>
              )}
            </View>
            <CustomButton
              label="Continue to Expense"
              onPress={() => navigation.dispatch(StackActions.replace('NewExpense'))}
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
  pickerWrapper: {
    borderRadius: Radius.md,
    position: 'relative',
  },
  pickerFocus: {
    shadowColor: '#1B7A48',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
