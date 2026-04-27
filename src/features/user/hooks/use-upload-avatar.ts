import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { UserService } from '../user.service';

const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  const { isLoading: isUploading, mutateAsync: uploadAvatar } = useMutation(
    'upload-avatar',
    (uri: string) => UserService.uploadAvatar(uri),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.ME);
        Toast.success('Avatar updated');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'Failed to upload avatar');
      },
    },
  );

  return { isUploading, uploadAvatar };
};

export default useUploadAvatar;
