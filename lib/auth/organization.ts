import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { organizations } from "@/lib/db/schema";

function slugForDomain(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Pilot orgs are created lazily, one per email domain. There is no
 * multi-tenant signup flow yet (P-1 only supports the LGHS pilot cohort),
 * so this is the simplest thing that satisfies "every user belongs to an
 * organization" without a manual provisioning step.
 */
export async function getOrCreateOrganizationForEmail(email: string) {
  const db = getDb();
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) throw new Error("Invalid email: missing domain");

  const slug = slugForDomain(domain);
  const existing = await db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
  });
  if (existing) return existing;

  const [created] = await db
    .insert(organizations)
    .values({ name: domain, slug })
    .onConflictDoNothing({ target: organizations.slug })
    .returning();

  if (created) return created;

  // Lost a race with a concurrent sign-in; the row now exists.
  const row = await db.query.organizations.findFirst({ where: eq(organizations.slug, slug) });
  if (!row) throw new Error(`Failed to resolve organization for domain ${domain}`);
  return row;
}
