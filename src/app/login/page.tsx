'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/RoleBadge';
import { useStore } from '@/lib/store';
import { User } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { users, currentUser, setCurrentUser, loadData } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      await loadData();
      setIsLoading(false);
    };
    initializeData();
  }, [loadData]);

  useEffect(() => {
    if (currentUser) {
      router.push('/app');
    }
  }, [currentUser, router]);

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            כניסה למערכת
          </CardTitle>
          <p className="text-muted-foreground">
            בחר משתמש להמשך
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.filter((user) => user.role === 'instructor').map((user) => (
            <Button
              key={user.id}
              variant="outline"
              className="w-full justify-between p-4 h-auto"
              onClick={() => handleUserSelect(user)}
            >
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">{user.name}</div>
                 
                </div>
              </div>
              <RoleBadge role={user.role} />
            </Button>
          ))}
        
        </CardContent>
      </Card>
    </div>
  );
}
