// Robot Categories
export type RobotCategory =
  | 'home-cleaning'
  | 'lawn-garden'
  | 'companion'
  | 'educational'
  | 'industrial'
  | 'entertainment'
  | 'drones'
  | 'hobby-diy'
  | 'security'
  | 'healthcare';

export const ROBOT_CATEGORIES: { id: RobotCategory; name: string; icon: string; description: string }[] = [
  { id: 'home-cleaning', name: 'Home & Cleaning', icon: 'home', description: 'Vacuum, mop, and home cleaning robots' },
  { id: 'lawn-garden', name: 'Lawn & Garden', icon: 'trees', description: 'Robotic lawn mowers and garden helpers' },
  { id: 'companion', name: 'Companion Robots', icon: 'heart', description: 'Social and companion robots' },
  { id: 'educational', name: 'Educational', icon: 'graduation-cap', description: 'Learning and STEM robots' },
  { id: 'industrial', name: 'Industrial', icon: 'factory', description: 'Industrial and manufacturing robots' },
  { id: 'entertainment', name: 'Entertainment', icon: 'gamepad-2', description: 'Toy and entertainment robots' },
  { id: 'drones', name: 'Drones & UAV', icon: 'plane', description: 'Aerial drones and unmanned vehicles' },
  { id: 'hobby-diy', name: 'Hobby & DIY', icon: 'wrench', description: 'Kit robots and DIY projects' },
  { id: 'security', name: 'Security', icon: 'shield', description: 'Security and surveillance robots' },
  { id: 'healthcare', name: 'Healthcare', icon: 'activity', description: 'Medical and healthcare assistance robots' },
];

// Robot Condition
export type RobotCondition = 'new' | 'like-new' | 'excellent' | 'good' | 'fair';

export const ROBOT_CONDITIONS: { id: RobotCondition; name: string }[] = [
  { id: 'new', name: 'New' },
  { id: 'like-new', name: 'Like New' },
  { id: 'excellent', name: 'Excellent' },
  { id: 'good', name: 'Good' },
  { id: 'fair', name: 'Fair' },
];

// Popular Robot Brands
export const ROBOT_BRANDS = [
  'iRobot',
  'Roborock',
  'Ecovacs',
  'Boston Dynamics',
  'DJI',
  'Anki',
  'Husqvarna',
  'UBTECH',
  'Sony',
  'SoftBank Robotics',
  'Aeolus',
  'Samsung',
  'LG',
  'Xiaomi',
  'Neato',
  'Shark',
  'Eufy',
  'Dreame',
  'Segway',
  'Sphero',
  'Wonder Workshop',
  'Makeblock',
  'LEGO',
  'Other',
];

// Listing Status
export type ListingStatus = 'active' | 'pending' | 'sold' | 'expired' | 'draft';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  location: {
    city: string;
    state: string;
    postcode: string;
  };
  bio?: string;
  memberSince: string;
  listingsCount: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
}

// Robot Listing
export interface RobotListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: RobotCategory;
  brand: string;
  model: string;
  year?: number;
  condition: RobotCondition;
  price: number;
  negotiable: boolean;
  images: string[];
  specifications: {
    dimensions?: string;
    weight?: string;
    batteryLife?: string;
    connectivity?: string[];
    features?: string[];
    includedAccessories?: string[];
  };
  location: {
    city: string;
    state: string;
    postcode: string;
  };
  status: ListingStatus;
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

// Message/Conversation Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

// Search/Filter Types
export interface SearchFilters {
  query?: string;
  category?: RobotCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: RobotCondition[];
  location?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'relevance';
}

// Review Types
export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  listingId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
