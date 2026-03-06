import { cn } from "@/lib/utils";

interface CodeViewPanelProps {
  title: string;
  code: string;
  className?: string;
  icon?: React.ReactNode;
}

export function CodeViewPanel({ title, code, className, icon }: CodeViewPanelProps) {
  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-br from-card to-card/80 rounded-2xl border border-primary/20 overflow-hidden shadow-2xl shadow-primary/10 hover:border-primary/40 hover:shadow-primary/20 transition-all duration-500 animate-fade-in", className)}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-primary/10 bg-gradient-to-r from-muted/30 to-transparent">
        <div className="p-2 rounded-lg bg-primary/20">
          {icon}
        </div>
        <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto p-6 font-code text-sm leading-relaxed text-blue-100 bg-[#1e2227] hover:text-blue-50 transition-colors duration-300">
        <pre className="whitespace-pre-wrap break-all">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
