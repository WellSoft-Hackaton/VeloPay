import { db } from "@/lib/db";
import { bills } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateBillInput = {
  userId: string;
  name: string;
  amount: string;
  dueDate: string;
};

// ── Queries (cached) ──────────────────────────────────────
export const getBillsByUser = unstable_cache(
  async (userId: string) => {
    return db.select().from(bills).where(eq(bills.userId, userId));
  },
  ["bills-by-user"],
  { tags: ["bills"], revalidate: 60 }
);

export const getBillById = unstable_cache(
  async (id: string) => {
    const rows = await db.select().from(bills).where(eq(bills.id, id));
    return rows[0] ?? null;
  },
  ["bill-by-id"],
  { tags: ["bills"], revalidate: 60 }
);

// ── Mutations ─────────────────────────────────────────────
export async function createBill(input: CreateBillInput) {
  const [row] = await db.insert(bills).values({
    userId: input.userId,
    name: input.name,
    amount: input.amount,
    dueDate: input.dueDate,
    paid: false,
  }).returning();
  return row;
}

export async function markBillPaid(id: string) {
  const [row] = await db.update(bills)
    .set({ paid: true })
    .where(eq(bills.id, id))
    .returning();
  return row;
}

export async function deleteBill(id: string) {
  const [row] = await db.delete(bills)
    .where(eq(bills.id, id))
    .returning();
  return row;
}
