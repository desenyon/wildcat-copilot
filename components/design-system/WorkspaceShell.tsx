"use client";

import { type ReactNode, useState } from "react";
import { NavRail } from "@/components/design-system/NavRail";
import { TopContextBar } from "@/components/design-system/TopContextBar";
import { EvidencePanel } from "@/components/sources/SourceTracePanel";
import { CourseSwitcher } from "@/components/courses/CourseSwitcher";
import { Button } from "@/components/design-system/Button";

const placeholderCourses = [
  { id: "course-1", name: "Introduction to Biology" },
  { id: "course-2", name: "AP English Language" },
];

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(placeholderCourses[0].id);

  return (
    <div className="flex h-dvh flex-col">
      <div className="flex min-h-0 flex-1">
        <div className="hidden md:flex">
          <NavRail />
        </div>
        {navOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <NavRail />
            <button
              aria-label="Close navigation"
              className="bg-ink/40 flex-1"
              onClick={() => setNavOpen(false)}
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopContextBar
            courseSwitcher={
              <CourseSwitcher
                courses={placeholderCourses}
                activeCourseId={activeCourseId}
                onSelect={setActiveCourseId}
              />
            }
            saveState="saved"
            actions={
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setNavOpen(true)}
                  aria-label="Open navigation"
                >
                  Menu
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setEvidenceOpen(true)}
                  aria-label="Open evidence panel"
                >
                  Evidence
                </Button>
              </>
            }
          />
          <main className="bg-canvas min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>

        <div className="hidden lg:flex">
          <EvidencePanel>
            <p className="text-muted text-sm">Select an artifact section to see its sources.</p>
          </EvidencePanel>
        </div>
        {evidenceOpen && (
          <div className="fixed inset-0 z-40 flex justify-end lg:hidden">
            <button
              aria-label="Close evidence panel"
              className="bg-ink/40 flex-1"
              onClick={() => setEvidenceOpen(false)}
            />
            <EvidencePanel>
              <p className="text-muted text-sm">Select an artifact section to see its sources.</p>
            </EvidencePanel>
          </div>
        )}
      </div>
    </div>
  );
}
