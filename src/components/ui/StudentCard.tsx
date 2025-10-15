import Image from "next/image";
import Link from "next/link";
import { User, Github, Star, Heart } from "lucide-react";

interface Student {
  id: string;
  username: string;
  name: string;
  bio?: string;
  image?: string;
  skills: string[];
  vouchCount: number;
  repoCount: number;
}

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="card-brutalist bg-background p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {student.image ? (
            <Image
              src={student.image}
              alt={student.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-lg border-3 border-primary object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-primary rounded-lg border-3 border-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">
                {getInitials(student.name)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Link
                href={`/${student.username}`}
                className="text-lg font-black hover:text-primary transition-colors"
              >
                {student.name}
              </Link>
              <p className="text-sm text-muted-foreground font-bold">
                @{student.username}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span className="font-bold">{student.vouchCount}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Github className="w-4 h-4" />
                <span className="font-bold">{student.repoCount}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {student.bio && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {student.bio}
            </p>
          )}

          {/* Skills */}
          {student.skills && student.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {student.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase rounded border-2 border-primary"
                >
                  {skill}
                </span>
              ))}
              {student.skills.length > 4 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-bold uppercase rounded border-2 border-primary">
                  +{student.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
