import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const REFERRAL_CODE_KEY = 'ellio_referral_code';

const processReferralBonus = async (newUserId: string): Promise<void> => {
  const referralCode = localStorage.getItem(REFERRAL_CODE_KEY);
  if (!referralCode) return;

  try {
    // Get referral bonus from settings
    const { data: settings } = await supabase
      .from('coin_settings')
      .select('referral_bonus')
      .single();

    const referralBonus = settings?.referral_bonus || 10;

    // Find referrer by code
    const { data: referrer, error: referrerError } = await supabase
      .from('user_profiles')
      .select('id, coin_balance, total_coins_earned')
      .eq('referral_code', referralCode)
      .neq('id', newUserId)
      .single();

    if (referrerError || !referrer) {
      console.log('Referral code not found or invalid');
      localStorage.removeItem(REFERRAL_CODE_KEY);
      return;
    }

    // Update new user's referred_by field
    await supabase
      .from('user_profiles')
      .update({ referred_by: referrer.id })
      .eq('id', newUserId);

    // Credit referrer with bonus coins
    const newBalance = (referrer.coin_balance || 0) + referralBonus;
    const newTotalEarned = (referrer.total_coins_earned || 0) + referralBonus;

    await supabase
      .from('user_profiles')
      .update({
        coin_balance: newBalance,
        total_coins_earned: newTotalEarned
      })
      .eq('id', referrer.id);

    // Log transaction for referrer
    await supabase.from('coin_transactions').insert({
      user_id: referrer.id,
      amount: referralBonus,
      transaction_type: 'referral_bonus',
      description: `Referral bonus - new user joined`,
      balance_after: newBalance
    });

    console.log('Referral bonus credited successfully');
  } catch (error) {
    console.error('Error processing referral:', error);
  } finally {
    localStorage.removeItem(REFERRAL_CODE_KEY);
  }
};

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  coin_balance: number;
  total_coins_earned: number;
  total_coins_spent: number;
  referral_code: string | null;
  is_suspended: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const referralProcessedRef = useRef<Set<string>>(new Set());

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as UserProfile;
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            
            // Process referral for new users (SIGNED_IN event after signup)
            if (event === 'SIGNED_IN' && profileData && !referralProcessedRef.current.has(session.user.id)) {
              referralProcessedRef.current.add(session.user.id);
              await processReferralBonus(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      signInWithGoogle,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
