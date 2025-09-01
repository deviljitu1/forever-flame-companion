import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Copy, Shuffle, Heart, Sparkles, Send, BookOpen, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const loveMessages = [
  "Just thinking about you makes my day brighter ✨",
  "You're the reason I believe in love 💕",
  "Distance means nothing when someone means everything 🌍❤️",
  "Can't wait to see your beautiful smile again 😊",
  "You make ordinary moments feel magical ✨",
  "Every day with you is a gift I cherish 🎁",
  "You're my favorite hello and hardest goodbye 👋💕",
  "Thinking of you and sending all my love 💌",
  "My heart skips a beat every time I see you 💓",
  "You're the missing piece I've been searching for 🧩",
  "Loving you is as natural as breathing 🌬️",
  "You're the best thing that's ever happened to me 🎉",
];

const consolationMessages = [
  "I'm here for you, always. You don't have to face this alone 🤗",
  "Your feelings are valid, and I love you through it all 💕",
  "Take your time, my love. I'll be right here waiting ⏰",
  "Let's talk when you're ready. I'm just a message away 📱",
  "Sending you the biggest virtual hug right now 🫂",
  "You're stronger than you know, and I believe in you 💪",
  "This storm will pass, and I'll be here holding your umbrella ☔",
  "Your pain is my pain. Let me share the burden with you 🎗️",
  "It's okay not to be okay. I love every version of you 💞",
  "We'll get through this together, one step at a time 👣",
];

const messageCategories = [
  { id: 'love', name: 'Sweet Messages', icon: Heart, count: loveMessages.length },
  { id: 'comfort', name: 'Comfort Messages', icon: MessageCircle, count: consolationMessages.length },
  { id: 'flirty', name: 'Flirty Messages', icon: Sparkles, count: 8 },
  { id: 'appreciation', name: 'Appreciation', icon: BookOpen, count: 6 },
];

const quickActions = [
  { id: 'flowers', name: 'Send Flowers', emoji: '💐', color: 'bg-pink-50 hover:bg-pink-100' },
  { id: 'chocolate', name: 'Order Chocolate', emoji: '🍫', color: 'bg-amber-50 hover:bg-amber-100' },
  { id: 'call', name: 'Schedule Call', emoji: '📱', color: 'bg-blue-50 hover:bg-blue-100' },
  { id: 'letter', name: 'Write Letter', emoji: '💌', color: 'bg-red-50 hover:bg-red-100' },
  { id: 'gift', name: 'Surprise Gift', emoji: '🎁', color: 'bg-purple-50 hover:bg-purple-100' },
  { id: 'date', name: 'Plan Date', emoji: '📅', color: 'bg-green-50 hover:bg-green-100' },
];

export function LoveMessages() {
  const [currentMessage, setCurrentMessage] = useState(loveMessages[0]);
  const [messageType, setMessageType] = useState('love');
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);

  // Initialize with a random message
  useEffect(() => {
    getRandomMessage();
  }, []);

  const getRandomMessage = () => {
    let messages;
    switch (messageType) {
      case 'love':
        messages = loveMessages;
        break;
      case 'comfort':
        messages = consolationMessages;
        break;
      case 'flirty':
        messages = [
          "Can't stop thinking about you... and I don't want to 😉",
          "You must be a magician because every time I look at you, everyone else disappears 🎩",
          "Are you a campfire? Because you're hot and I want s'more 🔥",
          "If you were a vegetable, you'd be a cute-cumber 🥒",
          "Do you have a map? I keep getting lost in your eyes 🗺️",
          "Is your name Google? Because you have everything I've been searching for 🔍",
        ];
        break;
      case 'appreciation':
        messages = [
          "I appreciate how you always know how to make me smile 😊",
          "Thank you for being my rock through everything 🪨",
          "I don't say it enough, but I'm so grateful for you 🙏",
          "Your kindness inspires me to be a better person 🌟",
          "I appreciate the little things you do that show you care 💫",
          "Thank you for always believing in me, even when I don't 🤝",
        ];
        break;
      default:
        messages = loveMessages;
    }

    // Filter out the current message to avoid repeats
    const filteredMessages = messages.filter(msg => msg !== currentMessage);
    const randomIndex = Math.floor(Math.random() * filteredMessages.length);
    const newMessage = filteredMessages[randomIndex] || messages[0];
    
    setCurrentMessage(newMessage);
    setMessageHistory(prev => [...prev.slice(-4), newMessage]); // Keep last 5 messages
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = () => {
    if (favorites.includes(currentMessage)) {
      setFavorites(favorites.filter(msg => msg !== currentMessage));
    } else {
      setFavorites([...favorites, currentMessage]);
    }
  };

  const sendMessage = () => {
    // In a real app, this would integrate with your messaging platform
    alert(`Message sent: "${currentMessage}"`);
  };

  const isFavorite = favorites.includes(currentMessage);

  return (
    <Card className="shadow-soft max-w-md mx-auto overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-romantic text-white">
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageCircle className="h-5 w-5" />
          Love Messages & Ideas
        </CardTitle>
        <p className="text-sm opacity-90">Find the perfect words to express your feelings</p>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        {/* Message Categories */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Message Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {messageCategories.map((category) => (
              <Button
                key={category.id}
                variant={messageType === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setMessageType(category.id);
                  setTimeout(getRandomMessage, 100);
                }}
                className={`text-xs h-10 ${messageType === category.id ? 'bg-gradient-romantic' : ''}`}
              >
                <category.icon className="h-3 w-3 mr-1" />
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Message Display */}
        <div className="p-4 bg-gradient-soft rounded-lg border border-border/50 relative">
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={`h-7 w-7 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <p className="text-sm text-center mb-4 leading-relaxed font-medium">
            {currentMessage}
          </p>
          
          <div className="flex gap-2 justify-center flex-wrap">
            <Button size="sm" variant="outline" onClick={getRandomMessage} className="flex-1 min-w-[120px]">
              <Shuffle className="h-3 w-3 mr-1" />
              New Message
            </Button>
            <Button 
              size="sm" 
              variant={copied ? "default" : "outline"} 
              onClick={copyMessage} 
              className="flex-1 min-w-[100px]"
            >
              <Copy className="h-3 w-3 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button 
              size="sm" 
              variant="default" 
              onClick={sendMessage}
              className="bg-gradient-romantic flex-1 min-w-[100px]"
            >
              <Send className="h-3 w-3 mr-1" />
              Send
            </Button>
          </div>
        </div>

        {/* Message History */}
        {messageHistory.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-2">Recent Messages</h3>
            <div className="space-y-2">
              {messageHistory.slice().reverse().map((msg, index) => (
                <div 
                  key={index} 
                  className="text-xs p-2 bg-muted rounded cursor-pointer hover:bg-muted/70"
                  onClick={() => setCurrentMessage(msg)}
                >
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickActions.map((action) => (
              <Button 
                key={action.id}
                variant="outline" 
                size="sm"
                className={`h-14 flex-col ${action.color} border-0`}
              >
                <span className="text-lg">{action.emoji}</span>
                <span className="text-xs mt-1">{action.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Favorites</h3>
              <Badge variant="secondary">{favorites.length}</Badge>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {favorites.map((msg, index) => (
                <div 
                  key={index} 
                  className="text-xs p-2 bg-muted rounded flex justify-between items-center"
                >
                  <span className="truncate mr-2">{msg}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMessage(msg)}
                    className="h-5 w-5"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}