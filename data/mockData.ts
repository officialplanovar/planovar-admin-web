import type { AdminVendor, AdminUser, AdminDispute, EarningsTransaction, ContentFlag, AuditLog, TeamMember } from "@/types";

export const vendors: AdminVendor[] = [
  { id: "v1", name: "Sugared Dreams Cakery", category: "Catering", location: "Nigeria, Lagos", status: "pending", submittedDate: "12 May 2026", email: "hello@sugareddreams.ng", phone: "+234 803 221 8842", avatarText: "SD", avatarColor: "#5B50F0" },
  { id: "v2", name: "Lumen Photography Studio", category: "Photography", location: "Nigeria, Abuja", status: "rejected", submittedDate: "12 May 2026", email: "hello@lumenphotography.ng", phone: "+234 802 111 2233", avatarText: "LP", avatarColor: "#8B5CF6" },
  { id: "v3", name: "Royal Tents & Rentals", category: "Rental", location: "Nigeria, Portacourt", status: "pending", submittedDate: "12 May 2026", email: "info@royaltents.ng", phone: "+234 803 444 5566", avatarText: "RT", avatarColor: "#10B981" },
  { id: "v4", name: "Bliss Decor Studio", category: "Decor", location: "Nigeria, Lagos", status: "approved", submittedDate: "12 May 2026", email: "hello@blissdecor.ng", phone: "+234 802 777 8899", avatarText: "BD", avatarColor: "#3B82F6" },
  { id: "v5", name: "Chef Adanna Catering", category: "Catering", location: "Nigeria, Portacourt", status: "pending", submittedDate: "12 May 2026", email: "chef@adannacatering.ng", phone: "+234 803 222 3344", avatarText: "CA", avatarColor: "#F59E0B" },
  { id: "v6", name: "Pulse DJ Collective", category: "Music", location: "Nigeria, Abuja", status: "approved", submittedDate: "12 May 2026", email: "info@pulsedjcollective.ng", phone: "+234 803 555 6677", avatarText: "PD", avatarColor: "#EF4444" },
  { id: "v7", name: "Sugared Dreams Cakery", category: "Catering", location: "Nigeria, Portacourt", status: "rejected", submittedDate: "12 May 2026", email: "hello@sugareddreams2.ng", phone: "+234 803 221 8843", avatarText: "SD", avatarColor: "#5B50F0" },
  { id: "v8", name: "Sugared Dreams Cakery", category: "Catering", location: "Nigeria, Portacourt", status: "pending", submittedDate: "12 May 2026", email: "hello@sugareddreams3.ng", phone: "+234 803 221 8844", avatarText: "SD", avatarColor: "#5B50F0" },
  { id: "v9", name: "Halal Bites Kitchen", category: "Catering", location: "Nigeria, Lagos", status: "approved", submittedDate: "10 May 2026", email: "orders@halalbites.ng", phone: "+234 803 888 9900", avatarText: "HB", avatarColor: "#10B981" },
  { id: "v10", name: "Afrobeat Live Band", category: "Music", location: "Nigeria, Lagos", status: "approved", submittedDate: "9 May 2026", email: "info@afrobeatlive.ng", phone: "+234 802 333 4455", avatarText: "AL", avatarColor: "#8B5CF6" },
];

