import { MoodTracker } from '@/components/MoodTracker';
import { GiftPlanner } from '@/components/GiftPlanner';
import { SpecialDates } from '@/components/SpecialDates';
import { LoveMessages } from '@/components/LoveMessages';
import { CoupleGames } from '@/components/CoupleGames';
import { NotificationPanel } from '@/components/NotificationPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Bell, Settings } from 'lucide-react';
import heroCouple from '@/assets/hero-couple.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-gradient-romantic rounded-full">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
                LoveKeeper
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <NotificationPanel>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                </Button>
              </NotificationPanel>
              <SettingsPanel>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </SettingsPanel>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Hero Section */}
        <Card className="mb-6 sm:mb-8 overflow-hidden shadow-love animate-fade-in">
          <CardContent className="p-0">
            <div className="relative h-40 sm:h-48 md:h-64">
              <img 
                src={heroCouple} 
                alt="Couple in love" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="text-white p-3 sm:p-4 max-w-md">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    Keep Your Love Growing Every Day
                  </h2>
                  <p className="text-white/90 mb-4 text-sm sm:text-base">
                    Plan surprises, track moods, and stay connected with your partner
                  </p>
                  <Button className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Connect with Partner</span>
                    <span className="sm:hidden">Connect</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <MoodTracker />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CoupleGames />
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <GiftPlanner />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <LoveMessages />
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6 md:col-span-2 xl:col-span-1">
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <SpecialDates />
            </div>
            
            {/* Quick Stats */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Card className="shadow-soft">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-medium mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Heart className="h-4 w-4 text-primary" />
                    Love Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                    <div className="p-2 sm:p-3 bg-primary-soft rounded-lg hover-scale">
                      <div className="text-base sm:text-lg font-bold text-primary">127</div>
                      <div className="text-xs text-muted-foreground">Days Together</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-accent-soft rounded-lg hover-scale">
                      <div className="text-base sm:text-lg font-bold text-accent">23</div>
                      <div className="text-xs text-muted-foreground">Surprises Planned</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-secondary-soft rounded-lg hover-scale">
                      <div className="text-base sm:text-lg font-bold text-secondary-foreground">8.5</div>
                      <div className="text-xs text-muted-foreground">Happiness Score</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-muted rounded-lg hover-scale">
                      <div className="text-base sm:text-lg font-bold text-foreground">12</div>
                      <div className="text-xs text-muted-foreground">Messages Sent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <Card className="mt-6 sm:mt-8 bg-gradient-romantic text-white shadow-love">
            <CardContent className="p-4 sm:p-6 text-center">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-white" />
              <h3 className="text-lg sm:text-xl font-bold mb-2">Invite Your Partner</h3>
              <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">
                Share the love! Connect with your partner to sync moods, plan together, and make every day special.
              </p>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base">
                Send Invitation
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;