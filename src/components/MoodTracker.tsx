import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Smile, Meh, Frown, HeartCrack } from 'lucide-react';

const moods = [
  { icon: Heart, label: 'In Love', color: 'text-primary', bg: 'bg-primary-soft' },
  { icon: Smile, label: 'Happy', color: 'text-accent', bg: 'bg-accent-soft' },
  { icon: Meh, label: 'Neutral', color: 'text-muted-foreground', bg: 'bg-muted' },
  { icon: Frown, label: 'Sad', color: 'text-secondary', bg: 'bg-secondary-soft' },
  { icon: HeartCrack, label: 'Upset', color: 'text-destructive', bg: 'bg-destructive/10' },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [partnerMood, setPartnerMood] = useState(1); // Simulated partner mood

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Mood Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2 sm:mb-3">How are you feeling?</h3>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {moods.map((mood, index) => {
              const Icon = mood.icon;
              return (
                <Button
                  key={index}
                  variant={selectedMood === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMood(index)}
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 ${selectedMood === index ? 'bg-gradient-romantic' : ''} hover-scale`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{mood.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t">
          <h3 className="text-sm font-medium mb-2 sm:mb-3">Your Partner's Mood</h3>
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-soft rounded-lg">
            {(() => {
              const Icon = moods[partnerMood].icon;
              return <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${moods[partnerMood].color}`} />;
            })()}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">{moods[partnerMood].label}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Maybe send them a sweet message! 💕
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}