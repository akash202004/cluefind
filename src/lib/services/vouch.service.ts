import { db } from "@/lib/db";

export class VouchService {
  async listByProfile(profileId: string, limit = 20) {
    const vouches = await db.vouch.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        voucher: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });
    const count = await db.vouch.count({ where: { profileId } });
    return { vouches, count };
  }

  async hasVouched(profileId: string, voucherId: string) {
    const existing = await db.vouch.findUnique({ where: { profileId_voucherId: { profileId, voucherId } } });
    return !!existing;
  }

  private getDayKey(date = new Date()) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async checkAndIncrementDailyLimit(voucherId: string, maxPerDay = 10) {
    const dayKey = this.getDayKey();
    const record = await db.vouchAction.upsert({
      where: { voucherId_dayKey: { voucherId, dayKey } },
      update: { count: { increment: 1 } },
      create: { voucherId, dayKey, count: 1 },
    });
    if (record.count > maxPerDay) {
      // revert increment
      await db.vouchAction.update({ where: { voucherId_dayKey: { voucherId, dayKey } }, data: { count: { decrement: 1 } } });
      throw new Error("Daily vouch limit reached (10)");
    }
  }

  async create(profileId: string, voucherId: string, data: { skill?: string; message?: string }) {
    // Prevent self-vouch
    const profile = await db.profile.findUnique({ where: { id: profileId }, select: { userId: true } });
    if (!profile) throw new Error("Profile not found");
    if (profile.userId === voucherId) throw new Error("You cannot vouch for yourself");

    // Ensure not already vouched
    const already = await this.hasVouched(profileId, voucherId);
    if (already) throw new Error("You already vouched for this user");

    // Rate-limit by day
    await this.checkAndIncrementDailyLimit(voucherId);

    const vouch = await db.vouch.create({
      data: {
        profileId,
        voucherId,
        skill: data.skill,
        message: data.message,
      },
    });
    return vouch;
  }

  async delete(profileId: string, voucherId: string) {
    // Ensure exists
    const existing = await db.vouch.findUnique({ where: { profileId_voucherId: { profileId, voucherId } } });
    if (!existing) throw new Error("You haven't vouched this user");
    await db.vouch.delete({ where: { id: existing.id } });
    return { message: "Vouch removed" };
  }
}


