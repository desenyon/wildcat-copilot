import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { fixtureCourse } from "@/tests/fixtures/course";

function CourseName({ name }: { name: string }) {
  return <span>{name}</span>;
}

describe("test infrastructure", () => {
  it("renders a component with a deterministic fixture", () => {
    render(<CourseName name={fixtureCourse.name} />);
    expect(screen.getByText(fixtureCourse.name)).toBeInTheDocument();
  });
});
