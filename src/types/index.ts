// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SkillCategory {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  DATABASE = "Database",
  DEVOPS = "DevOps",
  MOBILE = "Mobile",
  AI_ML = "AI/ML",
  DESIGN = "Design",
  OTHER = "Other",
}

export enum SkillLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  EXPERT = "Expert",
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  aiGeneratedDescription?: string;
  technologies: string[];
  category: ProjectCategory;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  startDate: Date;
  endDate?: Date;
  teamSize?: number;
  role: string;
  achievements: string[];
  metrics?: ProjectMetrics;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectCategory {
  WEB_APP = "Web Application",
  MOBILE_APP = "Mobile Application",
  DESKTOP_APP = "Desktop Application",
  API = "API/Backend",
  LIBRARY = "Library/Package",
  GAME = "Game",
  OTHER = "Other",
}

export interface ProjectMetrics {
  users?: number;
  performance?: string;
  impact?: string;
  downloads?: number;
  stars?: number;
}

// Endorsement Types
export interface Endorsement {
  id: string;
  endorserId: string;
  endorseeId: string;
  skillId?: string;
  projectId?: string;
  type: EndorsementType;
  level: EndorsementLevel;
  message?: string;
  projectContext?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum EndorsementType {
  SKILL = "Skill",
  PROJECT = "Project",
  LEADERSHIP = "Leadership",
  COLLABORATION = "Collaboration",
}

export enum EndorsementLevel {
  CAN_CONFIRM = "Can confirm",
  HIGHLY_SKILLED = "Highly skilled",
  EXPERT = "Expert",
  MENTOR = "Mentor level",
}

// Analytics Types
export interface ProfileView {
  id: string;
  userId: string;
  viewerId?: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  timestamp: Date;
}

export interface EndorsementRequest {
  id: string;
  requesterId: string;
  targetUserId: string;
  skillId?: string;
  projectId?: string;
  message: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum RequestStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  DECLINED = "Declined",
  EXPIRED = "Expired",
}

// AI Types
export interface AIReview {
  id: string;
  userId: string;
  reviewType: ReviewType;
  score: number;
  feedback: string;
  suggestions: string[];
  generatedAt: Date;
}

export enum ReviewType {
  PORTFOLIO = "Portfolio",
  SKILLS = "Skills",
  PROJECTS = "Projects",
  OVERALL = "Overall",
}

// Form Types
export interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  technologies: string[];
  category: ProjectCategory;
  liveUrl: string;
  githubUrl: string;
  startDate: string;
  endDate: string;
  role: string;
  achievements: string[];
}

export interface SkillFormData {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  skills?: string[];
  location?: string;
  experience?: string;
  sortBy?: "recent" | "popular" | "name";
  sortOrder?: "asc" | "desc";
}

// Dashboard Types
export interface DashboardStats {
  totalViews: number;
  totalEndorsements: number;
  totalProjects: number;
  profileCompleteness: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "view" | "endorsement" | "project" | "skill";
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
