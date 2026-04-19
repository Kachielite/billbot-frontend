import { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from 'react-query';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';
import { EMAIL_REGEX, InviteEntry } from '../invites.interface';
import { InvitesService } from '../invites.service';

const useInviteMembers = () => {
  const navigation = useNavigation() as any;
  const route = useRoute<any>();
  const groupId: string = (route.params as { groupId?: string })?.groupId ?? '';

  // ── Add-new input ──────────────────────────────────────────────────────────
  const addInputRef = useRef<TextInput>(null);
  const [addValue, setAddValue] = useState('');

  // ── Inline edit state ──────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const [entries, setEntries] = useState<InviteEntry[]>([]);

  const { isLoading: isSending, mutateAsync: sendInvites } = useMutation(
    'send-invites',
    (emails: string[]) =>
      Promise.all(emails.map((email) => InvitesService.createInvite(groupId, { email }))),
    {
      onSuccess: () => {
        Toast.success('Invites sent!');
        navigation.navigate('Tabs');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'Failed to send invites');
      },
    },
  );

  const addEmail = () => {
    const trimmed = addValue.trim().toLowerCase();
    if (!trimmed) return;

    if (!EMAIL_REGEX.test(trimmed)) {
      Toast.error('Enter a valid email address');
      return;
    }
    if (entries.some((e) => e.email === trimmed)) {
      Toast.error('Email already added');
      return;
    }

    setEntries((prev) => [...prev, { id: Date.now().toString(), email: trimmed }]);
    setAddValue('');
    addInputRef.current?.focus();
  };

  const startEdit = (entry: InviteEntry) => {
    setEditingId(entry.id);
    setEditingValue(entry.email);
  };

  const saveEdit = () => {
    const trimmed = editingValue.trim().toLowerCase();
    if (!trimmed) return;

    if (!EMAIL_REGEX.test(trimmed)) {
      Toast.error('Enter a valid email address');
      return;
    }
    if (entries.some((e) => e.email === trimmed && e.id !== editingId)) {
      Toast.error('Email already added');
      return;
    }

    setEntries((prev) => prev.map((e) => (e.id === editingId ? { ...e, email: trimmed } : e)));
    setEditingId(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) cancelEdit();
  };

  const handleInvite = async () => {
    if (entries.length === 0) {
      Toast.error('Add at least one email to invite');
      return;
    }
    await sendInvites(entries.map((e) => e.email));
  };

  const handleDone = () => {
    navigation.navigate('Tabs');
  };

  return {
    addInputRef,
    addValue,
    setAddValue,
    addEmail,
    editingId,
    editingValue,
    setEditingValue,
    entries,
    isSending,
    startEdit,
    saveEdit,
    cancelEdit,
    removeEntry,
    handleInvite,
    handleDone,
  };
};

export default useInviteMembers;
