import { Table } from "@/components/design-system";

export interface DocumentListRow {
  id: string;
  title: string;
  documentType: string;
  processingStatus: "pending" | "processing" | "processed" | "failed";
  processingErrorCode: string | null;
  createdAt: Date;
}

const STATUS_LABEL: Record<DocumentListRow["processingStatus"], string> = {
  pending: "Pending",
  processing: "Processing…",
  processed: "Processed",
  failed: "Failed",
};

const STATUS_COLOR: Record<DocumentListRow["processingStatus"], string> = {
  pending: "text-muted",
  processing: "text-accent",
  processed: "text-success",
  failed: "text-danger",
};

export function DocumentList({ documents }: { documents: DocumentListRow[] }) {
  return (
    <Table
      caption="Course documents"
      rowKey={(row) => row.id}
      rows={documents}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        {
          key: "type",
          header: "Type",
          render: (row) => row.documentType.replace(/_/g, " "),
        },
        {
          key: "status",
          header: "Status",
          render: (row) => (
            <span
              className={STATUS_COLOR[row.processingStatus]}
              title={row.processingErrorCode ?? undefined}
            >
              {STATUS_LABEL[row.processingStatus]}
            </span>
          ),
        },
        {
          key: "uploaded",
          header: "Uploaded",
          render: (row) =>
            new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(row.createdAt),
        },
      ]}
    />
  );
}
