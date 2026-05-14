import { useRouterState, useSearch } from "@tanstack/react-router";
import { Globe, Server, Container, FlaskConical, Database, Heart } from "lucide-react";
import { TabNav } from "../layout";

const TABS = [
  {
    to: "/tech-skills",
    search: { tab: "frontend" },
    label: "Frontend",
    icon: Globe,
    id: "frontend",
  },
  { to: "/tech-skills", search: { tab: "backend" }, label: "Backend", icon: Server, id: "backend" },
  { to: "/tech-skills", search: { tab: "devops" }, label: "DevOps", icon: Container, id: "devops" },
  {
    to: "/tech-skills",
    search: { tab: "testing" },
    label: "Testing",
    icon: FlaskConical,
    id: "testing",
  },
  {
    to: "/tech-skills",
    search: { tab: "database" },
    label: "Database",
    icon: Database,
    id: "database",
  },
] as const;

export function SkillTabs() {
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const currentTab = searchParams.tab || "frontend";

  return (
    <TabNav
      tabs={TABS.map((t) => ({
        ...t,
        to: t.to as string,
        search: t.search as Record<string, unknown>,
      }))}
      activeTab={currentTab}
    />
  );
}
