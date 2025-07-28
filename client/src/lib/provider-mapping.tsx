import React from 'react';

export interface ProviderInfo {
  name: string;
  color: string;
  logo: string | React.ReactNode; // SVG as string or React component
}

export const getProviderInfo = (modelName: string): ProviderInfo => {
  const model = modelName.toLowerCase();
  
  if (model.includes('claude') || model.includes('anthropic')) {
    return {
      name: 'Anthropic',
      color: '#D4A67A',
      logo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541Zm-.371 10.223L8.616 7.82l2.291 5.945Z"/>
      </svg>`
    };
  }
  
  if (model.includes('gpt') || model.includes('o1') || model.includes('o3') || model.includes('o4') || model.includes('openai')) {
    return {
      name: 'OpenAI',
      color: '#00A67E',
      logo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91a6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9a6.046 6.046 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206a5.99 5.99 0 0 0 3.997-2.9a6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355l-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085l-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z"/>
      </svg>`
    };
  }
  
  if (model.includes('gemini') || model.includes('google')) {
    return {
      name: 'Google',
      color: '#4285F4',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>`
    };
  }
  
  if (model.includes('grok') || model.includes('xai')) {
    return {
      name: 'xAI',
      color: '#000000',
      logo: (
        <img 
          src="/svgs/xai.svg" 
          alt="xAI" 
          width="22" 
          height="22" 
          style={{ width: '100%', height: '100%' }}
        />
      )
    };
  }
  
  if (model.includes('groq') || (model.includes('llama') && model.includes('groq'))) {
    return {
      name: 'Groq',
      color: '#FFA500',
      logo: (
        <img 
          src="/svgs/groq.svg" 
          alt="Groq"  
          width="22" 
          height="22"
          style={{ width: '100%', height: '100%' }}
        />
      )
    };
  }
  
  if (model.includes('deepseek')) {
    return {
      name: 'DeepSeek',
      color: '#1E40AF',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L19 7V17L12 21L5 17V7L12 3Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <circle cx="12" cy="9" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
      </svg>`
    };
  }
  
  if (model.includes('mistral') || model.includes('codestral') || model.includes('magistral')) {
    return {
      name: 'Mistral',
      color: '#FF7000',
      logo: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 233"><path d="M186.182 0h46.545v46.545h-46.545z"/><path fill="#F7D046" d="M209.455 0H256v46.545h-46.545z"/><path d="M0 0h46.545v46.545H0zm0 46.545h46.545V93.09H0zm0 46.546h46.545v46.545H0zm0 46.545h46.545v46.545H0zm0 46.546h46.545v46.545H0z"/><path fill="#F7D046" d="M23.273 0h46.545v46.545H23.273z"/><path fill="#F2A73B" d="M209.455 46.545H256V93.09h-46.545zm-186.182 0h46.545V93.09H23.273z"/><path d="M139.636 46.545h46.545V93.09h-46.545z"/><path fill="#F2A73B" d="M162.909 46.545h46.545V93.09h-46.545zm-93.091 0h46.545V93.09H69.818z"/><path fill="#EE792F" d="M116.364 93.091h46.545v46.545h-46.545zm46.545 0h46.545v46.545h-46.545zm-93.091 0h46.545v46.545H69.818z"/><path d="M93.091 139.636h46.545v46.545H93.091z"/><path fill="#EB5829" d="M116.364 139.636h46.545v46.545h-46.545z"/><path fill="#EE792F" d="M209.455 93.091H256v46.545h-46.545zm-186.182 0h46.545v46.545H23.273z"/><path d="M186.182 139.636h46.545v46.545h-46.545z"/><path fill="#EB5829" d="M209.455 139.636H256v46.545h-46.545z"/><path d="M186.182 186.182h46.545v46.545h-46.545z"/><path fill="#EB5829" d="M23.273 139.636h46.545v46.545H23.273z"/><path fill="#EA3326" d="M209.455 186.182H256v46.545h-46.545zm-186.182 0h46.545v46.545H23.273z"/>
      </svg>`
    };
  }
  
  if (model.includes('palmyra') || model.includes('writer')) {
    return {
      name: 'Writer',
      color: '#00D4AA',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      </svg>`
    };
  }

  // Additional providers based on artificialanalysis.ai
  if (model.includes('qwen') || model.includes('alibaba')) {
    return {
      name: 'Alibaba',
      color: '#FF6A00',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 7h10v10H7z" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <path d="M10 10l4 4M14 10l-4 4" stroke="currentColor" stroke-width="1.5"/>
      </svg>`
    };
  }

  if (model.includes('llama') && !model.includes('groq')) {
    return {
      name: 'Meta',
      color: '#1877F2',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>`
    };
  }

  if (model.includes('nova')) {
    return {
      name: 'AWS',
      color: '#FF9900',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.763 10.75l.694 1.4.694-1.4.694 1.4L9.539 10h.694l-1.388 2.8L7.457 10h-.694zm8.474 0l.694 1.4.694-1.4.694 1.4L16.013 10h.694l-1.388 2.8L13.931 10h-.694zM24 22.525l-6-2.475-6 2.475V24l6-2.475L24 24v-1.475z"/>
      </svg>`
    };
  }
  
  if (model.includes('together')) {
    return {
      name: 'Together AI',
      color: '#00B3A6',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
      </svg>`
    };
  }

  // Default provider
  return {
    name: 'Unknown',
    color: '#888888',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M11 15h2v2h-2zm0-8h2v6h-2z"/>
    </svg>`
  };
};