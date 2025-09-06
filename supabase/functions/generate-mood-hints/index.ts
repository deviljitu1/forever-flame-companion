import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MoodHintRequest {
  partnerName: string;
  moodType: string;
  moodLabel: string;
  note?: string;
  recentMoods?: Array<{
    mood_type: string;
    mood_label: string;
    created_at: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const { partnerName, moodType, moodLabel, note, recentMoods }: MoodHintRequest = await req.json();

    // Create context for the AI based on mood and recent patterns
    let moodContext = `${partnerName} just logged their mood as "${moodLabel}" (${moodType})`;
    if (note) {
      moodContext += ` with the note: "${note}"`;
    }

    // Add recent mood pattern if available
    if (recentMoods && recentMoods.length > 0) {
      const recentMoodSummary = recentMoods.slice(0, 3).map(m => `${m.mood_label} (${new Date(m.created_at).toLocaleDateString()})`).join(', ');
      moodContext += `\n\nRecent mood pattern: ${recentMoodSummary}`;
    }

    // Generate AI hint using Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a caring relationship assistant. Based on the mood information below, generate a gentle, actionable suggestion for their partner. Keep it warm, supportive, and specific (not generic). Focus on simple acts of love and care. Limit to 1-2 sentences maximum.

Mood Context: ${moodContext}

Guidelines:
- If mood is positive: Suggest ways to celebrate or share the joy
- If mood is stressed/anxious: Suggest calming activities or support
- If mood is sad/down: Suggest comforting gestures or quality time
- If mood is angry/frustrated: Suggest space, listening, or de-escalation
- Always be respectful of their privacy and feelings
- Suggest specific actions, not just "be supportive"
- Use warm, caring language but not overly dramatic

Generate a caring suggestion:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    const generatedHint = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedHint) {
      throw new Error('No hint generated from Gemini API');
    }

    // Clean up the hint text
    const cleanHint = generatedHint.trim().replace(/^["']|["']$/g, '');

    return new Response(JSON.stringify({ 
      hint: cleanHint,
      moodType,
      moodLabel,
      partnerName 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-mood-hints function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      hint: 'Maybe check in with them and see how they\'re doing 💕' // Fallback hint
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});