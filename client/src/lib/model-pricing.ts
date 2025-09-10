export interface ModelPricing {
  inputTokenPrice: number;
  outputTokenPrice: number;
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  // OpenAI Models
  'gpt-4o': { inputTokenPrice: 2.5, outputTokenPrice: 10.00 },
  'gpt-4.1-mini': { inputTokenPrice: 0.40, outputTokenPrice: 1.60 },
  'gpt-4.1-nano': { inputTokenPrice: 0.10, outputTokenPrice: 0.40 },
  'gpt-4o-mini': { inputTokenPrice: 0.15, outputTokenPrice: 0.60 },
  'gpt-4.1': { inputTokenPrice: 2.00, outputTokenPrice: 8.00 },
  'o3-mini': { inputTokenPrice: 1.10, outputTokenPrice: 0.55 },
  'o4-mini': { inputTokenPrice: 1.10, outputTokenPrice: 4.40 },
  
  // Anthropic Models
  'claude-opus-4': { inputTokenPrice: 15.00, outputTokenPrice: 75.00 },
  'claude-sonnet-4': { inputTokenPrice: 3.00, outputTokenPrice: 15.00 },
  'claude-3.7-sonnet': { inputTokenPrice: 3.00, outputTokenPrice: 15.00 },
  'claude-3.5-sonnet': { inputTokenPrice: 3.00, outputTokenPrice: 15.00 },
  'claude-3.5-haiku': { inputTokenPrice: 0.80, outputTokenPrice: 4.0 },
  
  // Google Models
  'gemini-2.5-pro': { inputTokenPrice: 2.5, outputTokenPrice: 15.00 },
  'gemini-2.5-flash': { inputTokenPrice: 0.3, outputTokenPrice: 2.50 },
  
  // xAI Models
  'grok-3': { inputTokenPrice: 3.00, outputTokenPrice: 15.00 },
  'grok-3-mini-beta-high-effort': { inputTokenPrice: 0.30, outputTokenPrice: 0.50 },
  'grok-3-mini-beta-low-effort': { inputTokenPrice: 0.30, outputTokenPrice: 0.50 },
  
  // DeepSeek Models
  'deepseek-r1': { inputTokenPrice: 0.75, outputTokenPrice: 0.99 },
  
  // Mistral Models
  'mistral-large-official': { inputTokenPrice: 2.00, outputTokenPrice: 6.00 },
 
  // Meta Models
  'groq-llama-4-maverick': { inputTokenPrice: 0.20, outputTokenPrice: 0.60 },
  'groq-llama3.3-70b': { inputTokenPrice: 0.59, outputTokenPrice: 0.79 },
  'groq-llama3.1-8b-instant': { inputTokenPrice: 0.05, outputTokenPrice: 0.08 },
  'groq-llama-4-scout': { inputTokenPrice: 0.11, outputTokenPrice: 0.34 },
  
  // Writer Models
  'palmyra-fin-default': { inputTokenPrice: 5.00, outputTokenPrice: 12.00 },
  
  // Alibaba Models (Qwen)
  'qwen3-32b': { inputTokenPrice: 0.29, outputTokenPrice: 0.59 },
  'qwen-2.5-72b': { inputTokenPrice: 0.29, outputTokenPrice: 0.59 },
  'qwen-2.5-32b': { inputTokenPrice: 0.29, outputTokenPrice: 0.59 },
  'qwen-2.5-14b': { inputTokenPrice: 0.29, outputTokenPrice: 0.59 },
  'qwen-2.5-7b': { inputTokenPrice: 0.29, outputTokenPrice: 0.59 },
  'groq-qwen3-32b': { inputTokenPrice: 0.29, outputTokenPrice: 0.59 },
  
  // Moonshot AI Models
  'kimi-k2': { inputTokenPrice: 1.00, outputTokenPrice: 3.00 },
  'kimi-chat': { inputTokenPrice: 1.00, outputTokenPrice: 3.00 },
  'moonshot-v1-8k': { inputTokenPrice: 1.00, outputTokenPrice: 3.00 },
  'moonshot-v1-32k': { inputTokenPrice: 1.00, outputTokenPrice: 3.00 },
  'moonshot-v1-128k': { inputTokenPrice: 1.00, outputTokenPrice: 3.00 },
};

/**
 * Get pricing information for a model
 * @param modelId - The model identifier
 * @returns Model pricing or null if not found
 */
export function getModelPricing(modelId: string): ModelPricing | null {
  // Try exact match first
  if (MODEL_PRICING[modelId]) {
    return MODEL_PRICING[modelId];
  }
  
  // Try partial matching for model families
  for (const [key, pricing] of Object.entries(MODEL_PRICING)) {
    if (modelId.includes(key) || key.includes(modelId)) {
      return pricing;
    }
  }
  
  return null;
}

/**
 * Get average pricing for a model (input + output) / 2
 * @param modelId - The model identifier
 * @returns Average price per 1M tokens or null if not found
 */
export function getModelAveragePrice(modelId: string): number | null {
  const pricing = getModelPricing(modelId);
  if (!pricing) return null;
  
  return (pricing.inputTokenPrice + pricing.outputTokenPrice) / 2;
}