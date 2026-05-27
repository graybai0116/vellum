import { WorkspaceApp } from "@/components/workspace/WorkspaceApp";

export const metadata = {
  title: "VELLUM — Workspace",
};

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ screen?: string }>;
}) {
  const { screen } = await searchParams;
  const initialScreen = screen === "library" || screen === "history" ? screen : "landing";
  return <WorkspaceApp initialScreen={initialScreen} />;
}
