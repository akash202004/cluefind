"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, User, FileText, Github, ArrowRight, Check } from "lucide-react";
import { useOnboarding } from "../layout";

interface OnboardingData {
  profileImage: string | null;
  username: string;
  resumeContent: string;
  githubUsername: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { currentStep, setCurrentStep } = useOnboarding();
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profileImage: null,
    username: "",
    resumeContent: "",
    githubUsername: "",
  });

  const handleNext = () => {
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
    try {
      // Send onboarding data to API
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to complete onboarding");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const updateData = (field: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({
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
        return onboardingData.resumeContent.length > 0;
      case 4:
        return onboardingData.githubUsername.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="text-center mb-8">
        <h1 className="text-section mb-2">Welcome to DevSync!</h1>
        <p className="text-subtitle">
          Let's set up your developer portfolio in just a few steps
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
          <ResumeStep 
            data={onboardingData.resumeContent}
            onUpdate={(value) => updateData("resumeContent", value)}
          />
        )}
        
        {currentStep === 4 && (
          <GitHubStep 
            data={onboardingData.githubUsername}
            onUpdate={(value) => updateData("githubUsername", value)}
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
          {[1, 2, 3, 4].map((step) => (
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
          {currentStep === 4 ? "Complete Setup" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Step 1: Profile Image Upload
function ProfileImageStep({ data, onUpdate }: { data: string | null; onUpdate: (value: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/onboarding/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { imageUrl } = await response.json();
        onUpdate(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
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
            <img 
              src={data} 
              alt="Profile" 
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
function UsernameStep({ data, onUpdate }: { data: string; onUpdate: (value: string) => void }) {
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
                fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                fontWeight: "700",
                fontSize: "16px"
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
              <span className="text-muted-foreground">Your profile will be: </span>
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

// Step 3: Resume Upload
function ResumeStep({ data, onUpdate }: { data: string; onUpdate: (value: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/onboarding/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { content } = await response.json();
        onUpdate(content);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="icon-box-green mx-auto mb-6">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      
      <h2 className="text-xl font-black uppercase tracking-wide mb-4">
        Upload Your Resume
      </h2>
      
      <p className="text-body mb-6">
        Upload your resume PDF to automatically extract your skills and experience
      </p>

      <div className="space-y-4">
        <div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            disabled={isUploading}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="btn-outline cursor-pointer disabled:opacity-50"
          >
            {isUploading ? "Processing..." : "Upload Resume PDF"}
          </label>
        </div>

        {data && (
          <div className="text-left">
            <h3 className="font-bold uppercase tracking-wide mb-2">Extracted Content:</h3>
            <div className="bg-muted border-4 border-primary rounded-lg p-4 max-h-40 overflow-y-auto">
              <p className="text-sm text-muted-foreground">{data}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4: GitHub Integration
function GitHubStep({ data, onUpdate }: { data: string; onUpdate: (value: string) => void }) {
  const [isFetching, setIsFetching] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);

  const fetchGitHubData = async (username: string) => {
    if (username.length < 1) {
      setGithubData(null);
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch("/api/onboarding/github-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        setGithubData(data);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleGitHubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate(value);
    fetchGitHubData(value);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="icon-box-yellow mx-auto mb-4">
          <Github className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-xl font-black uppercase tracking-wide mb-4">
          Connect GitHub
        </h2>
        
        <p className="text-body mb-6">
          Link your GitHub profile to showcase your repositories and contributions
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
            GitHub Username
          </label>
          <div className="relative">
            <input
              type="text"
              value={data}
              onChange={handleGitHubChange}
              placeholder="your-github-username"
              className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                fontWeight: "700",
                fontSize: "16px"
              }}
            />
            {isFetching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {data && (
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">GitHub Profile: </span>
              <span className="font-bold text-accent">github.com/{data}</span>
            </div>
          )}
        </div>

        {githubData && (
          <div className="bg-muted border-4 border-primary rounded-lg p-4">
            <h3 className="font-bold uppercase tracking-wide mb-2">GitHub Profile Found:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repositories:</span>
                <span className="font-bold">{githubData.public_repos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Followers:</span>
                <span className="font-bold">{githubData.followers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Following:</span>
                <span className="font-bold">{githubData.following}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
