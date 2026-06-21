export interface AdminVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  email: string;
  phone: string;
  avatarText: string;
  avatarColor: string;
}

export interface AdminListing {
  name: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "vendor" | "client";
  status: "active" | "suspended" | "banned";
  ordersCount: number;
  amountSpentOrGain: number;
  lastActive: string;
  joinedDate: string;
  location: string;
  avatarText: string;
  avatarColor: string;
  phone: string;
  services: AdminListing[];
  products: AdminListing[];
  userId: string;
}

export interface DisputeMessage {
  senderName: string;
  senderRole: "client" | "admin";
  timestamp: string;
  text: string;
}

export interface AdminDispute {
  id: string;
  refNumber: string;
  title: string;
  clientName: string;
  vendorName: string;
  serviceAmount: number;
  status: "open" | "investigating" | "resolved";
  createdAt: string;
  messages: DisputeMessage[];
  evidenceFiles: string[];
}

export interface EarningsTransaction {
  orderId: string;
  type: "service" | "product";
  item: string;
  vendor: string;
  client: string;
  amount: number;
  fee: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
}

export interface ContentFlag {
  id: string;
  type: "listing" | "review" | "message" | "profile";
  severity: "high" | "medium" | "low";
  reason: string;
  title: string;
  excerpt: string;
  createdAt: string;
  reporterName: string;
  reporterRole: string;
  isSelected: boolean;
}

export interface AuditLog {
  id: string;
  actor: string;
  actorInitials: string;
  action: string;
  target: string;
  category: string;
  ipAddress: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastActive: string;
  avatarText: string;
  avatarColor: string;
}
