import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';
import moment from 'moment';
import { GroupMember } from '@/features/groups/groups.interface';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Card, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import getInitials from '@/core/common/utils/get-initials';

const AVATAR_SIZE = 45;

function formatJoinedDate(dateInput: string | Date): string {
  const m = moment(dateInput);
  return m.isValid() ? m.format('DD MMM, YYYY') : '';
}

const MemberCard = ({ member, index }: { member: GroupMember; index: number }) => {
  const colors = useThemeColors();
  const swatch = colors.groupColors[index % colors.groupColors.length];
  return (
    <View style={[styles.memberContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.memberInfo}>
        {member.avatarUrl ? (
          <Image
            source={{ uri: member.avatarUrl }}
            style={[styles.avatar, { borderColor: colors.surface }]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: swatch.fill,
                borderColor: colors.surface,
              },
            ]}
          >
            <Text style={[styles.initials, { color: swatch.on }]}>{getInitials(member.name)}</Text>
          </View>
        )}
        <View>
          <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>{member.name}</Text>
          <Text
            style={[
              TextStyles.caption,
              {
                color: colors.text.primary,
                textTransform: 'uppercase',
              },
            ]}
          >
            {member.role}
          </Text>
        </View>
      </View>

      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <Text style={[TextStyles.caption, { color: colors.text.primary }]}>Joined on</Text>
        <Text style={[{ color: colors.text.primary, fontSize: 12, fontWeight: '500' }]}>
          {formatJoinedDate(member.joinedAt)}
        </Text>
      </View>
    </View>
  );
};

export default function GroupMembers({ members }: { members: GroupMember[] }) {
  const colors = useThemeColors();
  const [seeAll, setSeeAll] = React.useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Members</Text>
        {members.length > 4 ? (
          <TouchableOpacity onPress={() => setSeeAll((s) => !s)}>
            <Text style={[{ color: colors.onPrimaryContainer }]}>
              {seeAll ? 'Show less' : `See All (${members.length})`}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View
        style={[
          Card as ViewStyle,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
        {(seeAll ? members : members.slice(0, 4)).map((member, index) => (
          <MemberCard key={member.userId} member={member} index={index} />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
    width: '100%',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  memberContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  memberInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
});
