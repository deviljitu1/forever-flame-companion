import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MoodTracker } from '@/components/MoodTracker';
import { GiftPlanner } from '@/components/GiftPlanner';
import { SpecialDates } from '@/components/SpecialDates';
import { LoveMessages } from '@/components/LoveMessages';
import { CoupleGames } from '@/components/CoupleGames';
import { NotificationPanel } from '@/components/NotificationPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { PartnershipManager } from '@/components/PartnershipManager';
import { AIChatAssistant } from '@/components/AIChatAssistant';
import { DailyChallenges } from '@/components/DailyChallenges';
import { WeekendPlanner } from '@/components/WeekendPlanner';
import { CountdownEvents } from '@/components/CountdownEvents';
import { MonthlyGoals } from '@/components/MonthlyGoals';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Users, Bell, Settings, Calendar, Gift, MessageCircle, Star, Home, Smile, Gamepad2, LogOut, Bot } from 'lucide-react';

// Placeholder for missing components
const MissingComponent = ({ name }: { name: string }) => (
  <Card>
    <CardContent className="p-6 text-center">
      <p className="text-muted-foreground">{name} component will be here</p>
    </CardContent>
  </Card>
);

// Use actual components or placeholders
const ActualNotificationPanel = NotificationPanel || (({ children }: any) => <>{children}</>);
const ActualSettingsPanel = SettingsPanel || (({ children }: any) => <>{children}</>);

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState('offline');
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Check for invite code in URL and switch to connect tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    if (inviteCode) {
      setActiveTab('connect');
    }
  }, []);

  // Simulate partner connection status
  useEffect(() => {
    const statuses = ['online', 'offline', 'away'];
    const interval = setInterval(() => {
      setPartnerStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Redirect to auth if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 animate-pulse text-pink-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your love journey...</p>
        </div>
      </div>
    );
  }

  const handleConnectPartner = () => {
    setIsConnected(true);
    setPartnerStatus('online');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                LoveKeeper
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                isConnected 
                  ? partnerStatus === 'online' 
                    ? 'bg-green-100 text-green-700' 
                    : partnerStatus === 'away' 
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected 
                    ? partnerStatus === 'online' 
                      ? 'bg-green-500' 
                      : partnerStatus === 'away' 
                        ? 'bg-amber-500'
                        : 'bg-gray-500'
                    : 'bg-gray-500'
                }`} />
                {isConnected ? `Partner: ${partnerStatus}` : 'Not connected'}
              </div>
              
              <ActualNotificationPanel>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </ActualNotificationPanel>
              
              <ActualSettingsPanel>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </ActualSettingsPanel>

              <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <ActualNotificationPanel>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </ActualNotificationPanel>
              
              <ActualSettingsPanel>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </ActualSettingsPanel>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-7 md:grid-cols-9 mb-4 bg-muted/50">
            <TabsTrigger value="dashboard" className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Home className="h-3 w-3 md:mr-1" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="connect" className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Users className="h-3 w-3 md:mr-1" />
              <span className="hidden md:inline">Connect</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Smile className="h-3 w-3 md:mr-1" />
              <span className="hidden md:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="ai-chat" className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Bot className="h-3 w-3 md:mr-1" />
              <span className="hidden md:inline">AI Coach</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Gift className="h-3 w-3 md:mr-1" />
              <span className="hidden md:inline">Gifts</span>
            </TabsTrigger>
            <TabsTrigger value="dates" className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Calendar className="h-3 w-3 md:mr-1" />
              <span className="hidden md:inline">Dates</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <MessageCircle className="h-3 w-3 md:mr-1" />
              <span className="hidden md:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="text-xs md:text-sm hidden md:flex data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Gamepad2 className="h-3 w-3 md:mr-1" />
              <span className="hidden md:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger value="more" className="text-xs md:text-sm md:hidden data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <span>More</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden border-0 bg-gradient-to-r from-pink-500 to-red-500 text-white">
              <CardContent className="p-0">
                <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-r from-pink-500/90 to-red-500/90">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">
                      Keep Your Love Growing Every Day
                    </h2>
                    <p className="text-white/90 mb-4 text-sm sm:text-base max-w-md drop-shadow-md">
                      Plan surprises, track moods, and stay connected with your partner
                    </p>
                    {!isConnected ? (
                      <Button 
                        className="bg-white text-pink-600 hover:bg-white/90 text-sm sm:text-base shadow-md"
                        onClick={handleConnectPartner}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Connect with Partner
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button className="bg-white text-pink-600 hover:bg-white/90 text-sm shadow-md">
                          Send Love Note
                        </Button>
                        <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30 border-white text-sm shadow-md">
                          Plan Date
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <MoodTracker />
              <GiftPlanner />
              <DailyChallenges />
              <WeekendPlanner />
              <CountdownEvents />
              <MonthlyGoals />
              <CoupleGames />
              <LoveMessages />
              <SpecialDates />
            </div>

            {/* Partner Connection Status (Mobile) */}
            {isConnected && (
              <div className="md:hidden mt-6">
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium text-sm text-green-800">Partner is online</p>
                        <p className="text-xs text-green-600">Active now</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-green-800 border-green-300">
                      Message
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-6">
              <Card className="bg-gradient-to-r from-pink-500 to-red-500 text-white border-0 shadow-md">
                <CardContent className="p-5 sm:p-6 text-center">
                  <Heart className="h-7 w-7 sm:h-8 sm:w-8 mx-auto mb-3 text-white" />
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Make Every Moment Special</h3>
                  <p className="text-white/90 mb-4 text-sm sm:text-base">
                    Discover new ways to connect, celebrate your love, and create lasting memories together.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="secondary" className="bg-white text-pink-600 hover:bg-white/90">
                      Explore Ideas
                    </Button>
                    <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30 border-white">
                      Share Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Connect Tab */}
          <TabsContent value="connect" className="space-y-6">
            <PartnershipManager />
          </TabsContent>

          {/* Mood Tab */}
          <TabsContent value="mood" className="space-y-6">
            <MoodTracker />
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="ai-chat" className="space-y-6">
            <div className="h-[600px]">
              <AIChatAssistant />
            </div>
          </TabsContent>

          {/* Gifts Tab */}
          <TabsContent value="gifts" className="space-y-6">
            <GiftPlanner />
          </TabsContent>

          {/* Dates Tab */}
          <TabsContent value="dates" className="space-y-6">
            <SpecialDates />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <LoveMessages />
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <CoupleGames />
          </TabsContent>

          {/* More Tab (Mobile only) */}
          <TabsContent value="more" className="md:hidden space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="h-[500px]">
                <AIChatAssistant />
              </div>
              <CoupleGames />
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-pink-600">App Settings</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Notification Preferences
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Partner Connection
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="h-4 w-4 mr-2" />
                      Privacy Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;