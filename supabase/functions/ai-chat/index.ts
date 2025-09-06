import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  context?: {
    hasPartner?: boolean;
    recentMoods?: string[];
    partnerName?: string;
  };
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

    const { message, context = {} }: ChatRequest = await req.json();

    if (!message || message.trim().length === 0) {
      throw new Error('Message is required');
    }

    console.log('AI Chat request:', { message, context });

    // Build context for the AI
    let systemPrompt = `You are a caring, supportive relationship assistant and love coach. You help couples build stronger, healthier relationships with empathy and wisdom.

Guidelines:
- Be warm, supportive, and non-judgmental
- Give practical, actionable advice
- Keep responses concise but meaningful (2-4 sentences max)
- Focus on healthy communication and emotional connection
- Respect privacy and boundaries
- If asked about serious issues (abuse, safety), encourage professional help
- Use gentle, caring language with occasional heart emojis 💕

User context:`;

    if (context.hasPartner) {
      systemPrompt += `\n- User has a partner${context.partnerName ? ` named ${context.partnerName}` : ''}`;
      if (context.recentMoods && context.recentMoods.length > 0) {
        systemPrompt += `\n- Recent mood patterns: ${context.recentMoods.join(', ')}`;
      }
    } else {
      systemPrompt += `\n- User might be single or looking for relationship advice`;
    }

    systemPrompt += `\n\nPlease provide helpful, caring relationship advice based on their question.`;

    // Generate AI response using Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Question: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response generated from Gemini API');
    }

    // Clean up the response text
    const cleanResponse = aiResponse.trim();

    return new Response(JSON.stringify({ 
      response: cleanResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. 💕"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});