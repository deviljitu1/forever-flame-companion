import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Plus, Calendar, Sparkles, X, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Initial gift suggestions
const initialGiftSuggestions = [
  { 
    id: 1, 
    type: 'Surprise Date', 
    idea: 'Picnic in the park with her favorite snacks', 
    urgency: 'weekend',
    scheduled: false,
    scheduledDate: null
  },
  { 
    id: 2, 
    type: 'Sweet Gesture', 
    idea: 'Leave love notes in her bag/car', 
    urgency: 'today',
    scheduled: false,
    scheduledDate: null
  },
  { 
    id: 3, 
    type: 'Gift', 
    idea: 'Her favorite flowers delivered to work', 
    urgency: 'this week',
    scheduled: false,
    scheduledDate: null
  },
  { 
    id: 4, 
    type: 'Experience', 
    idea: 'Book that cooking class she mentioned', 
    urgency: 'next month',
    scheduled: false,
    scheduledDate: null
  },
];

export function GiftPlanner() {
  const { settings } = useSettings();
  const [customIdea, setCustomIdea] = useState('');
  const [suggestions, setSuggestions] = useState(initialGiftSuggestions);
  const [customIdeas, setCustomIdeas] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(null);

  // Add a custom idea
  const addCustomIdea = () => {
    if (customIdea.trim()) {
      const newIdea = {
        id: Date.now(),
        type: 'Custom',
        idea: customIdea,
        urgency: 'when convenient',
        scheduled: false,
        scheduledDate: null,
        isCustom: true
      };
      setCustomIdeas([...customIdeas, newIdea]);
      setCustomIdea('');
    }
  };

  // Toggle date picker for a suggestion
  const toggleDatePicker = (id) => {
    setShowDatePicker(showDatePicker === id ? null : id);
    setSelectedDate(''); // Reset selected date when toggling
  };

  // Schedule a suggestion with a date
  const scheduleSuggestion = (id, date) => {
    const newDate = date || new Date().toISOString().split('T')[0];
    
    setSuggestions(suggestions.map(item => 
      item.id === id ? {...item, scheduled: true, scheduledDate: newDate} : item
    ));
    
    setCustomIdeas(customIdeas.map(item => 
      item.id === id ? {...item, scheduled: true, scheduledDate: newDate} : item
    ));
    
    setShowDatePicker(null);
  };

  // Unschedule a suggestion
  const unscheduleSuggestion = (id) => {
    setSuggestions(suggestions.map(item => 
      item.id === id ? {...item, scheduled: false, scheduledDate: null} : item
    ));
    
    setCustomIdeas(customIdeas.map(item => 
      item.id === id ? {...item, scheduled: false, scheduledDate: null} : item
    ));
  };

  // Remove a custom idea
  const removeCustomIdea = (id) => {
    setCustomIdeas(customIdeas.filter(item => item.id !== id));
  };

  // Remove an AI suggestion
  const removeSuggestion = (id) => {
    setSuggestions(suggestions.filter(item => item.id !== id));
  };

  // Handle input key press (Enter to add)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addCustomIdea();
    }
  };

  // Format date for display (fixed TypeScript error)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="shadow-soft max-w-full mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Gift className="h-5 w-5 text-primary" />
          Gift & Surprise Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Suggestions Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">AI Suggestions</h3>
            <span className="text-xs text-muted-foreground">
              {suggestions.length} suggestions
            </span>
          </div>
          
          {suggestions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground border rounded-lg">
              <p className="text-sm">No suggestions left. Add your own ideas below!</p>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-3 bg-gradient-soft rounded-lg border border-border/50 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 absolute top-2 right-2" 
                  onClick={() => removeSuggestion(suggestion.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                
                <div className="flex items-start justify-between mb-2 pr-6">
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.type}
                  </Badge>
                  <Badge variant={suggestion.scheduled ? "default" : "outline"} className="text-xs">
                    {suggestion.scheduled ? formatDate(suggestion.scheduledDate) : suggestion.urgency}
                  </Badge>
                </div>
                <p className="text-sm mb-3">{suggestion.idea}</p>
                
                {showDatePicker === suggestion.id ? (
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="flex-1 p-2 border rounded text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleDatePicker(suggestion.id)}
                        className="h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={() => scheduleSuggestion(suggestion.id, selectedDate)}
                      className="bg-gradient-romantic text-xs sm:text-sm"
                      disabled={!selectedDate}
                    >
                      Confirm Date
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      variant={suggestion.scheduled ? "default" : "outline"}
                      onClick={suggestion.scheduled ? 
                        () => unscheduleSuggestion(suggestion.id) : 
                        () => toggleDatePicker(suggestion.id)
                      }
                      className="text-xs sm:text-sm"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {suggestion.scheduled ? 'Scheduled' : 'Schedule'}
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Customize
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Custom Ideas Section */}
        {customIdeas.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Your Ideas</h3>
              <span className="text-xs text-muted-foreground">
                {customIdeas.length} ideas
              </span>
            </div>
            
            {customIdeas.map((idea) => (
              <div key={idea.id} className="p-3 bg-muted/30 rounded-lg border border-border/50 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 absolute top-2 right-2" 
                  onClick={() => removeCustomIdea(idea.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                
                <div className="flex items-start justify-between mb-2 pr-6">
                  <Badge variant="outline" className="text-xs">
                    Your Idea
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Badge variant={idea.scheduled ? "default" : "outline"} className="text-xs">
                      {idea.scheduled ? formatDate(idea.scheduledDate) : idea.urgency}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm mb-3">{idea.idea}</p>
                
                {showDatePicker === idea.id ? (
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="flex-1 p-2 border rounded text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleDatePicker(idea.id)}
                        className="h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={() => scheduleSuggestion(idea.id, selectedDate)}
                      className="bg-gradient-romantic text-xs sm:text-sm"
                      disabled={!selectedDate}
                    >
                      Confirm Date
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      variant={idea.scheduled ? "default" : "outline"}
                      onClick={idea.scheduled ? 
                        () => unscheduleSuggestion(idea.id) : 
                        () => toggleDatePicker(idea.id)
                      }
                      className="text-xs sm:text-sm"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {idea.scheduled ? 'Scheduled' : 'Schedule'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Your Own Idea Section */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Add Your Own Idea</h3>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="Plan something special..."
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={addCustomIdea} 
              className="bg-gradient-romantic whitespace-nowrap"
              disabled={!customIdea.trim()}
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              Add Idea
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}