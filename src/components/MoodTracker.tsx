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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Mood Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">How are you feeling?</h3>
          <div className="flex gap-2 flex-wrap">
            {moods.map((mood, index) => {
              const Icon = mood.icon;
              return (
                <Button
                  key={index}
                  variant={selectedMood === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMood(index)}
                  className={`flex items-center gap-2 ${selectedMood === index ? 'bg-gradient-romantic' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  {mood.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Your Partner's Mood</h3>
          <div className="flex items-center gap-3 p-3 bg-gradient-soft rounded-lg">
            {(() => {
              const Icon = moods[partnerMood].icon;
              return <Icon className={`h-6 w-6 ${moods[partnerMood].color}`} />;
            })()}
            <div>
              <p className="font-medium">{moods[partnerMood].label}</p>
              <p className="text-sm text-muted-foreground">
                Maybe send them a sweet message! 💕
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}