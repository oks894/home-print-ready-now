import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Gift, UserPlus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  price: number;
  category: string;
}

const FreeUnlockManager = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('id, name, price, category')
        .eq('status', 'active')
        .order('display_order');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const handleFreeUnlock = async () => {
    if (!userEmail || !selectedTemplateId) {
      toast.error('Please enter email and select a template');
      return;
    }

    // Validate email
    if (!userEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Check if already purchased
      const { data: existingPurchase } = await supabase
        .from('resume_purchases')
        .select('id')
        .eq('user_email', userEmail)
        .eq('template_id', selectedTemplateId)
        .maybeSingle();

      if (existingPurchase) {
        toast.error('User already has access to this template');
        setLoading(false);
        return;
      }

      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

      // Insert free unlock
      const { error } = await supabase
        .from('resume_purchases')
        .insert({
          user_email: userEmail,
          template_id: selectedTemplateId,
          amount_paid: 0,
          payment_reference: `FREE-UNLOCK-${Date.now()}`
        });

      if (error) throw error;

      toast.success(
        `Successfully unlocked "${selectedTemplate?.name}" for ${userEmail}`,
        { duration: 5000 }
      );

      // Reset form
      setUserEmail('');
      setSelectedTemplateId('');
    } catch (error: any) {
      console.error('Error giving free unlock:', error);
      if (error.code === '23505') {
        toast.error('User already has access to this template');
      } else {
        toast.error('Failed to give free unlock');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Free Template Unlock</h3>
            <p className="text-sm text-gray-600 mb-4">
              Grant users free access to premium templates. This is useful for promotional offers,
              refunds, or supporting students in need.
            </p>
            
            <div className="space-y-4 max-w-xl">
              <div>
                <Label>User Email *</Label>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The user will receive lifetime access to the selected template
                </p>
              </div>

              <div>
                <Label>Select Template *</Label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center justify-between gap-4">
                          <span>{template.name}</span>
                          <Badge variant="outline" className="ml-2">
                            ₹{template.price}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleFreeUnlock}
                disabled={loading || !userEmail || !selectedTemplateId}
                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Grant Free Access
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Lifetime Access</h4>
              <p className="text-sm text-gray-600">
                Users get permanent access to edit and export the template
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">No Payment Required</h4>
              <p className="text-sm text-gray-600">
                Template is unlocked immediately without any payment
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Tracked in System</h4>
              <p className="text-sm text-gray-600">
                All free unlocks are logged in purchase history
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Use Cases */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">Common Use Cases</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Badge className="mt-0.5">1</Badge>
            <div>
              <p className="font-semibold">Promotional Campaigns</p>
              <p className="text-gray-600">Give free templates to users who sign up during promotions</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="mt-0.5">2</Badge>
            <div>
              <p className="font-semibold">Student Support</p>
              <p className="text-gray-600">Help students in need by providing free access</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="mt-0.5">3</Badge>
            <div>
              <p className="font-semibold">Refunds/Compensation</p>
              <p className="text-gray-600">Provide compensation for payment issues or complaints</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="mt-0.5">4</Badge>
            <div>
              <p className="font-semibold">Partnership Rewards</p>
              <p className="text-gray-600">Reward partners or collaborators with template access</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FreeUnlockManager;
