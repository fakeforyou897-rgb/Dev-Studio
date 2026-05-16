// @ts-ignore - Deno imports are not recognized by standard TypeScript configs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// @ts-ignore - Deno global is not recognized by standard TypeScript configs
declare const Deno: any;


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, systemPrompt, config } = await req.json();

    // You can set OPENAI_API_KEY in your Supabase Dashboard -> Edge Functions -> Secrets
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured in Edge Function secrets');
    }

    // Call the OpenAI API (or change the URL to use Gemini, Anthropic, OpenRouter, etc.)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config?.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt || 'You are an expert AI coding assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: config?.temperature ?? 0.7,
        max_tokens: config?.maxTokens,
        stream: false, // Set to true if you want to implement streaming later
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'AI Provider returned an error');
    }

    const reply = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