export const users: AdminUser[] = [
  { id: "u1", userId: "u_1042", name: "Adaeze Okonkwo", email: "adaeze.o@gmail.com", role: "client", status: "active", ordersCount: 8, amountSpentOrGain: 1240000, lastActive: "12 Mins ago", joinedDate: "Mar 12, 2025", location: "Lagos", avatarText: "AO", avatarColor: "#5B50F0", phone: "+234 803 221 8841", services: [], products: [] },
  { id: "u2", userId: "u_1043", name: "Bola Catering Co.", email: "hello@bolacatering.ng", role: "vendor", status: "active", ordersCount: 10, amountSpentOrGain: 1240000, lastActive: "2 days ago", joinedDate: "Mar 12, 2025", location: "Lagos", avatarText: "BC", avatarColor: "#8B5CF6", phone: "+234 803 221 8841",
    services: [
      { name: "Wedding Cake", minPrice: 200000, maxPrice: 400000, rating: 4.7 },
      { name: "Wedding Dress", minPrice: 200000, maxPrice: 400000, rating: 4.7 },
      { name: "Wedding Flowers", minPrice: 200000, maxPrice: 400000, rating: 4.7 },
    ],
    products: [
      { name: "Chair", minPrice: 200000, maxPrice: 400000, rating: 4.7 },
      { name: "Table", minPrice: 200000, maxPrice: 400000, rating: 4.7 },
    ]
  },
  { id: "u3", userId: "u_1044", name: "Chinedu Eze", email: "chinedu.eze@outlook.com", role: "client", status: "active", ordersCount: 12, amountSpentOrGain: 1240000, lastActive: "1 week ago", joinedDate: "Jan 5, 2025", location: "Abuja", avatarText: "CE", avatarColor: "#10B981", phone: "+234 802 111 2233", services: [], products: [] },
  { id: "u4", userId: "u_1045", name: "Femi Ogunleye", email: "femi.og@yahoo.com", role: "client", status: "suspended", ordersCount: 43, amountSpentOrGain: 1240000, lastActive: "3 months ago", joinedDate: "Aug 20, 2024", location: "Lagos", avatarText: "FO", avatarColor: "#F59E0B", phone: "+234 803 444 5566", services: [], products: [] },
  { id: "u5", userId: "u_1046", name: "Halal Bites Kitchen", email: "orders@halalbites.ng", role: "vendor", status: "active", ordersCount: 23, amountSpentOrGain: 1240000, lastActive: "30 Mins ago", joinedDate: "Feb 14, 2025", location: "Lagos", avatarText: "CA", avatarColor: "#5B50F0", phone: "+234 803 888 9900", services: [], products: [] },
  { id: "u6", userId: "u_1047", name: "Ifeoma Nwosu", email: "ifeoma.n@gmail.com", role: "client", status: "banned", ordersCount: 32, amountSpentOrGain: 1240000, lastActive: "12 Mins ago", joinedDate: "Nov 3, 2024", location: "Port Harcourt", avatarText: "PD", avatarColor: "#EF4444", phone: "+234 802 777 8899", services: [], products: [] },
  { id: "u7", userId: "u_1048", name: "Kemi Lawal", email: "kemi.lawal@gmail.com", role: "client", status: "active", ordersCount: 5, amountSpentOrGain: 450000, lastActive: "1 hour ago", joinedDate: "Apr 1, 2025", location: "Abuja", avatarText: "KL", avatarColor: "#3B82F6", phone: "+234 803 222 3344", services: [], products: [] },
  { id: "u8", userId: "u_1049", name: "Marcus Okafor", email: "marcus@gmail.com", role: "vendor", status: "active", ordersCount: 18, amountSpentOrGain: 890000, lastActive: "45 Mins ago", joinedDate: "Jan 18, 2025", location: "Lagos", avatarText: "MO", avatarColor: "#8B5CF6", phone: "+234 803 555 6677", services: [], products: [] },
];

export const disputes: AdminDispute[] = [
  {
    id: "d1", refNumber: "#EVF-29481", title: "Vendor did not show up on event day",
    clientName: "Adaeze N.", vendorName: "Lumen Photography", serviceAmount: 450000,
    status: "open", createdAt: "12 May",
    messages: [
      { senderName: "Adaeze", senderRole: "client", timestamp: "12 May, 10:24", text: "The vendor did not arrive at the venue. We had to find a replacement last minute and incurred extra cost. We're requesting a full refund." },
      { senderName: "You", senderRole: "admin", timestamp: "12 May, 16:11", text: "Hi thank you for reaching out we are reviewing the evidence and will revert with a mediation proposal within 24 hours." },
    ],
    evidenceFiles: ["Contract.pdf", "Venue.jpg", "Receipt.pdf"],
  },
  {
    id: "d2", refNumber: "#EVF-29455", title: "Refund requested — cake damaged on delivery",
    clientName: "Adaeze N.", vendorName: "Lumen Photography", serviceAmount: 280000,
    status: "investigating", createdAt: "12 May",
    messages: [
      { senderName: "Adaeze", senderRole: "client", timestamp: "12 May, 10:24", text: "The vendor did not arrive at the venue. We had to find a replacement last minute and incurred extra cost. We're requesting a full refund." },
      { senderName: "You", senderRole: "admin", timestamp: "12 May, 16:11", text: "Hi thank you for reaching out we are reviewing the evidence and will revert with a mediation proposal within 24 hours." },
    ],
    evidenceFiles: ["Contract.pdf", "Venue.jpg", "Receipt.pdf"],
  },
  {
    id: "d3", refNumber: "#EVF-29440", title: "Service quality below expectation",
    clientName: "Adaeze N.", vendorName: "Lumen Photography", serviceAmount: 150000,
    status: "open", createdAt: "12 May",
    messages: [
      { senderName: "Adaeze", senderRole: "client", timestamp: "12 May, 10:24", text: "The vendor did not arrive at the venue. We had to find a replacement last minute and incurred extra cost. We're requesting a full refund." },
      { senderName: "You", senderRole: "admin", timestamp: "12 May, 16:11", text: "Hi thank you for reaching out we are reviewing the evidence and will revert with a mediation proposal within 24 hours." },
    ],
    evidenceFiles: ["Contract.pdf", "Venue.jpg", "Receipt.pdf"],
  },
  {
    id: "d4", refNumber: "#EVF-29399", title: "Wrong items delivered",
    clientName: "Adaeze N.", vendorName: "Lumen Photography", serviceAmount: 95000,
    status: "resolved", createdAt: "12 May",
    messages: [
      { senderName: "Adaeze", senderRole: "client", timestamp: "12 May, 10:24", text: "The vendor did not arrive at the venue. We had to find a replacement last minute and incurred extra cost. We're requesting a full refund." },
      { senderName: "You", senderRole: "admin", timestamp: "12 May, 16:11", text: "Hi thank you for reaching out we are reviewing the evidence and will revert with a mediation proposal within 24 hours." },
    ],
    evidenceFiles: ["Contract.pdf", "Venue.jpg", "Receipt.pdf"],
  },
];

