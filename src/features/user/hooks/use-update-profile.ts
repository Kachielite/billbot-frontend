import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { updateProfileSchema, UpdateProfileSchemaType } from '../user.dto';
import { UserService } from '../user.service';

const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onBlur',
  });

  const { isLoading: isUpdating, mutateAsync: updateProfile } = useMutation(
    'update-profile',
    async (data: UpdateProfileSchemaType) => UserService.updateProfile(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.ME);
        Toast.success('Profile updated successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isUpdating, updateProfile };
};

export default useUpdateProfile;
