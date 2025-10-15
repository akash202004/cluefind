import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";

/**
 * GET /api/leaderboard
 * Fetch all developer profiles for the leaderboard
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const userService = new UserService();
    const result = await userService.getAllDeveloperProfiles(page, limit);

    // Transform the data to include only necessary fields
    const students = result.students.map((student) => ({
      id: student.id,
      username: student.username,
      name: student.name,
      bio: student.bio,
      image: student.image,
      skills: student.profile?.skills || [],
      vouchCount: student.profile?._count.vouches || 0,
      createdAt: student.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: students,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

