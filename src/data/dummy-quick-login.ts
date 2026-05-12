export interface QuickLoginAccount {
  id: string;
  email: string;
  password: string;
  label: string;
  role: string;
  avatarInitials: string;
}

// Credentials mirror Go User Service Postman collection variables.
// `admin@example.com` is the seeded account; others require prior registration.
export const QUICK_LOGIN_USERS: QuickLoginAccount[] = [
  {
    id: "admin",
    email: "admin@example.com",
    password: "Admin12345",
    label: "System Administrator",
    role: "Super Admin",
    avatarInitials: "SA",
  },
  {
    id: "user1",
    email: "user1@example.com",
    password: "User1#Secure",
    label: "User One",
    role: "Registered User",
    avatarInitials: "U1",
  },
  {
    id: "budi",
    email: "budi@example.com",
    password: "Budi#12345",
    label: "Budi",
    role: "Engineer",
    avatarInitials: "BD",
  },
  {
    id: "tl_west",
    email: "teamleader.west@example.com",
    password: "Dummy#12345",
    label: "Raka Team Leader",
    role: "Team Leader",
    avatarInitials: "TL",
  },
  {
    id: "tl_eastt",
    email: "teamleader.east@example.com",
    password: "Dummy#12345",
    label: "Team Leader West",
    role: "Team Leader",
    avatarInitials: "TL",
  },
];
