import React from 'react';

// Define a type for the provider logo component props
interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// --- SVG Components ---

const CohereLogo: React.FC<LogoProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2M7 12a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3zm10 0a5 5 0 0 1-5 5v-2a3 3 0 0 0 3-3z"/></svg>
);

const AnthropicLogo: React.FC<LogoProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541Zm-.371 10.223L8.616 7.82l2.291 5.945Z"/>
  </svg>
);

const OpenAILogo: React.FC<LogoProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91a6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9a6.046 6.046 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206a5.99 5.99 0 0 0 3.997-2.9a6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355l-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085l-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z"/>
  </svg>
);

const GoogleLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const DeepSeekLogo: React.FC<LogoProps> = (props) => (
  <img 
    src="/svgs/deepseek.svg" 
    alt="DeepSeek" 
    width="24" 
    height="24" 
    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
    {...props}
  />
);

const MistralLogo: React.FC<LogoProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 233" {...props}><path d="M186.182 0h46.545v46.545h-46.545z"/><path fill="#F7D046" d="M209.455 0H256v46.545h-46.545z"/><path d="M0 0h46.545v46.545H0zm0 46.545h46.545V93.09H0zm0 46.546h46.545v46.545H0zm0 46.545h46.545v46.545H0zm0 46.546h46.545v46.545H0z"/><path fill="#F7D046" d="M23.273 0h46.545v46.545H23.273z"/><path fill="#F2A73B" d="M209.455 46.545H256V93.09h-46.545zm-186.182 0h46.545V93.09H23.273z"/><path d="M139.636 46.545h46.545V93.09h-46.545z"/><path fill="#F2A73B" d="M162.909 46.545h46.545V93.09h-46.545zm-93.091 0h46.545V93.09H69.818z"/><path fill="#EE792F" d="M116.364 93.091h46.545v46.545h-46.545zm46.545 0h46.545v46.545h-46.545zm-93.091 0h46.545v46.545H69.818z"/><path d="M93.091 139.636h46.545v46.545H93.091z"/><path fill="#EB5829" d="M116.364 139.636h46.545v46.545h-46.545z"/><path fill="#EE792F" d="M209.455 93.091H256v46.545h-46.545zm-186.182 0h46.545v46.545H23.273z"/><path d="M186.182 139.636h46.545v46.545h-46.545z"/><path fill="#EB5829" d="M209.455 139.636H256v46.545h-46.545z"/><path d="M186.182 186.182h46.545v46.545h-46.545z"/><path fill="#EB5829" d="M23.273 139.636h46.545v46.545H23.273z"/><path fill="#EA3326" d="M209.455 186.182H256v46.545h-46.545zm-186.182 0h46.545v46.545H23.273z"/></svg>
);

const WriterLogo: React.FC<LogoProps> = ({ className, ...props }) => (
  <img 
    src="/svgs/writer.svg" 
    alt="Writer" 
    width="24" 
    height="24" 
    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
    className={`${className || ''}`}
    {...props}
  />
);

const AlibabaLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M10 10l4 4M14 10l-4 4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const MetaLogo: React.FC<LogoProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 171"><defs><linearGradient id="logosMetaIcon0" x1="13.878%" x2="89.144%" y1="55.934%" y2="58.694%"><stop offset="0%" stopColor="#0064E1"/><stop offset="40%" stopColor="#0064E1"/><stop offset="83%" stopColor="#0073EE"/><stop offset="100%" stopColor="#0082FB"/></linearGradient><linearGradient id="logosMetaIcon1" x1="54.315%" x2="54.315%" y1="82.782%" y2="39.307%"><stop offset="0%" stopColor="#0082FB"/><stop offset="100%" stopColor="#0064E0"/></linearGradient></defs><path fill="#0081FB" d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82c3.677 5.947 9.16 8.466 14.751 8.466c7.211 0 13.808-1.79 26.52-19.372c10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927c0-23.52-5.484-49.623-17.564-68.273c-8.574-13.23-19.684-21.313-31.907-21.313c-13.22 0-23.859 9.97-35.815 27.75c-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07c-14.2 18.91-26.324 26.076-42.287 26.076c-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148z"/><path fill="url(#logosMetaIcon0)" d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0C85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49c6.802 8.243 11.565 10.7 17.752 10.7c15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363c-11.395 0-21.49-2.475-32.654-13.007c-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428c-10.923 0-20.2 7.666-27.963 19.39z"/><path fill="url(#logosMetaIcon1)" d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39c-10.976 16.568-17.698 41.245-17.698 64.944c0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148C0 83.772 7.514 55.24 21.802 33.206C34.48 13.666 52.774 0 73.757 0z"/>
  </svg>
);


const UnknownLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M11 15h2v2h-2zm0-8h2v6h-2z"/>
  </svg>
);

const XAILogo: React.FC<LogoProps> = ({ className, ...props }) => (
  <img 
    src="/svgs/xai.svg" 
    alt="xAI" 
    width="24" 
    height="24" 
    style={{ width: '24px', height: '24px' }}
    className={`${className || ''}`}
    {...props}
  />
);

const GroqLogo: React.FC<LogoProps> = (props) => (
  <img 
    src="/svgs/groq.svg" 
    alt="Groq"  
    width="22" 
    height="22"
    style={{ width: '100%', height: '100%' }}
    {...props}
  />
);

export const getProviderInfo = (model: string): { name: string; color: string; logo: React.FC<LogoProps> | React.ReactElement } => {
  const modelLower = model.toLowerCase();

  if (modelLower.includes('command') || modelLower.includes('c4ai') || modelLower.includes('cohere')) {
    return { name: 'Cohere', color: '#4A4DE4', logo: CohereLogo };
  }
  
  if (model.includes('claude') || model.includes('anthropic')) {
    return { name: 'Anthropic', color: '#D4A67A', logo: AnthropicLogo };
  }
  
  if (model.includes('gpt') || model.includes('o1') || model.includes('o3') || model.includes('o4') || model.includes('openai')) {
    return { name: 'OpenAI', color: '#00A67E', logo: OpenAILogo };
  }
  
  if (model.includes('gemini') || model.includes('google')) {
    return { name: 'Google', color: '#4285F4', logo: GoogleLogo };
  }
  
  if (model.includes('grok') || model.includes('xai')) {
    return {
      name: 'xAI',
      color: '#000000',
      logo: XAILogo
    };
  }
  
  if (model.includes('groq') && !model.includes('llama')) {
    return {
      name: 'Groq',
      color: '#FFA500',
      logo: GroqLogo
    };
  }
  
  if (model.includes('deepseek')) {
    return { name: 'DeepSeek', color: '#1E40AF', logo: DeepSeekLogo };
  }
  
  if (model.includes('mistral') || model.includes('codestral') || model.includes('magistral')) {
    return { name: 'Mistral', color: '#FF7000', logo: MistralLogo };
  }
  
  if (model.includes('palmyra') || model.includes('writer')) {
    return { name: 'Writer', color: '#00D4AA', logo: WriterLogo };
  }

  if (model.includes('llama')) {
    return { name: 'Meta', color: '#1877F2', logo: MetaLogo };
  }

  return { name: 'Unknown', color: '#888888', logo: UnknownLogo };
};