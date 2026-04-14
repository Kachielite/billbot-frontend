import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { registerWebhookSchema, RegisterWebhookSchemaType } from '../webhooks.dto';
import { WebhooksService } from '../webhooks.service';

const useRegisterWebhook = (groupId: string) => {
  const queryClient = useQueryClient();

  const form = useForm<RegisterWebhookSchemaType>({
    resolver: zodResolver(registerWebhookSchema),
    mode: 'onBlur',
    defaultValues: { url: '', events: [] },
  });

  const { isLoading: isRegistering, mutateAsync: registerWebhook } = useMutation(
    'register-webhook',
    async (data: RegisterWebhookSchemaType) => WebhooksService.registerWebhook(groupId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_WEBHOOKS, groupId]);
        Toast.success('Webhook registered successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isRegistering, registerWebhook };
};

export default useRegisterWebhook;
