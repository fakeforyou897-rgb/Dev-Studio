import { SkillArea } from "@/components/tech-skills/skill-area";
import { SOFT_SKILLS_DATA } from "@/data/skills";

export function SoftSkillView({ activeTab }: { activeTab?: string }) {
  return <SkillArea data={SOFT_SKILLS_DATA} activeSubArea={activeTab} hideSubAreaNav={true} />;
}
