import { Button } from '@/components/ui/button';
import { GithubIcon } from 'lucide-react';

export default function GitHubMcqButton() {
  const handleClick = () => {
    window.open('https://github.com/pranam-gf/CFA_MCQ_REPRODUCER', '_blank');
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      className="animate-rainbow before:animate-rainbow group text-foreground ring-offset-background focus-visible:ring-ring relative inline-flex h-10 cursor-pointer items-center justify-center rounded-md border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors transition-transform duration-200 [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))]"
    >
      <div className="flex items-center">
        <GithubIcon className="h-4 w-4 text-black dark:text-white" />
        <span className="ml-2 text-black dark:text-white">MCQ Repo</span>
      </div>
    </Button>
  );
}