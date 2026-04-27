import {Image, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {Radius, Shadow, Spacing} from '@/core/common/constants/theme';

interface Props {
  uri: string;
  visible: boolean;
  onClose: () => void;
}

export default function ReceiptViewer({ uri, visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: Spacing.xxxl,
    right: Spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
});
