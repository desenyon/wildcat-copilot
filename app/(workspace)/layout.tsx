import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { WorkspaceShell } from "@/components/design-system/WorkspaceShell";
import { NotInvitedError, requireActor, UnauthenticatedError } from "@/lib/auth/authorization";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  try {
    await requireActor();
  } catch (error) {
    if (error instanceof NotInvitedError) redirect("/not-invited");
    if (error instanceof UnauthenticatedError) redirect("/sign-in");
    throw error;
  }

  return <WorkspaceShell>{children}</WorkspaceShell>;
}
