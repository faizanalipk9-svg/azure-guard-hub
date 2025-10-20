import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Shield, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UserManagement = () => {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, roleLoading, navigate]);

  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: roles } = await supabase
        .from('user_roles')
        .select('*');

      return profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.user_id).map(r => r.role) || []
      })) || [];
    },
    enabled: isAdmin,
  });

  if (roleLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">
                  {users?.filter(u => u.roles.includes('admin')).length || 0}
                </p>
              </div>
              <Shield className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analysts</p>
                <p className="text-2xl font-bold">
                  {users?.filter(u => u.roles.includes('analyst')).length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Viewers</p>
                <p className="text-2xl font-bold">
                  {users?.filter(u => u.roles.includes('viewer')).length || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.full_name || 'Unknown User'}</h3>
                        {user.roles.map(role => (
                          <Badge
                            key={role}
                            variant={
                              role === 'admin' ? 'destructive' :
                              role === 'analyst' ? 'default' : 'outline'
                            }
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Department: {user.department || 'Not set'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit Roles</Button>
                      <Button variant="outline" size="sm">View Activity</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
