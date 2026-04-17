import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function NewExpenseScreen() {
  return (
    <View style={{ padding: 15, backgroundColor: 'white', height: '100%' }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Profile Screen</Text>
      <Text style={{ marginTop: 10 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan euismod enim, quis
        porta ligula egestas sed. Maecenas vitae consequat odio, at dignissim lorem. Ut euismod eros
        ac mi ultricies, vel pharetra tortor commodo. Interdum et malesuada fames ac ante ipsum
        primis in faucibus. Nullam at urna in metus iaculis aliquam at sed quam. In ullamcorper, ex
        ut facilisis commodo, urna diam posuere urna, at condimentum mi orci ac ipsum. In hac
        habitasse platea dictumst. Donec congue pharetra ipsum in finibus. Nulla blandit finibus
        turpis, non vulputate elit viverra a. Curabitur in laoreet nisl.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeText: {
    fontWeight: '600',
  },
});
