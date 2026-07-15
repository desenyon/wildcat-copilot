import { type ReactNode } from "react";
import { WorkspaceShell } from "@/components/design-system/WorkspaceShell";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
