import { router } from 'expo-router';
import { useCallback } from 'react';

import { RoleSelectionScreen } from '@/components/owner/RoleSelectionScreen';
import { useUserRole } from '@/context/user-role';
import type { UserRole } from '@/lib/owner-types';

export default function ChooseRoleRoute() {
  const { setRole } = useUserRole();

  const onSelect = useCallback(
    async (role: UserRole) => {
      await setRole(role);
      router.replace({ pathname: '/login', params: { role } });
    },
    [setRole]
  );

  return <RoleSelectionScreen onSelect={onSelect} />;
}
