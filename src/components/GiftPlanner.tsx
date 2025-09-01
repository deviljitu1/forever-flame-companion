import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Plus, Calendar, Sparkles } from 'lucide-react';
import { useState } from 'react';

const giftSuggestions = [
  { type: 'Surprise Date', idea: 'Picnic in the park with her favorite snacks', urgency: 'weekend' },
  { type: 'Sweet Gesture', idea: 'Leave love notes in her bag/car', urgency: 'today' },
  { type: 'Gift', idea: 'Her favorite flowers delivered to work', urgency: 'this week' },
  { type: 'Experience', idea: 'Book that cooking class she mentioned', urgency: 'next month' },
];

export function GiftPlanner() {
  const [customIdea, setCustomIdea] = useState('');

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Gift & Surprise Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">AI Suggestions</h3>
          {giftSuggestions.map((suggestion, index) => (
            <div key={index} className="p-3 bg-gradient-soft rounded-lg border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {suggestion.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {suggestion.urgency}
                </Badge>
              </div>
              <p className="text-sm mb-3">{suggestion.idea}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="default" className="bg-gradient-romantic">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button size="sm" variant="outline">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Customize
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Add Your Own Idea</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Plan something special..."
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" className="bg-gradient-romantic">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}