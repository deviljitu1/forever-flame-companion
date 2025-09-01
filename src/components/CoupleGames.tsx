import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon, Heart, MessageSquare, Dice6 } from 'lucide-react';
import { useState } from 'react';

const games = [
  {
    name: "Love Questions",
    description: "Deep questions to know each other better",
    icon: MessageSquare,
    color: "bg-primary-soft text-primary"
  },
  {
    name: "Date Ideas Dice",
    description: "Roll for a random date activity",
    icon: Dice6,
    color: "bg-accent-soft text-accent"
  },
  {
    name: "Memory Lane",
    description: "Share your favorite memories together",
    icon: Heart,
    color: "bg-secondary-soft text-secondary-foreground"
  }
];

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

export function CoupleGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentDateIdea, setCurrentDateIdea] = useState('');

  const playLoveQuestions = () => {
    const randomQuestion = loveQuestions[Math.floor(Math.random() * loveQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setActiveGame('questions');
  };

  const rollDateDice = () => {
    const randomIdea = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
    setCurrentDateIdea(randomIdea);
    setActiveGame('dice');
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GamepadIcon className="h-5 w-5 text-primary" />
          Couple Games
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <div key={index} className="p-3 bg-gradient-soft rounded-lg border border-border/50">
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
                  onClick={() => {
                    if (game.name === "Love Questions") playLoveQuestions();
                    if (game.name === "Date Ideas Dice") rollDateDice();
                    if (game.name === "Memory Lane") setActiveGame('memory');
                  }}
                >
                  Play Now
                </Button>
              </div>
            );
          })}
        </div>

        {activeGame === 'questions' && currentQuestion && (
          <div className="p-4 bg-primary-soft rounded-lg border border-primary/20">
            <h3 className="font-medium text-primary mb-2">💕 Love Question</h3>
            <p className="text-sm mb-3">{currentQuestion}</p>
            <Button size="sm" onClick={playLoveQuestions} className="bg-gradient-romantic">
              Next Question
            </Button>
          </div>
        )}

        {activeGame === 'dice' && currentDateIdea && (
          <div className="p-4 bg-accent-soft rounded-lg border border-accent/20">
            <h3 className="font-medium text-accent mb-2">🎲 Date Idea</h3>
            <p className="text-sm mb-3">{currentDateIdea}</p>
            <Button size="sm" onClick={rollDateDice} className="bg-gradient-romantic">
              Roll Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}