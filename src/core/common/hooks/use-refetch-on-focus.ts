import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

const useRefetchOnFocus = (refetches: (() => void)[]) => {
  const refetchesRef = useRef(refetches);
  refetchesRef.current = refetches;

  useFocusEffect(
    useCallback(() => {
      refetchesRef.current.forEach((fn) => fn());
    }, []),
  );
};

export default useRefetchOnFocus;
