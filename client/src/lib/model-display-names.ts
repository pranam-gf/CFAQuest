export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  // OpenAI Models
  'gpt-4.1': 'GPT-4.1',
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o mini',
  'gpt-4.1-mini': 'GPT-4.1 mini',
  'gpt-4-turbo': 'GPT-4 Turbo',
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'o1-preview': 'o1 Preview',
  'gpt-4.1-nano': 'GPT-4.1 nano',
  'o3-mini': 'o3-mini',
  'o4-mini': 'o4-mini',
  
  // Anthropic Models
  'claude-3.7-sonnet': 'Claude 3.7 Sonnet',
  'claude-3.5-sonnet': 'Claude 3.5 Sonnet',
  'claude-3.5-haiku': 'Claude 3.5 Haiku',
  'claude-3-opus': 'Claude 3 Opus',
  'claude-opus-4': 'Claude Opus 4',
  'claude-sonnet-4': 'Claude Sonnet 4',
  'claude-3-sonnet': 'Claude 3 Sonnet',
  'claude-3-haiku': 'Claude 3 Haiku',
  'claude-sonnet-4-20250514': 'Claude Sonnet 4',
  
  // Google Models
  'gemini-2.5-pro': 'Gemini 2.5 Pro',
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'gemini-pro': 'Gemini Pro',
  'gemini-flash': 'Gemini Flash',
  
  // xAI Models
  'grok-3': 'Grok 3',
  'grok-3-mini-beta-high-effort': 'Grok 3 mini (High)',
  'grok-3-mini-beta-low-effort': 'Grok 3 mini (Low)',

  // DeepSeek Models
  'deepseek-chat': 'DeepSeek Chat',
  'deepseek-reasoner': 'DeepSeek Reasoner',
  'deepseek-r1': 'DeepSeek R1',
  'deepseek-r1-distill-llama-70b': 'DeepSeek R1 Distill Llama 70B',
  'deepseek-r1-distill-qwen-32b': 'DeepSeek R1 Distill Qwen 32B',
  'deepseek-r1-distill-qwen-14b': 'DeepSeek R1 Distill Qwen 14B',
  'deepseek-r1-distill-qwen-7b': 'DeepSeek R1 Distill Qwen 7B',
  'deepseek-r1-distill-qwen-1.5b': 'DeepSeek R1 Distill Qwen 1.5B',
  
  // Mistral Models
  'mistral-large-official': 'Mistral Large',
  'mistral-medium': 'Mistral Medium',
  'mistral-small': 'Mistral Small',
  'codestral': 'Codestral',
  'pixtral-large': 'Pixtral Large',
  
  // Meta Models

  'groq-llama-4-maverick': 'Llama 4 Maverick',
  'groq-llama3.3-70b': 'Llama 3.1 70B',
  'groq-llama3.1-8b-instant': 'Llama 3.1 8B Instant',
  'llama-3.2-90b': 'Llama 3.2 90B',
  'llama-3.2-11b': 'Llama 3.2 11B',
  'llama-3.2-3b': 'Llama 3.2 3B',
  'groq-llama-4-scout': 'Llama 4 Scout',
  
  // Cohere Models
  'command-r': 'Command R',
  'command-r-plus': 'Command R+',
  'c4ai-aya': 'Aya',
  
  // Writer Models
  'palmyra-fin-default': 'Palmyra Fin',
  'palmyra-x-003': 'Palmyra X 003',
  
  // Alibaba Models
  'qwen-2.5-72b': 'Qwen 2.5 72B',
  'qwen-2.5-32b': 'Qwen 2.5 32B',
  'qwen-2.5-14b': 'Qwen 2.5 14B',
  'qwen-2.5-7b': 'Qwen 2.5 7B',
};

export function getDisplayName(modelId: string): string {
  return MODEL_DISPLAY_NAMES[modelId] || modelId;
}

export function getModelId(displayName: string): string {
  const entry = Object.entries(MODEL_DISPLAY_NAMES).find(([_, name]) => name === displayName);
  return entry ? entry[0] : displayName;
}