"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  User,
  ArrowRight,
  Check,
} from "lucide-react";
import ImageUpload from "@/components/forms/ImageUpload";
import ClientOnly from "@/components/ui/ClientOnly";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingData {
  profileImage: string | null;
  username: string;
  bio: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, hasProfile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profileImage: null,
    username: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  // Check authentication and profile status
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/get-started");
      return;
    }

    if (hasProfile === true) {
      router.push("/dashboard");
      return;
    }
  }, [user, hasProfile, authLoading, router]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (!user?.googleId) {
        throw new Error("No authenticated user");
      }

      // Validate required fields
      if (
        !onboardingData.profileImage ||
        !onboardingData.username ||
        !onboardingData.bio
      ) {
        throw new Error("All fields are required");
      }

      // Create user and profile in Prisma database
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileImage: onboardingData.profileImage,
          username: onboardingData.username,
          bio: onboardingData.bio,
          googleId: user.googleId,
          name: user.name || onboardingData.username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to complete onboarding");
      }

      const result = await response.json();
      console.log("Onboarding completed:", result);

      // Refresh the profile status to update hasProfile
      await refreshProfile();

      // Add a small delay to ensure the database transaction is complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      alert(`Failed to complete onboarding: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateData = (field: keyof OnboardingData, value: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return onboardingData.profileImage !== null;
      case 2:
        return onboardingData.username.length > 0;
      case 3:
        return onboardingData.bio.length > 0;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ClientOnly>
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="text-center mb-8">
          <h1 className="text-section mb-2">Welcome to DevSync!</h1>
          <p className="text-subtitle">
            Let&apos;s set up your developer portfolio in just a few steps
          </p>
        </div>

        {/* Step Content */}
        <div className="card-brutalist mb-8">
          {currentStep === 1 && (
            <ProfileImageStep
              data={onboardingData.profileImage}
              onUpdate={(value) => updateData("profileImage", value)}
            />
          )}

          {currentStep === 2 && (
            <UsernameStep
              data={onboardingData.username}
              onUpdate={(value) => updateData("username", value)}
            />
          )}

          {currentStep === 3 && (
            <BioStep
              data={onboardingData.bio}
              onUpdate={(value) => updateData("bio", value)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full border-2 ${
                  step === currentStep
                    ? "bg-accent border-accent"
                    : step < currentStep
                    ? "bg-feature-green border-feature-green"
                    : "bg-muted border-primary"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isStepComplete(currentStep)}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 3 ? "Complete Setup" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </ClientOnly>
  );
}

// Helper function to extract skills from resume
function extractSkillsFromResume(resumeContent: string): string[] {
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "C#",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "SASS",
    "SCSS",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git",
    "GitHub",
    "GitLab",
    "CI/CD",
    "REST API",
    "GraphQL",
    "Microservices",
    "Agile",
    "Scrum",
    "DevOps",
    "Linux",
    "Windows",
    "macOS",
    "Vue.js",
    "Angular",
    "Express.js",
    "FastAPI",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
    "Symfony",
    "Ruby on Rails",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "PHP",
    "Ruby",
    "Scala",
    "Elixir",
    "Clojure",
    "Haskell",
    "F#",
    "OCaml",
  ];

  const skills: string[] = [];
  const content = resumeContent.toLowerCase();

  for (const skill of commonSkills) {
    if (content.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  }

  return skills.slice(0, 10); // Limit to 10 skills
}

// Step 1: Profile Image Upload
function ProfileImageStep({
  data,
  onUpdate,
}: {
  data: string | null;
  onUpdate: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (!user?.googleId) {
        throw new Error("No authenticated user");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("File must be an image (JPEG, PNG, WebP, or GIF)");
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be less than 5MB");
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      // Upload using our new API
      const formData = new FormData();
      formData.append("image", file);
      if (user?.id) {
        formData.append("userId", user.id);
      }

      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUpdate(data.imageUrl);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="icon-box-purple mx-auto mb-6">
        <Upload className="w-8 h-8 text-primary" />
      </div>

      <h2 className="text-xl font-black uppercase tracking-wide mb-4">
        Upload Profile Picture
      </h2>

      <p className="text-body mb-6">
        Add a professional profile picture to make your portfolio stand out
      </p>

      <div className="space-y-4">
        {data ? (
          <div className="w-32 h-32 mx-auto border-4 border-primary rounded-lg overflow-hidden shadow-brutalist-lg">
            <Image
              src={data}
              alt="Profile"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 mx-auto bg-muted border-4 border-primary rounded-lg shadow-brutalist-lg flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
            id="profile-image"
          />
          <label
            htmlFor="profile-image"
            className="btn-outline cursor-pointer disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Choose Image"}
          </label>
        </div>
      </div>
    </div>
  );
}

// Step 2: Username Setup
function UsernameStep({
  data,
  onUpdate,
}: {
  data: string;
  onUpdate: (value: string) => void;
}) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch("/api/onboarding/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const { available } = await response.json();
        setIsAvailable(available);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    onUpdate(value);
    checkUsername(value);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="icon-box-blue mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-xl font-black uppercase tracking-wide mb-4">
          Choose Your Username
        </h2>

        <p className="text-body mb-6">
          This will be your unique URL: devsync.com/yourusername
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              value={data}
              onChange={handleUsernameChange}
              placeholder="yourusername"
              className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 pr-12"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                fontWeight: "700",
                fontSize: "16px",
              }}
            />
            {isChecking && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {isAvailable === true && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Check className="w-4 h-4 text-feature-green" />
              </div>
            )}
          </div>

          {data && (
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">
                Your profile will be:{" "}
              </span>
              <span className="font-bold text-accent">devsync.com/{data}</span>
            </div>
          )}

          {isAvailable === false && (
            <div className="mt-2 text-sm text-feature-red font-bold">
              Username is already taken
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 3: Bio
function BioStep({
  data,
  onUpdate,
}: {
  data: string;
  onUpdate: (value: string) => void;
}) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="icon-box-yellow mx-auto mb-4"></div>
        <h2 className="text-xl font-black uppercase tracking-wide mb-4">Write a short bio</h2>
        <p className="text-body mb-6">Tell visitors a little about yourself and your work.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">Bio</label>
          <textarea
            value={data}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="e.g., Full‑stack developer passionate about TypeScript and DX"
            rows={6}
            className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 resize-none"
          />
          <div className="mt-2 text-sm text-muted-foreground">{data.length} characters</div>
        </div>
      </div>
    </div>
  );
}
