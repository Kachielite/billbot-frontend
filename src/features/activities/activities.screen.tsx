import {
  ActivityIndicator,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import { Fonts, FontSize, TextStyles } from '@/core/common/constants/fonts';
import { Border, Input, Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import useActivities from '@/features/activities/hooks/use-activities';
import ActivityCard from '@/features/activities/components/activity-card';
import BottomModal from '@/core/common/components/layout/bottom-modal';
import EmptyState from '@/core/common/components/empty-state';
import SkeletonBox from '@/core/common/components/skeleton-box';
import useGroups from '@/features/groups/hooks/use-groups';
import { Activity } from '@/features/activities/activities.interface';
import RNPickerSelect from 'react-native-picker-select';
import RNDateTimePicker from '@react-native-community/datetimepicker';

// ── Date grouping ─────────────────────────────────────────────────────────────

type Section = { title: string; data: Activity[] };

const groupByDate = (items: Activity[]): Section[] => {
  const todayStart = moment().startOf('day');
  const yesterdayStart = moment().subtract(1, 'day').startOf('day');
  const weekStart = moment().startOf('isoWeek');
  const monthStart = moment().startOf('month');

  const buckets: Record<string, Activity[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    'This Month': [],
    Earlier: [],
  };

  for (const item of items) {
    const d = moment(item.createdAt);
    if (d.isSameOrAfter(todayStart)) buckets['Today'].push(item);
    else if (d.isSameOrAfter(yesterdayStart)) buckets['Yesterday'].push(item);
    else if (d.isSameOrAfter(weekStart)) buckets['This Week'].push(item);
    else if (d.isSameOrAfter(monthStart)) buckets['This Month'].push(item);
    else buckets['Earlier'].push(item);
  }

  return Object.entries(buckets)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
};

// ── Date preset ───────────────────────────────────────────────────────────────

type DatePreset = 'all' | 'today' | 'week' | 'month' | 'custom';

const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'all', label: 'All Time' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'custom', label: 'Custom' },
];

const presetToRange = (
  preset: DatePreset,
  customFrom: Date | null,
  customTo: Date | null,
): { from?: string; to?: string } => {
  if (preset === 'today')
    return { from: moment().startOf('day').toISOString(), to: moment().endOf('day').toISOString() };
  if (preset === 'week') return { from: moment().startOf('isoWeek').toISOString() };
  if (preset === 'month') return { from: moment().startOf('month').toISOString() };
  if (preset === 'custom')
    return {
      from: customFrom ? moment(customFrom).startOf('day').toISOString() : undefined,
      to: customTo ? moment(customTo).endOf('day').toISOString() : undefined,
    };
  return {};
};

