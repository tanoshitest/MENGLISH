'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthContext } from '@/hooks/useAuth';
import type { User } from '@/types/database';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Mock user for demo purposes
    setUser({
      id: 'mock-user-id',
      email: 'demo@menglishtest.edu.vn',
      full_name: 'Demo Teacher',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString()
    });
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
