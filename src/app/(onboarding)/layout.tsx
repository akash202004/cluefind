"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <OnboardingContext.Provider value={{ currentStep, setCurrentStep }}>
      <div className="min-h-screen bg-background dot-grid-bg">
        {/* Header */}
        <header className="border-b-4 border-primary bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm">
                <span className="text-primary-foreground font-black text-xl">D</span>
              </div>
              <span className="text-2xl font-black uppercase tracking-tight">DevSync</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/signin" className="btn-outline text-sm px-4 py-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-card border-b-4 border-primary">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 border-4 border-primary rounded-full flex items-center justify-center text-sm font-black ${
                    step === currentStep 
                      ? "bg-accent text-accent-foreground" 
                      : step < currentStep 
                      ? "bg-feature-green text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step < currentStep ? "✓" : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 border-2 mx-2 ${
                      step < currentStep ? "bg-feature-green border-feature-green" : "bg-muted border-primary"
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </OnboardingContext.Provider>
  );
}
