
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Calendar, 
  Gift, 
  MessageCircle, 
  Users, 
  Settings, 
  Bell,
  LogOut,
  Loader2
} from 'lucide-react';
import { MoodTracker } from '@/components/MoodTracker';
import { SpecialDates } from '@/components/SpecialDates';
import { GiftPlanner } from '@/components/GiftPlanner';
import { LoveMessages } from '@/components/LoveMessages';
import { CoupleGames } from '@/components/CoupleGames';
import { PartnershipManager } from '@/components/PartnershipManager';
import { NotificationPanel } from '@/components/NotificationPanel';
import { SettingsPanel } from '@/components/SettingsPanel';

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('mood');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Check for invite parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    if (inviteCode) {
      setActiveTab('connect');
      // Clean up URL without refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                LoveKeeper
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="p-2 text-red-600 hover:text-red-700"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            Welcome back! 💕
          </h2>
          <p className="text-sm sm:text-lg text-gray-600">
            Keep your love story alive with LoveKeeper
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1 h-auto p-1 bg-white/70 backdrop-blur-sm">
            <TabsTrigger 
              value="mood" 
              className="flex flex-col gap-1 p-2 sm:p-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Mood</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dates" 
              className="flex flex-col gap-1 p-2 sm:p-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Dates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="gifts" 
              className="flex flex-col gap-1 p-2 sm:p-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Gifts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex flex-col gap-1 p-2 sm:p-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Messages</span>
            </TabsTrigger>
            <TabsTrigger 
              value="games" 
              className="flex flex-col gap-1 p-2 sm:p-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Games</span>
            </TabsTrigger>
            <TabsTrigger 
              value="connect" 
              className="flex flex-col gap-1 p-2 sm:p-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Connect</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="mood" className="space-y-6">
              <MoodTracker />
            </TabsContent>

            <TabsContent value="dates" className="space-y-6">
              <SpecialDates />
            </TabsContent>

            <TabsContent value="gifts" className="space-y-6">
              <GiftPlanner />
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <LoveMessages />
            </TabsContent>

            <TabsContent value="games" className="space-y-6">
              <CoupleGames />
            </TabsContent>

            <TabsContent value="connect" className="space-y-6">
              <PartnershipManager />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Notifications Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}
