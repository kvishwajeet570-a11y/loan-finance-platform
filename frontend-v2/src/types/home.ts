export interface Banner {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  isActive: boolean;
  position?: string | null;
  redirectUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  description?: string | null;
  pageType?: string | null;
  category?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  featuredImage?: string | null;
  bannerImage?: string | null;
  isPublished: boolean;
  isActive: boolean;
  views?: number;
  publishedAt?: string | null;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  displayOrder: number;
  isPublished: boolean;
  views?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  category?: string | null;
  tags: string[];
  views: number;
  likes: number;
  isPublished: boolean;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoanApplicationPayload {
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  loanType: string;
  amount: number;
  dob?: string;
  panNo: string;
  aadhaarNo?: string;
  monthlyIncome?: number;
  employmentType?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface LoanApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  loanType: string;
  interestRate?: number | null;
  tenureMonths?: number | null;
  monthlyEMI?: number | null;
  purpose?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
