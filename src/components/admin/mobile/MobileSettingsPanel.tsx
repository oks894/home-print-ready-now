import React from 'react';
import { motion } from 'framer-motion';
import { Settings, LogOut, Bell, Moon, Sun, Info, Shield } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MobileSettingsPanelProps {
  onLogout: () => void;
}

export const MobileSettingsPanel = ({ onLogout }: MobileSettingsPanelProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-50 to-slate-100 p-4 border-b">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-gray-700" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-600">Manage your preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border p-4 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Account
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-xs text-gray-500">Administrator role</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>

          <Separator />

          <TouchButton
            variant="destructive"
            className="w-full"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </TouchButton>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border p-4 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Notifications
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-xs text-gray-500">Get notified about new orders</p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border p-4 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            {darkMode ? (
              <Moon className="w-5 h-5 text-indigo-600" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-600" />
            )}
            Appearance
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-xs text-gray-500">Toggle dark theme</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border p-4 space-y-3"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-600" />
            About
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>App Name</span>
              <span className="font-medium">ellio Admin</span>
            </div>
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span className="font-medium">2025.1</span>
            </div>
          </div>

          <Separator />

          <div className="text-center text-xs text-gray-500">
            <p>© 2025 ellio. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
