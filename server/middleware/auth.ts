import type { Request, Response } from "express";

export function getUserId(req: Request): string | null {
  const id = req.headers["x-replit-user-id"];
  return id ? String(id) : null;
}

export function requireUser(req: Request, res: Response): string | null {
  const id = getUserId(req);
  if (!id) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return id;
}

export function stripDates(data: Record<string, unknown>): Record<string, unknown> {
  const { createdAt, updatedAt, created_at, updated_at, ...rest } = data;
  void createdAt;
  void updatedAt;
  void created_at;
  void updated_at;
  return rest;
}

export function isUUID(id: unknown): id is string {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
}
