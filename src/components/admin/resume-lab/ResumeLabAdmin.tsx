import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplateManager from './TemplateManager';
import PurchaseHistory from './PurchaseHistory';
import FreeUnlockManager from './FreeUnlockManager';

const ResumeLabAdmin = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Resume Lab Management</h2>
        <p className="text-gray-600">Manage templates, purchases, and user access</p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          <TabsTrigger value="unlocks">Free Unlocks</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <TemplateManager />
        </TabsContent>

        <TabsContent value="purchases" className="mt-6">
          <PurchaseHistory />
        </TabsContent>

        <TabsContent value="unlocks" className="mt-6">
          <FreeUnlockManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeLabAdmin;
