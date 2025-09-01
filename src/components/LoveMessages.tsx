import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Copy, Shuffle, Heart } from 'lucide-react';
import { useState } from 'react';

const loveMessages = [
  "Just thinking about you makes my day brighter ✨",
  "You're the reason I believe in love 💕",
  "Distance means nothing when someone means everything 🌍❤️",
  "Can't wait to see your beautiful smile again 😊",
  "You make ordinary moments feel magical ✨",
  "Every day with you is a gift I cherish 🎁",
  "You're my favorite hello and hardest goodbye 👋💕",
  "Thinking of you and sending all my love 💌",
];

const consolationMessages = [
  "I'm here for you, always. You don't have to face this alone 🤗",
  "Your feelings are valid, and I love you through it all 💕",
  "Take your time, my love. I'll be right here waiting ⏰",
  "Let's talk when you're ready. I'm just a message away 📱",
  "Sending you the biggest virtual hug right now 🫂",
  "You're stronger than you know, and I believe in you 💪",
];

export function LoveMessages() {
  const [currentMessage, setCurrentMessage] = useState(loveMessages[0]);
  const [messageType, setMessageType] = useState<'love' | 'comfort'>('love');

  const getRandomMessage = () => {
    const messages = messageType === 'love' ? loveMessages : consolationMessages;
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[randomIndex]);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(currentMessage);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Love Messages & Ideas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={messageType === 'love' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMessageType('love')}
            className={messageType === 'love' ? 'bg-gradient-romantic' : ''}
          >
            <Heart className="h-3 w-3 mr-1" />
            Sweet Messages
          </Button>
          <Button
            variant={messageType === 'comfort' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMessageType('comfort')}
            className={messageType === 'comfort' ? 'bg-gradient-romantic' : ''}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Comfort Messages
          </Button>
        </div>

        <div className="p-4 bg-gradient-soft rounded-lg border border-border/50">
          <p className="text-sm text-center mb-4 leading-relaxed">
            {currentMessage}
          </p>
          <div className="flex gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={getRandomMessage}>
              <Shuffle className="h-3 w-3 mr-1" />
              New Message
            </Button>
            <Button size="sm" variant="default" onClick={copyMessage} className="bg-gradient-romantic">
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              💐 Send Flowers
            </Button>
            <Button variant="outline" size="sm">
              🍫 Order Chocolate
            </Button>
            <Button variant="outline" size="sm">
              📱 Schedule Call
            </Button>
            <Button variant="outline" size="sm">
              💌 Write Letter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}