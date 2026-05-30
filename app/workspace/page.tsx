import { WorkspaceApp } from "@/components/workspace/WorkspaceApp";

export const metadata = {
  title: "VELLUM — Workspace",
};

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ screen?: string; upgraded?: string }>;
}) {
  const { screen, upgraded } = await searchParams;
  const initialScreen = screen === "library" || screen === "history" ? screen : "landing";
  return <WorkspaceApp initialScreen={initialScreen} upgraded={upgraded === "1"} />;
}
