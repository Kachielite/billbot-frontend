import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function NewGroupScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ padding: 15 }}>
      <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
        Go back
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({});
