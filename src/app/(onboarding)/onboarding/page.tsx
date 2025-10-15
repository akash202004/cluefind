"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  User,
  FileText,
  ArrowRight,
  Check,
} from "lucide-react";
import ImageUpload from "@/components/forms/ImageUpload";
import ClientOnly from "@/components/ui/ClientOnly";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingData {
  role: 'DEVELOPER' | 'RECRUITER' | null;
  profileImage: string | null;
  username: string;
  bio: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, hasProfile, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    role: null,
    profileImage: null,
    username: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  // Persist onboarding progress locally so refreshes don't lose state
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("onboarding-progress") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (parsed.onboardingData) setOnboardingData(parsed.onboardingData);
          if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const payload = JSON.stringify({ onboardingData, currentStep });
      localStorage.setItem("onboarding-progress", payload);
      // Non-HTTP cookie fallback (expires in ~7 days)
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      document.cookie = `onboarding-progress=${encodeURIComponent(payload)}; expires=${expiry.toUTCString()}; path=/`;
    } catch {}
  }, [onboardingData, currentStep]);

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
    // If user is recruiter, skip to completion after step 1
    if (currentStep === 1 && onboardingData.role === 'RECRUITER') {
      handleComplete();
      return;
    }
    
    if (currentStep < 4) {
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

      // Validate required fields based on role
      if (!onboardingData.role) {
        throw new Error("Please select a role");
      }

  // For developers, require all fields
      if (onboardingData.role === 'DEVELOPER') {
        if (
          !onboardingData.profileImage ||
          !onboardingData.username ||
          !onboardingData.bio
        ) {
          throw new Error("All fields are required for developer profile");
        }
      }

      // Create user and profile in Prisma database
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: onboardingData.role,
          profileImage: onboardingData.profileImage,
          username: onboardingData.username,
          bio: onboardingData.bio,
          googleId: user.googleId,
          email: user.email!,
          name: user.name || onboardingData.username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to complete onboarding");
      }

      const result = await response.json();
      console.log("Onboarding completed:", result);

      // Refresh user data to update hasProfile status
      await refreshUser();

      // Clear persisted onboarding progress after successful completion
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("onboarding-progress");
          document.cookie = `onboarding-progress=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      } catch {}
      
      // Redirect based on role
      if (onboardingData.role === 'RECRUITER') {
        router.push("/leaderboard");
      } else {
        router.push("/dashboard");
      }
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
        return onboardingData.role !== null;
      case 2:
        return onboardingData.profileImage !== null;
      case 3:
        return onboardingData.username.length > 0;
      case 4:
        const wordCount = Math.ceil(onboardingData.bio.length / 5);
        return onboardingData.bio.length > 0 && wordCount <= 30;
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
          <h1 className="text-section mb-2">Welcome to Cluefind!</h1>
          <p className="text-subtitle">
            Let&apos;s set up your developer portfolio in just a few steps
          </p>
        </div>

        {/* Step Content */}
        <div className="card-brutalist mb-8">
          {currentStep === 1 && (
            <RoleSelectionStep
              data={onboardingData.role}
              onUpdate={(value) => updateData("role", value as 'DEVELOPER' | 'RECRUITER')}
            />
          )}

          {currentStep === 2 && (
            <ProfileImageStep
              data={onboardingData.profileImage}
              onUpdate={(value) => updateData("profileImage", value)}
            />
          )}

          {currentStep === 3 && (
            <UsernameStep
              data={onboardingData.username}
              onUpdate={(value) => updateData("username", value)}
            />
          )}

          {currentStep === 4 && (
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
            {onboardingData.role === 'DEVELOPER' ? (
              [1, 2, 3, 4].map((step) => (
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
              ))
            ) : (
              <div className="w-3 h-3 rounded-full border-2 bg-accent border-accent" />
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!isStepComplete(currentStep)}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(currentStep === 4 && onboardingData.role === 'DEVELOPER') || (currentStep === 1 && onboardingData.role === 'RECRUITER') ? "Complete Setup" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </ClientOnly>
  );
}

// Step 1: Role Selection
function RoleSelectionStep({
  data,
  onUpdate,
}: {
  data: 'DEVELOPER' | 'RECRUITER' | null;
  onUpdate: (value: string) => void;
}) {
  return (
    <div className="text-center">
      <div className="icon-box-purple mx-auto mb-6">
        <User className="w-8 h-8 text-primary" />
      </div>

      <h2 className="text-xl font-black uppercase tracking-wide mb-4">
        Choose Your Role
      </h2>

      <p className="text-body mb-6">
        Are you a student looking to build your portfolio or a recruiter looking for talent?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Developer Option */}
        <button
          onClick={() => onUpdate('DEVELOPER')}
          className={`p-6 border-4 rounded-lg transition-all ${
            data === 'DEVELOPER'
              ? 'border-accent bg-accent/10 shadow-brutalist-lg'
              : 'border-primary bg-background hover:shadow-brutalist-md'
          }`}
        >
          <div className="icon-box-blue mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-wide mb-2">
            Developer
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your portfolio, showcase your projects, and get endorsed by peers
          </p>
        </button>

        {/* Recruiter Option */}
        <button
          onClick={() => onUpdate('RECRUITER')}
          className={`p-6 border-4 rounded-lg transition-all ${
            data === 'RECRUITER'
              ? 'border-accent bg-accent/10 shadow-brutalist-lg'
              : 'border-primary bg-background hover:shadow-brutalist-md'
          }`}
        >
          <div className="icon-box-purple mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-wide mb-2">
            Recruiter / Company
          </h3>
          <p className="text-sm text-muted-foreground">
            Browse student portfolios and discover talented developers
          </p>
        </button>
      </div>
    </div>
  );
}

// Step 2 (Students only): Profile Image Upload
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

      const response = await fetch("/api/upload/image", {
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

// Step 3 (Students only): Username Setup
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
          This will be your unique URL: cluefind.software/yourusername
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
              <span className="font-bold text-accent">cluefind.com/{data}</span>
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

// Step 4 (Students only): Bio
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
        <div className="icon-box-yellow mx-auto mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-xl font-black uppercase tracking-wide mb-4">
          Tell Us About Yourself
        </h2>

        <p className="text-body mb-6">
          Write a brief bio to introduce yourself to the community (max 30 words)
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
            Bio
          </label>
          <textarea
            value={data}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Full-stack developer passionate about React and Node.js. Love creating innovative web solutions and contributing to open-source projects. Always eager to learn!"
            rows={4}
            maxLength={150}
            className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 resize-none"
          />
          <div className="mt-2 text-sm text-muted-foreground flex justify-between">
            <span>{data.length} characters</span>
            <span className={Math.ceil(data.length / 5) > 30 ? "text-feature-red font-bold" : ""}>
              {Math.ceil(data.length / 5)} words / 30 max
            </span>
          </div>
          {Math.ceil(data.length / 5) > 30 && (
            <div className="mt-1 text-sm text-feature-red font-bold">
              ⚠️ Please keep your bio under 30 words
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
