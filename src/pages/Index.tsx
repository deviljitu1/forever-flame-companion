import { MoodTracker } from '@/components/MoodTracker';
import { GiftPlanner } from '@/components/GiftPlanner';
import { SpecialDates } from '@/components/SpecialDates';
import { LoveMessages } from '@/components/LoveMessages';
import { CoupleGames } from '@/components/CoupleGames';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Bell, Settings } from 'lucide-react';
import heroCouple from '@/assets/hero-couple.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-romantic rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
                LoveKeeper
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden shadow-love">
          <CardContent className="p-0">
            <div className="relative h-48 md:h-64">
              <img 
                src={heroCouple} 
                alt="Couple in love" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="text-white p-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Keep Your Love Growing Every Day
                  </h2>
                  <p className="text-white/90 mb-4">
                    Plan surprises, track moods, and stay connected with your partner
                  </p>
                  <Button className="bg-white text-primary hover:bg-white/90">
                    <Users className="h-4 w-4 mr-2" />
                    Connect with Partner
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="space-y-6">
            <MoodTracker />
            <CoupleGames />
          </div>
          
          <div className="space-y-6">
            <GiftPlanner />
            <LoveMessages />
          </div>
          
          <div className="space-y-6 lg:col-span-2 xl:col-span-1">
            <SpecialDates />
            
            {/* Quick Stats */}
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Love Stats
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-primary-soft rounded-lg">
                    <div className="text-lg font-bold text-primary">127</div>
                    <div className="text-xs text-muted-foreground">Days Together</div>
                  </div>
                  <div className="p-3 bg-accent-soft rounded-lg">
                    <div className="text-lg font-bold text-accent">23</div>
                    <div className="text-xs text-muted-foreground">Surprises Planned</div>
                  </div>
                  <div className="p-3 bg-secondary-soft rounded-lg">
                    <div className="text-lg font-bold text-secondary-foreground">8.5</div>
                    <div className="text-xs text-muted-foreground">Happiness Score</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-foreground">12</div>
                    <div className="text-xs text-muted-foreground">Messages Sent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="mt-8 bg-gradient-romantic text-white shadow-love">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 mx-auto mb-3 text-white" />
            <h3 className="text-xl font-bold mb-2">Invite Your Partner</h3>
            <p className="text-white/90 mb-4">
              Share the love! Connect with your partner to sync moods, plan together, and make every day special.
            </p>
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Send Invitation
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;