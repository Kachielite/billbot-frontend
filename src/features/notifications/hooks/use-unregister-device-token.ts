import { useMutation } from 'react-query';
import { NotificationsService } from '../notifications.service';

const useUnregisterDeviceToken = () => {
  const { mutateAsync: unregisterDeviceToken, isLoading: isUnregistering } = useMutation(
    'unregister-device-token',
    async (playerId: string) => {
      return NotificationsService.unregisterDeviceToken(playerId);
    },
  );

  return { unregisterDeviceToken, isUnregistering };
};

export default useUnregisterDeviceToken;
