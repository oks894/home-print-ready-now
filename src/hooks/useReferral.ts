import { supabase } from '@/integrations/supabase/client';

const REFERRAL_CODE_KEY = 'ellio_referral_code';

export const useReferral = () => {
  const saveReferralCode = (code: string) => {
    if (code && code.trim()) {
      localStorage.setItem(REFERRAL_CODE_KEY, code.trim().toUpperCase());
    }
  };

  const getReferralCode = (): string | null => {
    return localStorage.getItem(REFERRAL_CODE_KEY);
  };

  const clearReferralCode = () => {
    localStorage.removeItem(REFERRAL_CODE_KEY);
  };

  const processReferral = async (newUserId: string): Promise<boolean> => {
    const referralCode = getReferralCode();
    if (!referralCode) return false;

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
        .neq('id', newUserId) // Can't refer yourself
        .single();

      if (referrerError || !referrer) {
        console.log('Referral code not found or invalid');
        clearReferralCode();
        return false;
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

      clearReferralCode();
      return true;
    } catch (error) {
      console.error('Error processing referral:', error);
      clearReferralCode();
      return false;
    }
  };

  return {
    saveReferralCode,
    getReferralCode,
    clearReferralCode,
    processReferral
  };
};
