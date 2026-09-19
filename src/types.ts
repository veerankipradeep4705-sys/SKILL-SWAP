export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  year: string;
  bio: string;
  photo: string;
  skillsGiven: number;
  skillsTaken: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Skill {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  userCollege: string;
  userYear: string;
  title: string;
  category: string;
  description: string;
  type: 'Teach' | 'Learn';
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherPhoto: string;
  learnerId: string;
  learnerName: string;
  skillId: string;
  skillTitle: string;
  category: string;
  dateTime: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  message: string;
  timestamp: string;
  read: boolean;
  encryptionMetadata?: {
    algorithm: string;
    iv: string;
    authTag: string;
  };
}

export interface EncryptedPayloadAtRest {
  algorithm: string;
  iv: string;
  authTag: string;
  ciphertext: string;
}

export interface RawUserAtRest {
  id: string;
  name: string;
  email: string;
  passwordHashBcrypt: string;
  collegeEncryptedAES256: EncryptedPayloadAtRest;
  year: string;
  bioEncryptedAES256: EncryptedPayloadAtRest;
  rating: number;
  createdAt: string;
}

export interface RawChatAtRest {
  id: string;
  senderId: string;
  receiverId: string;
  messageCiphertextAES256: EncryptedPayloadAtRest;
  timestamp: string;
}

export interface RawBookingAtRest {
  id: string;
  skillTitle: string;
  status: string;
  notesEncryptedAES256: EncryptedPayloadAtRest;
  dateTime: string;
}

export interface VaultInspectionData {
  encryptionStandard: string;
  sessionStandard: string;
  passwordHashing: string;
  recordsCount: {
    users: number;
    chats: number;
    bookings: number;
    skills: number;
  };
  tablesAtRest: {
    users: RawUserAtRest[];
    chats: RawChatAtRest[];
    bookings: RawBookingAtRest[];
  };
}

export type ActiveTab = 'home' | 'search' | 'bookings' | 'chat' | 'profile';
