import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import useParseReceipt from '@/features/expenses/hooks/use-parse-receipt';
import { Card, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Asset, launchImageLibrary } from 'react-native-image-picker';
import { TextStyles } from '@/core/common/constants/fonts';
import { Toast } from 'toastify-react-native';
import { UseFormReturn } from 'react-hook-form';
import { LogExpenseSchemaType } from '@/features/expenses/expenses.dto';

type Props = {
  form: UseFormReturn<LogExpenseSchemaType>;
  poolId: string;
};

export default function ExpenseParseReceipt({ form, poolId }: Props) {
  const { parseReceipt, isParsing } = useParseReceipt(poolId);
  const colors = useThemeColors();
  const [picked, setPicked] = React.useState<Asset | null>(null);

  async function openPicker() {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
      if (res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        setPicked(asset);
        form.setValue('receipt', asset, { shouldDirty: true });
        await parseReceipt(asset);
      }
    } catch (e) {
      console.error('Error picking image:', e);
      Toast.error(`Failed to pick image: ${e instanceof Error ? e.message : 'e.toString()'}`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[TextStyles.label, { color: colors.text.primary }]}>RECEIPT IMAGE</Text>
      <View
        style={[
          Card as ViewStyle,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
        <TouchableOpacity
          onPress={isParsing ? undefined : openPicker}
          activeOpacity={0.8}
          style={[styles.pickerContainer]}
          disabled={isParsing}
        >
          {isParsing ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : picked?.uri ? (
            <Image source={{ uri: picked.uri }} style={styles.preview} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={28} color={colors.text.disabled} />
              <Text style={[TextStyles.label, { color: colors.text.disabled }]}>
                Tap to pick image
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  pickerContainer: {
    height: 160,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  placeholderText: {
    marginTop: 8,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
});