export const transactions: EarningsTransaction[] = [
  { orderId: "EVF-39201", type: "service", item: "Wedding Photography — Full Day", vendor: "Lumen Photography", client: "Adaeze O.", amount: 450000, fee: 45000, status: "completed", date: "May 28, 11:24" },
  { orderId: "EVF-39200", type: "product", item: "Gold Centerpieces × 12", vendor: "Royal Decor", client: "Tunde A.", amount: 184000, fee: 18400, status: "completed", date: "May 28, 10:02" },
  { orderId: "EVF-39198", type: "service", item: "Live Band — 4 hours", vendor: "Afrobeat Live", client: "Chinwe E.", amount: 620000, fee: 62000, status: "pending", date: "May 28, 11:24" },
  { orderId: "EVF-39196", type: "product", item: "Champagne Flutes × 50", vendor: "Glassware Co.", client: "Bola O.", amount: 78000, fee: 7800, status: "cancelled", date: "May 28, 11:24" },
  { orderId: "EVF-39192", type: "service", item: "MC for Corporate Event", vendor: "Voice Of Lagos", client: "Kelechi N.", amount: 240000, fee: 24000, status: "completed", date: "May 28, 09:15" },
  { orderId: "EVF-39185", type: "product", item: "LED Uplights × 20", vendor: "Bright Stage NG", client: "Sade O.", amount: 96000, fee: 9600, status: "pending", date: "May 27, 08:45" },
  { orderId: "EVF-39180", type: "service", item: "Bridal Makeup & Styling", vendor: "Glam By Temi", client: "Ngozi A.", amount: 180000, fee: 18000, status: "completed", date: "May 27, 16:30" },
  { orderId: "EVF-39175", type: "product", item: "Floral Arch Arrangement", vendor: "Bloom Events", client: "Emeka U.", amount: 250000, fee: 25000, status: "completed", date: "May 27, 14:00" },
];

export const contentFlags: ContentFlag[] = [
  { id: "cf1", type: "listing", severity: "high", reason: "Off-platform payment", title: "VIP DJ Booking — instant payment off-platform", excerpt: '"Pay direct via WhatsApp for 20% discount. Contact 080..."', createdAt: "1h ago", reporterName: "Pulse DJ Collective", reporterRole: "Vendor", isSelected: false },
  { id: "cf2", type: "review", severity: "medium", reason: "Off-platform payment", title: "1-star review on Sugared Dreams Cakery", excerpt: '"Worst cake ever, also the owner is a scammer and a criminal who..."', createdAt: "1h ago", reporterName: "Anonymous Client", reporterRole: "Client", isSelected: false },
  { id: "cf3", type: "message", severity: "low", reason: "Off-platform payment", title: "VIP DJ Booking — instant payment off-platform", excerpt: '"Pay direct via WhatsApp for 20% discount. Contact 080..."', createdAt: "1h ago", reporterName: "Pulse DJ Collective", reporterRole: "Vendor", isSelected: false },
  { id: "cf4", type: "profile", severity: "medium", reason: "IP infringement", title: "Vendor profile uses copyrighted brand assets", excerpt: '"Logo appears to copy a well-known international franchise..."', createdAt: "1h ago", reporterName: "System", reporterRole: "Auto-flagged", isSelected: false },
  { id: "cf5", type: "listing", severity: "high", reason: "Prohibited category", title: "Electronics Bundle — Cheap iPhones", excerpt: '"Buy iPhone 14 Pro Max for just ₦50,000 direct from us..."', createdAt: "2h ago", reporterName: "System", reporterRole: "Auto-flagged", isSelected: false },
];

