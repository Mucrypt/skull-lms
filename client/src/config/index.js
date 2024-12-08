import { 
  Code, 
  Activity, 
  Brain, 
  Cloud, 
  Shield, 
  Smartphone, 
  Gamepad, 
  Server, 
  PenTool, 
  Box, 
  Wifi, 
  Settings, 
  BarChart2, 
  Clipboard, 
  DollarSign, 
  Briefcase, 
  Camera, 
  Video, 
  FileText, 
  Users, 
  User, 
  Heart, 
  Globe, 
  Music 
} from "lucide-react";

export const signUpFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    type: "text",
    componentType: "input",
  },
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
];

export const signInFormControls = [
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
];

export const initialSignInFormData = {
  userEmail: "",
  password: "",
};

export const initialSignUpFormData = {
  userName: "",
  userEmail: "",
  password: "",
};


export const languageOptions = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "portuguese", label: "Portuguese" },
  { id: "arabic", label: "Arabic" },
  { id: "russian", label: "Russian" },
];

export const courseLevelOptions = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const courseCategories = [
  { id: "web-development", label: "Web Development", icon: Code },
  { id: "backend-development", label: "Backend Development", icon: Server },
  { id: "data-science", label: "Data Science", icon: Activity },
  { id: "machine-learning", label: "Machine Learning", icon: Brain },
  { id: "artificial-intelligence", label: "Artificial Intelligence", icon: Brain },
  { id: "cloud-computing", label: "Cloud Computing", icon: Cloud },
  { id: "cyber-security", label: "Cyber Security", icon: Shield },
  { id: "mobile-development", label: "Mobile Development", icon: Smartphone },
  { id: "game-development", label: "Game Development", icon: Gamepad },
  { id: "software-engineering", label: "Software Engineering", icon: Server },
  { id: "ui-ux-design", label: "UI/UX Design", icon: PenTool },
  { id: "blockchain", label: "Blockchain", icon: Box },
  { id: "internet-of-things", label: "Internet of Things (IoT)", icon: Wifi },
  { id: "devops", label: "DevOps", icon: Settings },
  { id: "digital-marketing", label: "Digital Marketing", icon: BarChart2 },
  { id: "business-analysis", label: "Business Analysis", icon: Clipboard },
  { id: "project-management", label: "Project Management", icon: Clipboard },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "entrepreneurship", label: "Entrepreneurship", icon: Briefcase },
  { id: "graphic-design", label: "Graphic Design", icon: PenTool },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "video-editing", label: "Video Editing", icon: Video },
  { id: "content-writing", label: "Content Writing", icon: FileText },
  { id: "human-resources", label: "Human Resources", icon: Users },
  { id: "personal-development", label: "Personal Development", icon: User },
  { id: "health-and-wellness", label: "Health and Wellness", icon: Heart },
  { id: "language-learning", label: "Language Learning", icon: Globe },
  { id: "music-production", label: "Music Production", icon: Music },
];

// Updated courseLandingPageFormControls
export const courseLandingPageFormControls = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    type: "text",
    placeholder: "Enter course title",
  },
  {
    name: "category",
    label: "Category",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseCategories,
  },
  {
    name: "level",
    label: "Level",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseLevelOptions,
  },
  {
    name: "primaryLanguage",
    label: "Primary Language",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: languageOptions,
  },
  {
    name: "subtitle",
    label: "Subtitle",
    componentType: "input",
    type: "text",
    placeholder: "Enter course subtitle",
  },
  {
    name: "description",
    label: "Description",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course description",
  },
  {
    name: "pricing",
    label: "Pricing",
    componentType: "input",
    type: "number",
    placeholder: "Enter course pricing",
  },
  {
    name: "objectives",
    label: "Objectives",
    componentType: "textarea",
    placeholder: "Enter course objectives (comma-separated)",
  },
  {
    name: "welcomeMessage",
    label: "Welcome Message",
    componentType: "textarea",
    placeholder: "Welcome message for students",
  },
  {
    name: "tags",
    label: "Tags",
    componentType: "textarea",
    placeholder: "Enter tags (comma-separated)",
  },
  {
    name: "requirements",
    label: "Requirements",
    componentType: "textarea",
    placeholder: "Enter course requirements (comma-separated)",
  },
  {
    name: "targetAudience",
    label: "Target Audience",
    componentType: "textarea",
    placeholder: "Enter target audience (comma-separated)",
  },
];

export const courseLandingInitialFormData = {
  title: "",
  category: "",
  level: "",
  primaryLanguage: "",
  subtitle: "",
  description: "",
  pricing: "",
  objectives: "",
  welcomeMessage: "",
  image: "",
  tags: "",
  requirements: "",
  targetAudience: "",
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions = {
  category: courseCategories,
  level: courseLevelOptions,
  primaryLanguage: languageOptions,
};


// Updated courseCurriculumInitialFormData
export const courseCurriculumInitialFormData = [
  {
    sectionTitle: "",
    lectures: [
      {
        title: "",
        videoUrl: "",
        freePreview: false,
        public_id: "",
        duration: "",
        resources: [],
        quiz: {
          questions: [
            {
              question: "",
              options: [],
              correctAnswer: "",
            },
          ],
        },
      },
    ],
  },
];
