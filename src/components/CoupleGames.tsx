import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon, Heart, MessageSquare, Dice6, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

// ====== GAME DATA ======
const games = [
  {
    id: "questions",
    name: "Love Questions",
    description: "Deep questions to know each other better",
    icon: MessageSquare,
    color: "bg-primary-soft text-primary",
  },
  {
    id: "dice",
    name: "Date Ideas Dice",
    description: "Roll for a random date activity",
    icon: Dice6,
    color: "bg-accent-soft text-accent",
  },
  {
    id: "memory",
    name: "Memory Lane",
    description: "Share your favorite memories together",
    icon: Heart,
    color: "bg-secondary-soft text-secondary-foreground",
  },
  {
    id: "wouldYouRather",
    name: "Would You Rather",
    description: "Play fun & quirky couple scenarios",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "futureDreams",
    name: "Future Dreams",
    description: "Explore dreams and goals together",
    icon: Star,
    color: "bg-yellow-100 text-yellow-600",
  },
];

// ====== GAME CONTENT ======
const loveQuestions = [
  "What's your favorite memory of us together?",
  "If we could travel anywhere in the world, where would you want to go?",
  "What's something new you'd like to try together?",
  "What made you realize you loved me?",
  "What's your favorite thing about our relationship?",
  "If you could describe our love in three words, what would they be?",
];

const dateIdeas = [
  "🎬 Movie night with homemade popcorn",
  "🍳 Cook a new recipe together",
  "🌅 Watch sunrise/sunset together",
  "🚶‍♀️ Take a walk in a new neighborhood",
  "🎨 Try painting or drawing together",
  "📚 Read the same book and discuss",
  "🎵 Create a playlist for each other",
  "☕ Try a new coffee shop or café",
];

const wouldYouRather = [
  "Would you rather travel the world with me or build our dream home together?",
  "Would you rather have a fancy dinner date or a cozy movie night at home?",
  "Would you rather go skydiving with me or take a long road trip?",
  "Would you rather relive our first date or fast-forward to our 10th anniversary?",
  "Would you rather write each other love letters or make a photo album together?",
];

const futureDreams = [
  "Where do you imagine us living in 10 years?",
  "What's a dream vacation we should plan for?",
  "What's a tradition you'd like to start together?",
  "What’s something on your bucket list we could do as a couple?",
  "If we had unlimited money, what’s the first thing you’d want us to do?",
];

// ====== HELPER FUNCTION ======
const getRandomItem = (list: string[]) => list[Math.floor(Math.random() * list.length)];

export function CoupleGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [score, setScore] = useState(0);

  const handlePlay = (gameId: string) => {
    setActiveGame(gameId);
    setScore((prev) => prev + 1);

    switch (gameId) {
      case "questions":
        setCurrentContent(getRandomItem(loveQuestions));
        break;
      case "dice":
        setCurrentContent(getRandomItem(dateIdeas));
        break;
      case "wouldYouRather":
        setCurrentContent(getRandomItem(wouldYouRather));
        break;
      case "futureDreams":
        setCurrentContent(getRandomItem(futureDreams));
        break;
      case "memory":
        setCurrentContent("💭 Share one of your favorite memories together!");
        break;
      default:
        setCurrentContent('');
    }
  };

  const handleNext = () => {
    if (!activeGame) return;
    handlePlay(activeGame);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between w-full">
          <span className="flex items-center gap-2">
            <GamepadIcon className="h-5 w-5 text-primary" />
            Couple Games
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            ⭐ Score: {score}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* GAME LIST */}
        <div className="grid gap-3">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div key={game.id} className="p-3 bg-gradient-soft rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${game.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{game.name}</h3>
                    <p className="text-xs text-muted-foreground">{game.description}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handlePlay(game.id)}
                >
                  Play Now
                </Button>

                {/* Show content directly below THIS game when active */}
                {activeGame === game.id && currentContent && (
                  <div className="mt-3 p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-border/40">
                    <h3 className="font-medium text-primary mb-2">
                      {game.id === "questions" && "💕 Love Question"}
                      {game.id === "dice" && "🎲 Date Idea"}
                      {game.id === "memory" && "📸 Memory Lane"}
                      {game.id === "wouldYouRather" && "✨ Would You Rather"}
                      {game.id === "futureDreams" && "🌟 Future Dreams"}
                    </h3>
                    <p className="text-sm mb-3">{currentContent}</p>
                    {game.id !== "memory" && (
                      <Button size="sm" onClick={handleNext} className="bg-gradient-romantic">
                        {game.id === "dice" ? "Roll Again" : "Next"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