export const auditLogs: AuditLog[] = [
  { id: "al1", actor: "Richard Uzor", actorInitials: "RU", action: "Approved vendor", target: "Bliss Decor Studio", category: "Vendor", ipAddress: "192.168.1.1", timestamp: "May 28, 14:30" },
  { id: "al2", actor: "Tola Adeyemi", actorInitials: "TA", action: "Resolved dispute", target: "#EVF-29401", category: "Dispute", ipAddress: "192.168.1.2", timestamp: "May 28, 14:28" },
  { id: "al3", actor: "System", actorInitials: "SY", action: "Auto-flagged listing", target: "Cheap iPhone bundle", category: "Content", ipAddress: "0.0.0.0", timestamp: "May 28, 14:28" },
  { id: "al4", actor: "Marcus Okafor", actorInitials: "MO", action: "Suspended vendor", target: "Quick Eats NG", category: "User", ipAddress: "192.168.1.3", timestamp: "May 28, 14:28" },
  { id: "al5", actor: "Richard Uzor", actorInitials: "RU", action: "Updated commission rate", target: "Platform Settings", category: "Settings", ipAddress: "192.168.1.1", timestamp: "May 28, 13:15" },
  { id: "al6", actor: "Ife Bello", actorInitials: "IB", action: "Removed listing", target: "VIP DJ Booking", category: "Content", ipAddress: "192.168.1.4", timestamp: "May 28, 12:45" },
  { id: "al7", actor: "Tola Adeyemi", actorInitials: "TA", action: "Invited team member", target: "jane@planovar.ng", category: "Admin", ipAddress: "192.168.1.2", timestamp: "May 28, 11:30" },
  { id: "al8", actor: "Richard Uzor", actorInitials: "RU", action: "Banned user permanently", target: "Ifeoma Nwosu", category: "User", ipAddress: "192.168.1.1", timestamp: "May 28, 10:00" },
  { id: "al9", actor: "Marcus Okafor", actorInitials: "MO", action: "Rejected vendor", target: "Lumen Photography Studio", category: "Vendor", ipAddress: "192.168.1.3", timestamp: "May 27, 17:45" },
  { id: "al10", actor: "System", actorInitials: "SY", action: "Auto-suspended vendor", target: "Fast Foods NG", category: "User", ipAddress: "0.0.0.0", timestamp: "May 27, 16:00" },
];

export const teamMembers: TeamMember[] = [
  { id: "tm1", name: "Richard Uzor", email: "richard@planovar.ng", role: "Super Admin", status: "active", lastActive: "2m ago", avatarText: "RU", avatarColor: "#5B50F0" },
  { id: "tm2", name: "Tola Adeyemi", email: "tola@planovar.ng", role: "Moderator", status: "active", lastActive: "3m ago", avatarText: "TA", avatarColor: "#8B5CF6" },
  { id: "tm3", name: "Marcus Okafor", email: "marcus@planovar.ng", role: "Admin", status: "active", lastActive: "1hr", avatarText: "MO", avatarColor: "#10B981" },
  { id: "tm4", name: "Ife Bello", email: "ife@planovar.ng", role: "Support", status: "active", lastActive: "3 hrs ago", avatarText: "IB", avatarColor: "#3B82F6" },
  { id: "tm5", name: "Kemi Lawal", email: "kemi@planovar.ng", role: "Finance", status: "active", lastActive: "Yesterday 12:00 pm", avatarText: "KL", avatarColor: "#F59E0B" },
  { id: "tm6", name: "David Iheanacho", email: "david@planovar.ng", role: "Admin", status: "active", lastActive: "Yesterday 5:12 pm", avatarText: "DI", avatarColor: "#5B50F0" },
  { id: "tm7", name: "Jane Beatrice", email: "jane@planovar.ng", role: "Admin", status: "active", lastActive: "23rd May 2026", avatarText: "JB", avatarColor: "#EF4444" },
];

export const weeklyChartData = [
  { day: "Mon", verified: 9, disputes: 1, services: 900000, products: 1200000 },
  { day: "Tue", verified: 29, disputes: 1, services: 700000, products: 1050000 },
  { day: "Wed", verified: 52, disputes: 31, services: 800000, products: 1180000 },
  { day: "Thu", verified: 64, disputes: 8, services: 500000, products: 900000 },
  { day: "Fri", verified: 66, disputes: 12, services: 1100000, products: 1200000 },
  { day: "Sat", verified: 65, disputes: 10, services: 1000000, products: 1200000 },
  { day: "Sun", verified: 100, disputes: 10, services: 600000, products: 1100000 },
];
