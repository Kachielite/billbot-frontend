import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomTextAreaInput from '@/core/common/components/form/custom-text-area-input';
import useCreateGroup from '@/features/groups/hooks/use-create-group';

const PRESET_COLORS = [
  '#FF5733',
  '#FF8C00',
  '#FFD700',
  '#32CD32',
  '#00CED1',
  '#1E90FF',
  '#9370DB',
  '#FF69B4',
  '#A0522D',
  '#708090',
];

export default function NewGroupScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { form, isCreating, createGroup } = useCreateGroup();

  const onSubmit = form.handleSubmit(async (data) => {
    await createGroup({
      ...data,
      emoji: data.emoji || undefined,
      color: data.color || undefined,
    });
    navigation.goBack();
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>New Group</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.closeButton, { backgroundColor: colors.primaryContainer }]}
        >
          <Text style={[styles.closeText, { color: colors.text.primary }]}>Cancel</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <CustomTextInput
          id="name"
          formController={form}
          label="Group Name"
          placeholder="e.g. Trip to Lagos"
          required
        />

        <CustomTextAreaInput
          id="description"
          formController={form}
          label="Description"
          placeholder="What is this group for?"
          numberOfLines={3}
          maxLength={500}
        />

        <Controller
          control={form.control}
          name="emoji"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldContainer}>
              <Text style={[TextStyles.label, { color: colors.text.primary }]}>
                Emoji (optional)
              </Text>
              <TextInput
                style={[
                  styles.emojiInput,
                  { color: colors.text.primary, borderColor: colors.border.default },
                ]}
                placeholder="e.g. ✈️"
                placeholderTextColor={colors.text.inverse}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                maxLength={10}
              />
            </View>
          )}
        />

        <Controller
          control={form.control}
          name="color"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldContainer}>
              <Text style={[TextStyles.label, { color: colors.text.primary }]}>
                Color (optional)
              </Text>
              <View style={styles.colorGrid}>
                {PRESET_COLORS.map((hex) => (
                  <TouchableOpacity
                    key={hex}
                    onPress={() => onChange(value === hex ? '' : hex)}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: hex },
                      value === hex && styles.colorSwatchSelected,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        onPress={onSubmit}
        disabled={isCreating}
        style={[
          styles.submitButton,
          { backgroundColor: colors.primary, opacity: isCreating ? 0.6 : 1 },
        ]}
      >
        <Text style={[styles.submitText, { color: colors.onPrimary }]}>
          {isCreating ? 'Creating…' : 'Create Group'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  closeText: {
    fontWeight: '600',
  },
  form: {
    gap: Spacing.lg,
  },
  fieldContainer: {
    gap: Spacing.sm,
  },
  emojiInput: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: Border.thin,
    borderRadius: Radius.md,
    fontSize: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    transform: [{ scale: 1.15 }],
  },
  submitButton: {
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
