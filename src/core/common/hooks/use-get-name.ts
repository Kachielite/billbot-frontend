import useUserStore from '@/features/user/user.state';

const useGetName = () => {
  const { user } = useUserStore();

  return ({ name, id }: { name: string; id: string }) => {
    let formatedName = name.split(' ')[0];
    if (!user) {
      return formatedName;
    }
    if (user?.id === id) {
      formatedName = `${formatedName} (You)`;
    }
    return formatedName;
  };
};

export default useGetName;
