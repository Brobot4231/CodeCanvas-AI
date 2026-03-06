"use client";

import { useState } from "react";
import { 
  Code2, 
  Search, 
  Zap, 
  Download, 
  Trash2, 
  Copy, 
  FileCode, 
  Sparkles, 
  RotateCcw,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { codeReviewAnalysis, type CodeReviewAnalysisOutput } from "@/ai/flows/code-review-analysis";
import { codeOptimizationSuggestion } from "@/ai/flows/code-optimization-suggestion";
import { CodeViewPanel } from "@/components/code-view-panel";
import { ReviewReport } from "@/components/review-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { generateCodeAnalysisPDF } from "@/lib/pdf-generator";

export default function CodeCanvasHome() {
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [analysis, setAnalysis] = useState<CodeReviewAnalysisOutput | null>(null);
  const [optimizedCode, setOptimizedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: "Empty Input",
        description: "Please paste or type some code to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setOptimizedCode(null);

    try {
      const result = await codeReviewAnalysis({ code });
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Your code review is ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!analysis || !code) return;

    setIsOptimizing(true);
    try {
      const result = await codeOptimizationSuggestion({
        originalCode: code,
        codeReview: JSON.stringify(analysis.review),
      });
      setOptimizedCode(result.optimizedCode);
      toast({
        title: "Optimization Complete",
        description: "AI has refactored your code for better performance.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateCodeAnalysisPDF(code, analysis, optimizedCode);
      toast({
        title: "Success",
        description: "PDF report downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard.",
    });
  };

  const clearAll = () => {
    setCode("");
    setAnalysis(null);
    setOptimizedCode(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Header */}
      <header className="no-print sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-primary/5 animate-fade-in-down">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-primary to-primary/75 p-2 rounded-lg shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-headline font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent hover:from-accent hover:to-primary transition-all duration-500">
              CodeCanvas AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              className="hidden sm:flex items-center gap-2 hover:bg-primary/10 hover:text-primary border-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <Trash2 className="h-4 w-4" />
              Reset
            </Button>
            {analysis && (
              <Button 
                size="sm" 
                onClick={handleDownloadPDF} 
                disabled={isDownloading}
                className="flex items-center gap-2 bg-gradient-to-r from-accent to-cyan-400 text-accent-foreground hover:shadow-lg hover:shadow-accent/50 hover:scale-105 transition-all duration-300 font-semibold"
              >
                {isDownloading ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Report
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 space-y-8">
        {/* Intro Section - Hide if analyzing/analyzed */}
        {!analysis && !isAnalyzing && (
          <div className="no-print space-y-6 max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tight">
                Review and <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent animate-gradient-shift">Optimize</span> Your Code
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get detailed analysis, pros, cons, and optimized refactoring suggestions from an AI expert in seconds.
            </p>
          </div>
        )}

        <div className={`grid gap-6 h-full min-h-[600px] ${analysis ? 'grid-cols-1 lg:grid-cols-12' : 'place-items-center'}`}>
          {/* Input Panel */}
          <div className={`no-print flex flex-col gap-4 animate-bounce-in ${analysis ? 'lg:col-span-4 w-full' : 'w-full max-w-3xl'}`}>
            <div className="flex flex-col h-full bg-gradient-to-br from-card to-card/80 rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden hover:border-primary/40 hover:shadow-primary/20 transition-all duration-500">
              <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 bg-gradient-to-r from-muted/30 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <FileCode className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Input Source Code</span>
                </div>
                {code && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(code)}
                    className="h-8 w-8 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="relative flex-1 group">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here (JavaScript, Python, C++, Java, etc.)..."
                  className="w-full h-full min-h-[400px] p-6 font-code text-sm resize-none focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-50 border-none bg-transparent transition-all duration-300"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-muted/20 to-transparent border-t border-primary/10">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !code.trim()}
                  className="w-full h-12 text-md font-semibold bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-400 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Analyse Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          {(analysis || isAnalyzing) && (
            <div className="lg:col-span-7 lg:flex flex-col gap-6 animate-slide-in-left">
              <Tabs defaultValue="review" className="w-full h-full flex flex-col">
                <div className="no-print flex items-center justify-between mb-4 gap-4">
                  <TabsList className="grid grid-cols-2 w-[300px] h-11 bg-muted/40">
                    <TabsTrigger value="review" className="flex items-center gap-2 h-9 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500">
                      <Search className="h-4 w-4" /> Review
                    </TabsTrigger>
                    <TabsTrigger value="optimized" className="flex items-center gap-2 h-9 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-cyan-400" disabled={!analysis && !isOptimizing}>
                      <Zap className="h-4 w-4" /> Optimized
                    </TabsTrigger>
                  </TabsList>
                  
                  {analysis && !optimizedCode && (
                    <Button 
                      variant="outline" 
                      onClick={handleOptimize} 
                      disabled={isOptimizing}
                      className="border-accent/50 text-accent hover:bg-accent/20 hover:border-accent h-11 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-semibold"
                    >
                      {isOptimizing ? <RotateCcw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      Optimize Code
                    </Button>
                  )}
                </div>

                <TabsContent value="review" className="flex-1 focus-visible:ring-0">
                  <div className="bg-gradient-to-br from-card to-card/80 rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10 h-full p-8 space-y-6 overflow-auto hover:border-primary/40 transition-all duration-500">
                    {isAnalyzing ? (
                      <div className="space-y-4 animate-pulse">
                        <Skeleton className="h-10 w-48 rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                          <Skeleton className="h-48 w-full rounded-lg" />
                          <Skeleton className="h-48 w-full rounded-lg" />
                        </div>
                        <Skeleton className="h-24 w-full rounded-lg" />
                      </div>
                    ) : analysis ? (
                      <div className="animate-fade-in">
                        <ReviewReport report={analysis.review} />
                      </div>
                    ) : null}
                  </div>
                </TabsContent>

                <TabsContent value="optimized" className="flex-1 focus-visible:ring-0 h-full">
                  <div className="h-full flex flex-col">
                    {isOptimizing ? (
                      <div className="bg-gradient-to-br from-card to-card/80 rounded-2xl border border-accent/20 shadow-2xl shadow-accent/10 p-8 space-y-4 h-full animate-pulse">
                        <Skeleton className="h-10 w-64 rounded-lg" />
                        <Skeleton className="h-full w-full rounded-lg" />
                      </div>
                    ) : optimizedCode ? (
                      <div className="flex flex-col h-full bg-gradient-to-br from-card to-card/80 rounded-2xl border border-accent/20 shadow-2xl shadow-accent/10 overflow-hidden hover:border-accent/40 hover:shadow-accent/20 transition-all duration-500 animate-fade-in">
                        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-accent/10 bg-gradient-to-r from-muted/30 to-transparent">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/20">
                              <Zap className="h-5 w-5 text-accent" />
                            </div>
                            <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Optimized Version</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleCopy(optimizedCode)}
                              className="h-8 w-8 hover:bg-accent/20 hover:text-accent transition-all duration-300"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1 overflow-auto p-8 font-code text-sm leading-relaxed text-cyan-50 bg-[#1e2227]">
                          <pre className="whitespace-pre-wrap break-all">
                            <code>{optimizedCode}</code>
                          </pre>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>

      {/* Print-only layout for PDF generation */}
      <div className="print-only p-8 space-y-10">
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold">CodeCanvas AI Analysis Report</h1>
          <p className="text-muted-foreground">Detailed Code Review and Optimization Summary</p>
        </div>
        
        <section className="print-card p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Original Source Code</h2>
          <pre className="bg-muted p-4 rounded text-xs overflow-hidden font-code">
            {code}
          </pre>
        </section>

        {analysis && (
          <section className="print-card p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Analysis Review</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm uppercase">Summary</h3>
                <p className="text-sm">{analysis.review.overallSummary}</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-sm uppercase text-emerald-600">Pros</h3>
                  <ul className="list-disc pl-5 text-xs">
                    {analysis.review.pros.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase text-red-600">Cons</h3>
                  <ul className="list-disc pl-5 text-xs">
                    {analysis.review.cons.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {optimizedCode && (
          <section className="print-card p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">AI Optimized Version</h2>
            <pre className="bg-muted p-4 rounded text-xs overflow-hidden font-code">
              {optimizedCode}
            </pre>
          </section>
        )}

        <footer className="text-center text-[10px] text-muted-foreground pt-10">
          Generated by CodeCanvas AI Platform &copy; {new Date().getFullYear()}
        </footer>
      </div>

      <footer className="no-print border-t border-primary/10 py-8 bg-gradient-to-b from-muted/20 to-background shadow-lg shadow-primary/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p className="hover:text-primary transition-colors duration-300">© {new Date().getFullYear()} CodeCanvas AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary hover:scale-110 transition-all duration-300">Documentation</a>
            <a href="#" className="hover:text-primary hover:scale-110 transition-all duration-300">Privacy</a>
            <a href="#" className="hover:text-primary hover:scale-110 transition-all duration-300">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
