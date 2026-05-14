import { useState, useMemo } from "react";
import {
  Search,
  ChevronRight,
  Sparkles,
  Globe,
  Server,
  Database,
  Container,
  Layout,
  Cpu,
  Plus,
} from "lucide-react";
import { SplitLayout } from "../layout";
import { Input } from "@/components/ui/input";
import { useForge } from "@/lib/store";
import { QAEditorDialog } from "./qa-editor-dialog";
import type { FocusArea } from "@/types/common";
import type { InterviewQuestion } from "@/types/skills";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const DOMAINS = [
  { id: "frontend", label: "Frontend", icon: Globe },
  { id: "backend", label: "Backend", icon: Server },
  { id: "database", label: "Database", icon: Database },
  { id: "devops", label: "DevOps", icon: Container },
  { id: "architecture", label: "Architecture", icon: Layout },
  { id: "core", label: "Core CS", icon: Cpu },
];

export function QuestionList() {
  const { interviewQuestions, deleteInterviewQuestion, toggleFavoriteInterviewQuestion } = useForge();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>("frontend");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<InterviewQuestion | null>(null);

  const filtered = useMemo(() => {
    return interviewQuestions.filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.answer.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = !difficulty || q.difficulty === difficulty;
      const matchesDomain = q.area === domain || q.category === domain;
      return matchesSearch && matchesDifficulty && matchesDomain;
    });
  }, [interviewQuestions, search, difficulty, domain]);

  const handleAdd = () => {
    setEditingQ(null);
    setDialogOpen(true);
  };

  const handleEdit = (q: InterviewQuestion) => {
    setEditingQ(q);
    setDialogOpen(true);
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(difficulty === d ? null : d)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border transition-all ${
                difficulty === d
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-none p-2 space-y-1">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-3 py-2">
          Domains
        </h4>
        {DOMAINS.map((d) => {
          const Icon = d.icon;
          const active = domain === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setDomain(d.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {d.label}
              </div>
              {active && <ChevronRight className="size-3.5" />}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <button 
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-4" /> Add Question
        </button>
      </div>
    </div>
  );

  return (
    <>
      <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[280px]" className="border-t border-border">
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {filtered.length} Questions Found
              </h3>
            </div>
            {filtered.map((q) => (
              <article
                key={q.id}
                className="group rounded-xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-primary/10 text-primary`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {DOMAINS.find((d) => d.id === q.area || d.id === q.category)?.label || q.area}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                        {q.question}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(q)}
                        className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed border border-border/50">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-primary/70">
                      <Sparkles className="size-3" /> Sample Answer
                    </div>
                    {q.answer}
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border">
                <Search className="size-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-sm text-muted-foreground">
                  No questions found matching your criteria.
                </p>
                <button 
                  onClick={handleAdd}
                  className="mt-4 text-xs text-primary hover:underline"
                >
                  Add the first question for this domain
                </button>
              </div>
            )}
          </div>
        </div>
      </SplitLayout>
      
      <QAEditorDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editingQ}
        defaultArea={domain as FocusArea}
      />
    </>
  );
}
