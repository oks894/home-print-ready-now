import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Shield, Plus, Trash2, Loader2, Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

const AdminRolesManager = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<{ id: string; email: string; full_name: string | null } | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      // Fetch user details for each admin
      const adminsWithDetails = await Promise.all(
        (rolesData || []).map(async (role) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('email, full_name')
            .eq('id', role.user_id)
            .single();
          
          return {
            ...role,
            user_email: profile?.email,
            user_name: profile?.full_name
          };
        })
      );

      setAdmins(adminsWithDetails);
    } catch (err) {
      console.error('Error fetching admins:', err);
      toast.error('Failed to load admin users');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email');
      return;
    }

    setSearching(true);
    setFoundUser(null);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, full_name')
        .eq('email', searchEmail.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('User not found. Make sure they have signed up first.');
        } else {
          throw error;
        }
        return;
      }

      // Check if already admin
      const existing = admins.find(a => a.user_id === data.id);
      if (existing) {
        toast.error('This user is already an admin');
        return;
      }

      setFoundUser(data);
    } catch (err) {
      console.error('Error searching user:', err);
      toast.error('Failed to search user');
    } finally {
      setSearching(false);
    }
  };

  const grantAdminAccess = async () => {
    if (!foundUser) return;

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: foundUser.id, role: 'admin' });

      if (error) throw error;

      toast.success(`Admin access granted to ${foundUser.email}`);
      setFoundUser(null);
      setSearchEmail('');
      fetchAdmins();
    } catch (err) {
      console.error('Error granting admin:', err);
      toast.error('Failed to grant admin access');
    } finally {
      setIsAdding(false);
    }
  };

  const revokeAdminAccess = async (admin: AdminUser) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', admin.id);

      if (error) throw error;

      toast.success(`Admin access revoked for ${admin.user_email}`);
      fetchAdmins();
    } catch (err) {
      console.error('Error revoking admin:', err);
      toast.error('Failed to revoke admin access');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Card */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-700 dark:text-yellow-400">Security Notice</p>
            <p className="text-sm text-muted-foreground">
              Admin users have full access to all data and settings. Only grant access to trusted individuals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-ellio-purple/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-ellio-purple" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Admins</p>
              <p className="text-3xl font-bold">{admins.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage who has admin access to the platform</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Grant Admin Access</DialogTitle>
                  <DialogDescription>
                    Search for a user by their email address to grant them admin access.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>User Email</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        placeholder="user@example.com"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                      />
                      <Button onClick={searchUser} disabled={searching}>
                        {searching ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {foundUser && (
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                      <CardContent className="p-4">
                        <p className="font-medium text-green-700 dark:text-green-400">User Found</p>
                        <p className="text-sm">{foundUser.full_name || 'No name'}</p>
                        <p className="text-sm text-muted-foreground">{foundUser.email}</p>
                        <Button 
                          className="mt-3 w-full bg-green-600 hover:bg-green-700"
                          onClick={grantAdminAccess}
                          disabled={isAdding}
                        >
                          {isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Shield className="w-4 h-4 mr-2" />
                          )}
                          Grant Admin Access
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No admin users configured yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{admin.user_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{admin.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-ellio-purple">Admin</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(admin.created_at || '').toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => revokeAdminAccess(admin)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesManager;
