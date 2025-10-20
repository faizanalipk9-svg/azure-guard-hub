import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'analyst' | 'viewer';

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(r => r.role as UserRole) || [];
    },
    enabled: !!user?.id,
  });

  const hasRole = (role: UserRole) => {
    return roles?.includes(role) || false;
  };

  const isAdmin = hasRole('admin');
  const isAnalyst = hasRole('analyst');
  const isViewer = hasRole('viewer');

  return {
    roles: roles || [],
    hasRole,
    isAdmin,
    isAnalyst,
    isViewer,
    isLoading,
  };
};
