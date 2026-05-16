import { Router } from "express";
import { db } from "../../db/index.js";
import { connectors } from "../../../shared/schema.js";
import { eq, and } from "drizzle-orm";
import { requireUser, stripDates, isUUID } from "../../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  res.json(await db.select().from(connectors).where(eq(connectors.userId, uid)));
});

router.post("/", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { id, ...raw } = req.body;
  const data = stripDates(raw);
  const safeId = isUUID(id) ? id : undefined;
  const existing = safeId ? await db.select().from(connectors).where(and(eq(connectors.id, safeId), eq(connectors.userId, uid))) : [];
  
  if (existing.length > 0) {
    const [r] = await db.update(connectors).set({ ...data, updatedAt: new Date() }).where(eq(connectors.id, safeId!)).returning();
    res.json(r);
  } else {
    const [r] = await db.insert(connectors).values({ ...data, userId: uid, ...(safeId ? { id: safeId } : {}) } as any).returning();
    res.json(r);
  }
});

router.post("/bulk", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const items = req.body as any[];
  if (!items.length) {
    res.json([]);
    return;
  }
  const values = items.map(({ id, ...raw }) => {
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    return { ...data, userId: uid, ...(safeId ? { id: safeId } : {}) } as any;
  });
  const result = await db.insert(connectors).values(values).onConflictDoNothing().returning();
  res.json(result);
});

router.delete("/:id", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  if (!isUUID(req.params.id)) {
    res.json({ ok: true });
    return;
  }
  await db.delete(connectors).where(and(eq(connectors.id, req.params.id), eq(connectors.userId, uid)));
  res.json({ ok: true });
});

export default router;
