export interface LLMConfig {
  model: string;
  temperature: number;
  maxTokens?: number;
}

export async function callLLM(prompt: string, systemPrompt: string, config: LLMConfig) {
  // Placeholder for real LLM call (e.g., via Supabase Edge Function or direct SDK)
  console.log(`Calling ${config.model} with prompt length ${prompt.length}`);
  return "AI response placeholder";
}
