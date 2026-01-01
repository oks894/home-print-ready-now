import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Monitor, 
  Apple, 
  Share, 
  Plus, 
  Menu, 
  Download,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

type DeviceType = 'ios' | 'android' | 'desktop' | 'unknown';

const InstallApp = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('unknown');
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const IOSInstructions = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-accent rounded-xl">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-primary">1</span>
        </div>
        <div className="flex-1">
          <p className="font-medium">Tap the Share button</p>
          <div className="flex items-center gap-2 mt-1">
            <Share className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">In Safari's toolbar</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-accent rounded-xl">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-primary">2</span>
        </div>
        <div className="flex-1">
          <p className="font-medium">Scroll and tap "Add to Home Screen"</p>
          <div className="flex items-center gap-2 mt-1">
            <Plus className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-muted-foreground">Near the bottom of the menu</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-accent rounded-xl">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-primary">3</span>
        </div>
        <div className="flex-1">
          <p className="font-medium">Tap "Add" to confirm</p>
          <span className="text-sm text-muted-foreground">Ellio will appear on your home screen</span>
        </div>
      </div>
    </div>
  );

  const AndroidInstructions = () => (
    <div className="space-y-4">
      {deferredPrompt ? (
        <Button 
          onClick={handleInstallClick}
          className="w-full h-14 text-lg bg-gradient-to-r from-ellio-green to-ellio-teal"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Install Ellio App
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 bg-accent rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Tap the menu button</p>
              <div className="flex items-center gap-2 mt-1">
                <Menu className="w-5 h-5" />
                <span className="text-sm text-muted-foreground">Three dots in Chrome</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-accent rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Tap "Add to Home Screen"</p>
              <span className="text-sm text-muted-foreground">Or "Install App"</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-accent rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">3</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Tap "Install"</p>
              <span className="text-sm text-muted-foreground">Ellio will be added to your apps</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const DesktopInstructions = () => (
    <div className="space-y-4">
      {deferredPrompt ? (
        <Button 
          onClick={handleInstallClick}
          className="w-full h-14 text-lg bg-gradient-to-r from-ellio-blue to-ellio-purple"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Install Ellio Desktop App
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 bg-accent rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Look for the install icon</p>
              <span className="text-sm text-muted-foreground">In the address bar (Chrome/Edge)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-accent rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Click "Install"</p>
              <span className="text-sm text-muted-foreground">Ellio will open as a desktop app</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-ellio-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-ellio-green" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Already Installed!</h2>
                <p className="text-muted-foreground">
                  Ellio is already installed on your device. Open it from your home screen.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-ellio-blue to-ellio-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Install Ellio</h1>
            <p className="text-muted-foreground">
              Get the full app experience on your device
            </p>
          </div>

          {/* Device Detection */}
          <div className="flex justify-center gap-2 mb-6">
            <Badge 
              variant={deviceType === 'ios' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setDeviceType('ios')}
            >
              <Apple className="w-3 h-3 mr-1" />
              iOS
            </Badge>
            <Badge 
              variant={deviceType === 'android' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setDeviceType('android')}
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Android
            </Badge>
            <Badge 
              variant={deviceType === 'desktop' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setDeviceType('desktop')}
            >
              <Monitor className="w-3 h-3 mr-1" />
              Desktop
            </Badge>
          </div>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {deviceType === 'ios' && 'Install on iPhone/iPad'}
                {deviceType === 'android' && 'Install on Android'}
                {deviceType === 'desktop' && 'Install on Desktop'}
              </CardTitle>
              <CardDescription>
                Follow these steps to install Ellio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deviceType === 'ios' && <IOSInstructions />}
              {deviceType === 'android' && <AndroidInstructions />}
              {deviceType === 'desktop' && <DesktopInstructions />}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Why Install?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ellio-green" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ellio-green" />
                <span>Faster loading</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ellio-green" />
                <span>Full screen experience</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ellio-green" />
                <span>Quick access from home screen</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default InstallApp;
