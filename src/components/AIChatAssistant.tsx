import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, MessageCircle, Sparkles, Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "How can I show more appreciation to my partner?",
  "We've been arguing more lately. What should I do?",
  "How do I plan a romantic surprise?",
  "My partner seems distant. How can I reconnect?",
  "What are some good conversation starters for couples?",
  "How do we handle disagreements better?"
];

export function AIChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi there! 💕 I'm your AI relationship assistant. I'm here to help with any questions about love, communication, or building stronger connections. What would you like to talk about?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const message = messageText || currentMessage.trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Get user context for better AI responses
      const { data: { user } } = await supabase.auth.getUser();
      let context = {};

      if (user) {
        // Get user's profile and recent moods for context
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, partner_id')
          .eq('user_id', user.id)
          .single();

        const { data: recentMoods } = await supabase
          .from('mood_entries')
          .select('mood_label')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        context = {
          hasPartner: !!profile?.partner_id,
          partnerName: profile?.display_name,
          recentMoods: recentMoods?.map(m => m.mood_label) || []
        };
      }

      // Call AI chat edge function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message,
          context
        }
      });

      if (error) {
        console.error('AI Chat error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response', {
        description: 'Please try again in a moment.'
      });

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. 💕",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <Card className="shadow-soft h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          AI Love Coach
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="space-y-2 flex-shrink-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              Try asking:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedPrompts.slice(0, 4).map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => useSuggestedPrompt(prompt)}
                  className="text-xs h-auto p-2 text-left justify-start whitespace-normal"
                  disabled={isLoading}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-2 flex-shrink-0">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything about relationships... 💕"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[80px] resize-none flex-1"
              maxLength={500}
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!currentMessage.trim() || isLoading}
              size="sm"
              className="bg-gradient-romantic hover:opacity-90 h-[80px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{currentMessage.length}/500</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}