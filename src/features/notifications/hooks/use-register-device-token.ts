import { useMutation } from 'react-query';
import { Platform } from 'react-native';
import { NotificationsService } from '../notifications.service';

const useRegisterDeviceToken = () => {
  const { mutateAsync: registerDeviceToken, isLoading: isRegistering } = useMutation(
    'register-device-token',
    async (playerId: string) => {
      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      return NotificationsService.registerDeviceToken(playerId, platform);
    },
  );

  return { registerDeviceToken, isRegistering };
};

export default useRegisterDeviceToken;
