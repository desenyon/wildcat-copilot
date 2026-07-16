import { NextResponse } from "next/server";
import {
  ForbiddenError,
  requireActor,
  requireCourseAccess,
  UnauthenticatedError,
} from "@/lib/auth/authorization";

/**
 * Exports a course's own metadata as JSON (AGENTS.md T1.1.4 "Export course
 * data"). Document/artifact export ships alongside those features in
 * M1.2/M1.8; for now this covers the course record itself.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;

  let actor;
  try {
    actor = await requireActor();
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    throw error;
  }

  let course;
  try {
    course = await requireCourseAccess(courseId, actor);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    course: {
      id: course.id,
      name: course.name,
      subject: course.subject,
      gradeBand: course.gradeBand,
      academicTerm: course.academicTerm,
      description: course.description,
      defaultClassDurationMinutes: course.defaultClassDurationMinutes,
      status: course.status,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    },
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "content-type": "application/json",
      "content-disposition": `attachment; filename="${course.name.replace(/[^a-z0-9-_]+/gi, "-")}-export.json"`,
    },
  });
}
