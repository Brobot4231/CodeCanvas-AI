import { CheckCircle2, AlertCircle, Sparkles, LayoutPanelLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CodeReviewAnalysisOutput } from "@/ai/flows/code-review-analysis";

interface ReviewReportProps {
  report: CodeReviewAnalysisOutput["review"];
}

export function ReviewReport({ report }: ReviewReportProps) {
  return (
    <div className="space-y-8">
      <Card className="border-accent/30 bg-gradient-to-r from-accent/10 to-cyan-500/5 shadow-lg shadow-accent/20 hover:border-accent/50 hover:shadow-accent/30 transition-all duration-500 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-3 text-accent font-bold">
            <div className="p-2 rounded-lg bg-accent/20">
              <Sparkles className="h-5 w-5" />
            </div>
            Overall Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground animate-fade-in">
            {report.overallSummary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h4 className="text-sm font-bold uppercase flex items-center gap-2 text-emerald-400">
            <div className="p-1 rounded bg-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            Pros
          </h4>
          <ul className="space-y-3">
            {report.pros.map((pro, i) => (
              <li 
                key={i} 
                className="text-sm flex gap-3 text-muted-foreground bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 p-3 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/15 transition-all duration-300 cursor-default group"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <span className="text-emerald-500 font-bold text-lg leading-none mt-0.5 group-hover:scale-125 transition-transform">✓</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h4 className="text-sm font-bold uppercase flex items-center gap-2 text-destructive">
            <div className="p-1 rounded bg-destructive/20">
              <AlertCircle className="h-4 w-4" />
            </div>
            Cons
          </h4>
          <ul className="space-y-3">
            {report.cons.map((con, i) => (
              <li 
                key={i} 
                className="text-sm flex gap-3 text-muted-foreground bg-gradient-to-r from-destructive/10 to-destructive/5 p-3 rounded-lg border border-destructive/20 hover:border-destructive/40 hover:bg-destructive/15 transition-all duration-300 cursor-default group"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <span className="text-destructive font-bold text-lg leading-none mt-0.5 group-hover:scale-125 transition-transform">✕</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h4 className="text-sm font-bold uppercase flex items-center gap-2 text-primary">
          <div className="p-1 rounded bg-primary/20">
            <LayoutPanelLeft className="h-4 w-4" />
          </div>
          Recommended Improvements
        </h4>
        <div className="flex flex-wrap gap-3">
          {report.improvements.map((improvement, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className="px-4 py-2 bg-gradient-to-r from-primary/20 to-blue-500/10 border-primary/40 text-xs text-primary-foreground hover:bg-primary/30 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/30 hover:scale-110 transition-all duration-300 cursor-default font-semibold"
              style={{ animationDelay: `${0.3 + i * 0.05}s` }}
            >
              {improvement}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
