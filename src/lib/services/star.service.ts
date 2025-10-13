import { db } from "@/lib/db";

export class StarService {
  async getStarById(id: string) {
    const vouch = await db.vouch.findUnique({ where: { id } });
    if (!vouch) {
      throw new Error("Star not found");
    }
    // Normalize to generic "star" shape expected by route
    return { id: vouch.id, profileId: vouch.profileId };
  }

  async deleteStar(id: string) {
    await db.vouch.delete({ where: { id } });
    return { message: "Star removed" };
  }
}




