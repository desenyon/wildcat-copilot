import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
  className?: string;
}

export function Table<T>({ columns, rows, rowKey, caption, className }: TableProps<T>) {
  return (
    <div className={cn("border-rule overflow-x-auto rounded-sm border", className)}>
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-rule bg-canvas border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="text-muted px-4 py-2 text-left font-medium whitespace-nowrap"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-rule border-b last:border-0">
              {columns.map((column) => (
                <td key={column.key} className="text-ink px-4 py-2">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
