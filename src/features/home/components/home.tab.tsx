import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Input, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import InfoBox from '@/core/common/components/info-box';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '@/core/common/components/form/custom-button';
import { Group } from '@/features/groups/groups.interface';
import useGroups from '@/features/groups/hooks/use-groups';

export default function HomeTab({ onCancel }: { onCancel: () => void }) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { groups, isLoading } = useGroups();
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<{ label: string; value: string }[]>([]);

  React.useEffect(() => {
    setItems(groups.map((group) => ({ label: group.name, value: group.id })));
  }, [groups]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer]}>
        <View style={styles.headerRight}>
          <View>
            <Text
              style={[
                TextStyles.bodySmall,
                { color: colors.text.primary, textTransform: 'uppercase' },
              ]}
            >
              NEW TAB
            </Text>
            <Text style={[TextStyles.headingLarge, { color: colors.text.secondary }]}>
              Select Group
            </Text>
          </View>
        </View>
        <View style={styles.backBtnContainer}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surface }]}
            onPress={onCancel}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <InfoBox
        title="A tab collects related expenses."
        description="To create a new tab, first select the group it belongs to. You can change this later if needed."
      />

      <View style={styles.optionContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Groups</Text>
        </View>

        <DropDownPicker
          open={open}
          value={selectedGroup?.id ?? null}
          items={items}
          setOpen={setOpen}
          setItems={setItems}
          setValue={(valueOrFn: any) => {
            const nextValue =
              typeof valueOrFn === 'function' ? valueOrFn(selectedGroup?.id ?? null) : valueOrFn;
            const group = groups.find((g) => g.id === nextValue) || null;
            setSelectedGroup(group);
          }}
          placeholder="Select group"
          disabled={isLoading}
          dropDownDirection="AUTO"
          style={[
            styles.dropdown,
            { borderColor: colors.border.default, backgroundColor: colors.surface },
            isLoading && { opacity: 0.6 },
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
        label="Continue"
        onPress={() => {
          if (selectedGroup) {
            onCancel();
            navigation.navigate('Group', { groupId: selectedGroup.id, fromQuickActions: true });
          }
        }}
        disabled={!selectedGroup || isLoading}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    justifyContent: 'flex-start',
    gap: Spacing.md,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  backBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  optionContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
    flexGrow: 1,
    width: '100%',
    marginVertical: Spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
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
  inputSearchStyle: {
    ...TextStyles.bodySmall,
    height: 40,
  },
  itemContainer: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  optionText: {
    ...TextStyles.bodySmall,
  },
  error: {
    ...TextStyles.label,
  },
  itemText: {
    ...TextStyles.bodySmall,
  },
});
