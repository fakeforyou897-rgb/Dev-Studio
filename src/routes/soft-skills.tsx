import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SoftSkillView } from "@/components/soft-skills/soft-skill-view";
import { PageHeader, PageContainer, TabNav } from "@/components/layout";
import { MessageCircle, Users, Lightbulb, Clock, Target, Sparkles } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  tab: z
    .enum(["communication", "leadership", "problem-solving", "teamwork", "time", "growth"])
    .optional()
    .default("communication"),
});

const SOFT_TABS = [
  { id: "communication", label: "Communication", icon: MessageCircle },
  { id: "leadership", label: "Leadership", icon: Users },
  { id: "problem-solving", label: "Problem Solving", icon: Lightbulb },
  { id: "teamwork", label: "Teamwork", icon: Target },
  { id: "time", label: "Time Management", icon: Clock },
  { id: "growth", label: "Growth Mindset", icon: Sparkles },
] as const;

export const Route = createFileRoute("/soft-skills")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Soft Skills Hub — Dev Studio" },
      {
        name: "description",
        content: "Master communication, leadership, and human engineering with our unified hub.",
      },
    ],
  }),
  component: SoftSkillsPage,
});

function SoftSkillsPage() {
  const { tab } = useSearch({ from: "/soft-skills" });
  const navigate = Route.useNavigate();

  return (
    <PageContainer>
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <PageHeader
            title="Communication & Soft Skills"
            description="Master the art of collaboration, leadership, and emotional intelligence."
            className="mb-0 sm:mb-2"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SoftSkillView activeTab={tab} />
      </div>
    </PageContainer>
  );
}
