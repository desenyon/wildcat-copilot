import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { WorkspaceShell } from "@/components/design-system/WorkspaceShell";
import { NotInvitedError, requireActor, UnauthenticatedError } from "@/lib/auth/authorization";
import { listCoursesForActor } from "@/lib/courses/queries";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  let actor;
  try {
    actor = await requireActor();
  } catch (error) {
    if (error instanceof NotInvitedError) redirect("/not-invited");
    if (error instanceof UnauthenticatedError) redirect("/sign-in");
    throw error;
  }

  const courses = await listCoursesForActor(actor);

  return (
    <WorkspaceShell courses={courses.map((course) => ({ id: course.id, name: course.name }))}>
      {children}
    </WorkspaceShell>
  );
}
