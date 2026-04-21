import { StyleSheet, Text } from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import NewPoolHeader from '@/features/pools/components/new-pool.header';
import PoolInfo from '@/features/pools/components/pool-info';

export default function NewPoolScreen() {
  return (
    <ScreenContainer>
      <NewPoolHeader />
      <PoolInfo />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({});
