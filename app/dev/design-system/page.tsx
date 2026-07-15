"use client";

import { useState } from "react";
import {
  Button,
  ConfirmDialog,
  Dialog,
  EditorialHeader,
  EmptyState,
  Input,
  LoadingState,
  MetricPanel,
  Notice,
  Panel,
  Select,
  Table,
  Tabs,
} from "@/components/design-system";

const sampleRows = [
  { id: "1", name: "Photosynthesis Lab Report", type: "Assessment" },
  { id: "2", name: "Unit 3 Syllabus", type: "Syllabus" },
];

export default function DesignSystemPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
      <EditorialHeader
        eyebrow="Internal"
        title="Design system"
        description="Visual reference for AGENTS.md §3.8 core components. Not part of the teacher-facing product."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricPanel label="Weekly active teachers" value="3" caption="Pilot cohort" />
        <MetricPanel label="Packs generated" value="12" />
        <MetricPanel label="Minutes saved" value="540" />
        <MetricPanel label="Citation coverage" value="94%" />
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button disabled>Disabled</Button>
      </section>

      <section className="grid max-w-md gap-4">
        <Input
          label="Course name"
          placeholder="Introduction to Biology"
          hint="Shown to students."
        />
        <Input label="Required field" placeholder="…" error="This field is required." />
        <Select
          label="Grade band"
          options={[
            { value: "9-10", label: "9–10" },
            { value: "11-12", label: "11–12" },
          ]}
        />
      </section>

      <section className="flex flex-wrap gap-3">
        <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete course…
        </Button>
      </section>
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Regenerate section"
        description="This will create a new artifact version."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Regenerate</Button>
          </>
        }
      >
        <p className="text-muted text-sm">Existing edits outside this section are preserved.</p>
      </Dialog>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete course?"
        description="This permanently removes the course and its documents per the retention policy."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {}}
      />

      <section>
        <Tabs
          items={[
            {
              value: "documents",
              label: "Documents",
              content: (
                <Table
                  columns={[
                    { key: "name", header: "Title", render: (r) => r.name },
                    { key: "type", header: "Type", render: (r) => r.type },
                  ]}
                  rows={sampleRows}
                  rowKey={(r) => r.id}
                  caption="Course documents"
                />
              ),
            },
            {
              value: "empty",
              label: "Empty example",
              content: (
                <EmptyState
                  title="No artifacts yet"
                  description="Generate a weekly course pack to see artifacts here."
                />
              ),
            },
            {
              value: "loading",
              label: "Loading example",
              content: <LoadingState label="Generating pack" />,
            },
          ]}
        />
      </section>

      <section className="grid gap-3">
        <Notice variant="info" title="Model suggestion">
          This section has weak source support — review before approving.
        </Notice>
        <Notice variant="success" title="Exported">
          Rubric exported to DOCX.
        </Notice>
        <Notice variant="warning" title="Low confidence">
          Course profile field inferred from a single document.
        </Notice>
        <Notice variant="danger" title="Generation failed">
          Retry or contact support.
        </Notice>
      </section>

      <Panel>
        <p className="text-ink text-sm">Standard white document surface (Panel).</p>
      </Panel>
    </div>
  );
}