// ── Standalone date field ─────────────────────────────────────────────────────

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
}) {
  const colors = useThemeColors();
  const [show, setShow] = React.useState(false);

  return (
    <View style={{ flex: 1, gap: Spacing.xs }}>
      <Text style={[TextStyles.label, { color: colors.text.disabled }]}>{label}</Text>
      <Pressable
        style={[
          styles.dateField,
          { borderColor: colors.border.default, backgroundColor: colors.surface },
        ]}
        onPress={() => setShow(true)}
      >
        <Text
          style={[
            TextStyles.bodySmall,
            { color: value ? colors.text.primary : colors.text.disabled },
          ]}
        >
          {value ? moment(value).format('MMM D, YYYY') : 'Select'}
        </Text>
        <Ionicons name="calendar-clear" size={15} color={colors.text.secondary} />
      </Pressable>

      {show && (
        <Modal transparent animationType="fade" onRequestClose={() => setShow(false)}>
          <Pressable style={styles.dateOverlay} onPress={() => setShow(false)}>
            <TouchableWithoutFeedback>
              <View style={[styles.datePickerCard, { backgroundColor: colors.background }]}>
                <RNDateTimePicker
                  value={value ?? new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, picked) => {
                    if (Platform.OS === 'android') setShow(false);
                    if (event.type === 'set' && picked) onChange(picked);
                  }}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.doneBtn, { backgroundColor: colors.primary }]}
                    onPress={() => setShow(false)}
                  >
                    <Text style={[TextStyles.label, { color: colors.onPrimary }]}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ActivitiesScreen() {
  const colors = useThemeColors();
  const scheme = useColorScheme();
  const { groups } = useGroups();

  const {
    allItems,
    isLoading,
    isFetching,
    hasMore,
    loadMore,
    groupId,
    setGroupId,
    setFrom,
    setTo,
  } = useActivities(30);

  const sections = React.useMemo(() => groupByDate(allItems), [allItems]);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [showFilter, setShowFilter] = React.useState(false);
  const [draftGroupId, setDraftGroupId] = React.useState<string | null>(groupId ?? null);
  const [draftPreset, setDraftPreset] = React.useState<DatePreset>('all');
  const [draftFrom, setDraftFrom] = React.useState<Date | null>(null);
  const [draftTo, setDraftTo] = React.useState<Date | null>(null);
  const [isGroupPickerOpen, setIsGroupPickerOpen] = React.useState(false);
  const groupPickerRef = React.useRef<any>(null);

  const hasActiveFilter = !!groupId || draftPreset !== 'all';

  const groupItems = React.useMemo(
    () => groups.map((g) => ({ label: g.name, value: g.id })),
    [groups],
  );

  const openFilter = () => {
    setDraftGroupId(groupId ?? null);
    setShowFilter(true);
  };

  const applyFilter = () => {
    setGroupId(draftGroupId ?? undefined);
    const range = presetToRange(draftPreset, draftFrom, draftTo);
    setFrom(range.from);
    setTo(range.to);
    setShowFilter(false);
  };

  const resetFilter = () => {
    setDraftGroupId(null);
    setDraftPreset('all');
    setDraftFrom(null);
    setDraftTo(null);
    setGroupId(undefined);
    setFrom(undefined);
    setTo(undefined);
    setShowFilter(false);
  };

  // ── Infinite scroll ─────────────────────────────────────────────────────────
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    if (distanceFromBottom < 200 && hasMore && !isFetching) {
      loadMore();
    }
  };

  // ── Group picker style (matches CustomDropdown visually) ───────────────────
  const pickerInputStyle = {
    height: Input.height,
    paddingHorizontal: Input.paddingHorizontal,
    paddingRight: 40,
    borderRadius: Radius.md,
    borderWidth: isGroupPickerOpen ? 2 : Border.thin,
    borderColor: isGroupPickerOpen ? colors.primary : colors.border.default,
    backgroundColor: colors.surface,
    color: colors.text.primary,
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
  };

  return (
    <ScreenContainer useScrollView={false}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>Activity</Text>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            {
              backgroundColor: hasActiveFilter ? colors.primaryContainer : colors.surface,
              borderColor: hasActiveFilter ? colors.primary : colors.border.default,
            },
          ]}
          onPress={openFilter}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={hasActiveFilter ? colors.primary : colors.text.secondary}
          />
          {hasActiveFilter && (
            <View style={[styles.filterDot, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {isLoading ? (
        <View style={{ gap: Spacing.md, paddingTop: Spacing.md }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox
              key={i}
              width="100%"
              height={68}
              bg={colors.surface}
              style={{ borderRadius: Radius.lg }}
            />
          ))}
        </View>
      ) : sections.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyState
            title="No activity yet"
            subtitle="Your activity across all tabs will appear here."
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : 100,
            gap: Spacing.xl,
          }}
        >
          {sections.map(({ title, data }) => (
            <View key={title} style={styles.section}>
              <Text style={[TextStyles.label, { color: colors.text.disabled }]}>
                {title.toUpperCase()}
              </Text>
              <View style={[styles.groupCard, { backgroundColor: colors.surface }]}>
                {data.map((activity, index) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isLast={index === data.length - 1}
                  />
                ))}
              </View>
            </View>
          ))}

          {isFetching && (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </ScrollView>
      )}

      {/* ── Filter bottom sheet ── */}
      <BottomModal visible={showFilter} onCancel={() => setShowFilter(false)}>
        <View style={styles.filterSheet}>
          <View style={styles.filterHeader}>
            <Text style={[TextStyles.headingSmall, { color: colors.text.primary }]}>FILTER</Text>
            <TouchableOpacity
              style={[styles.filterCloseBtn, { backgroundColor: colors.surface }]}
              onPress={() => setShowFilter(false)}
            >
              <Ionicons name="close" size={18} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* ── Group ── */}
          <View style={styles.filterSection}>
            <Text style={[TextStyles.label, { color: colors.text.disabled }]}>GROUP</Text>
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => groupPickerRef.current?.togglePicker(true)}
                style={[styles.pickerWrapper, isGroupPickerOpen && styles.pickerFocus]}
              >
                <View pointerEvents="none">
                  <RNPickerSelect
                    ref={groupPickerRef}
                    items={groupItems}
                    value={draftGroupId}
                    onValueChange={(v) => setDraftGroupId(v ?? null)}
                    placeholder={{ label: 'All Groups', value: null, color: colors.text.disabled }}
                    useNativeAndroidPickerStyle={false}
                    darkTheme={scheme === 'dark'}
                    onOpen={() => setIsGroupPickerOpen(true)}
                    onClose={() => setIsGroupPickerOpen(false)}
                    style={{
                      inputIOS: pickerInputStyle,
                      inputAndroid: pickerInputStyle,
                      placeholder: {
                        color: colors.text.disabled,
                        fontFamily: Fonts.regular,
                        fontSize: FontSize.sm,
                      },
                    }}
                  />
                </View>
                <View style={styles.pickerIcon} pointerEvents="none">
                  <Ionicons
                    name={isGroupPickerOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.text.secondary}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={[styles.pickerWrapper, isGroupPickerOpen && styles.pickerFocus]}>
                <RNPickerSelect
                  items={groupItems}
                  value={draftGroupId}
                  onValueChange={(v) => setDraftGroupId(v ?? null)}
                  placeholder={{ label: 'All Groups', value: null, color: colors.text.disabled }}
                  useNativeAndroidPickerStyle={false}
                  darkTheme={scheme === 'dark'}
                  onOpen={() => setIsGroupPickerOpen(true)}
                  onClose={() => setIsGroupPickerOpen(false)}
                  style={{
                    inputIOS: pickerInputStyle,
                    inputAndroid: pickerInputStyle,
                    placeholder: {
                      color: colors.text.disabled,
                      fontFamily: Fonts.regular,
                      fontSize: FontSize.sm,
                    },
                  }}
                />
                <View style={styles.pickerIcon} pointerEvents="none">
                  <Ionicons
                    name={isGroupPickerOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.text.secondary}
                  />
                </View>
              </View>
            )}
          </View>

          {/* ── Period ── */}
          <View style={styles.filterSection}>
            <Text style={[TextStyles.label, { color: colors.text.disabled }]}>PERIOD</Text>
            <View style={styles.presetRow}>
              {DATE_PRESETS.map((p) => (
                <TouchableOpacity
                  key={p.key}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor:
                        draftPreset === p.key ? colors.primaryContainer : colors.surface,
                      borderColor: draftPreset === p.key ? colors.primary : colors.border.subtle,
                    },
                  ]}
                  onPress={() => setDraftPreset(p.key)}
                >
                  <Text
                    style={[
                      TextStyles.label,
                      { color: draftPreset === p.key ? colors.primary : colors.text.secondary },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {draftPreset === 'custom' && (
              <View style={styles.dateRow}>
                <DateField label="FROM" value={draftFrom} onChange={setDraftFrom} />
                <DateField label="TO" value={draftTo} onChange={setDraftTo} />
              </View>
            )}
          </View>

          {/* ── Actions ── */}
          <View style={styles.filterActions}>
            <TouchableOpacity
              style={[styles.filterActionBtn, { borderColor: colors.border.default, flex: 1 }]}
              onPress={resetFilter}
            >
              <Text style={[TextStyles.label, { color: colors.text.secondary }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterActionBtn,
                { backgroundColor: colors.primary, borderColor: colors.primary, flex: 2 },
              ]}
              onPress={applyFilter}
            >
              <Text style={[TextStyles.label, { color: colors.onPrimary }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>
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
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: Border.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  section: {
    gap: Spacing.sm,
  },
  groupCard: {
    borderRadius: Radius.lg,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  // Filter sheet
  filterSheet: {
    width: '100%',
    gap: Spacing.lg,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    gap: Spacing.sm,
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
  pickerIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  presetChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: Border.thin,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateField: {
    height: Input.height,
    paddingHorizontal: Input.paddingHorizontal,
    borderWidth: Border.thin,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  datePickerCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    minWidth: 280,
    overflow: 'hidden',
    gap: Spacing.sm,
  },
  doneBtn: {
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  filterActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterActionBtn: {
    paddingVertical: Spacing.md,
    borderWidth: Border.thin,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
});
