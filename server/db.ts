import { encryptAES256, decryptAES256, hashPassword, verifyPassword, EncryptedPayload } from './crypto';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  collegeEncrypted: EncryptedPayload;
  year: string;
  bioEncrypted: EncryptedPayload;
  photo: string;
  skillsGiven: number;
  skillsTaken: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface SkillRecord {
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

export interface BookingRecord {
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
  notesEncrypted: EncryptedPayload;
  createdAt: string;
}

export interface ChatMessageRecord {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  messageEncrypted: EncryptedPayload;
  timestamp: string;
  read: boolean;
}

export interface ReviewRecord {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  rating: number;
  comment: string;
  timestamp: string;
}

// In-Memory Database storage (persisted at rest with AES-256 encrypted fields)
class SecureDatabase {
  private users: Map<string, UserRecord> = new Map();
  private skills: Map<string, SkillRecord> = new Map();
  private bookings: Map<string, BookingRecord> = new Map();
  private chats: ChatMessageRecord[] = [];
  private reviews: ReviewRecord[] = [];

  constructor() {
    this.seedInitialData();
  }

  private async seedInitialData() {
    // Seed default users from mockup (Alex Kumar, Sneha Patel, Priya Sharma, Rahul Verma, John Doe)
    const demoPasswordHash = await hashPassword('password123');

    // John Doe (the primary demo user as seen in screenshots)
    const johnId = 'user-john-doe';
    this.users.set(johnId, {
      id: johnId,
      name: 'John Doe',
      email: 'john.doe@college.edu',
      passwordHash: demoPasswordHash,
      collegeEncrypted: encryptAES256('National Institute of Technology, CSE'),
      year: '3rd Year',
      bioEncrypted: encryptAES256('Passionate computer science student looking to exchange Python development for UI/UX & Flutter skills.'),
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      skillsGiven: 5,
      skillsTaken: 3,
      rating: 4.8,
      reviewsCount: 16,
      createdAt: '2026-01-15T10:00:00.000Z',
    });

    // Alex Kumar (featured in python card mockup)
    const alexId = 'user-alex-kumar';
    this.users.set(alexId, {
      id: alexId,
      name: 'Alex Kumar',
      email: 'alex.kumar@college.edu',
      passwordHash: demoPasswordHash,
      collegeEncrypted: encryptAES256('Indian Institute of Technology, CSE'),
      year: '3rd Year',
      bioEncrypted: encryptAES256('Full stack developer and Python enthusiast. Love teaching fundamentals and algorithmic thinking.'),
      photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      skillsGiven: 12,
      skillsTaken: 4,
      rating: 4.8,
      reviewsCount: 12,
      createdAt: '2025-11-20T10:00:00.000Z',
    });

    // Sneha Patel
    const snehaId = 'user-sneha-patel';
    this.users.set(snehaId, {
      id: snehaId,
      name: 'Sneha Patel',
      email: 'sneha.patel@college.edu',
      passwordHash: demoPasswordHash,
      collegeEncrypted: encryptAES256('Vellore Institute of Technology, IT'),
      year: '3rd Year',
      bioEncrypted: encryptAES256('Figma UI/UX designer and web developer. Teaching user-centered design and learning Python.'),
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      skillsGiven: 8,
      skillsTaken: 6,
      rating: 4.7,
      reviewsCount: 10,
      createdAt: '2025-12-05T10:00:00.000Z',
    });

    // Priya Sharma
    const priyaId = 'user-priya-sharma';
    this.users.set(priyaId, {
      id: priyaId,
      name: 'Priya Sharma',
      email: 'priya.sharma@college.edu',
      passwordHash: demoPasswordHash,
      collegeEncrypted: encryptAES256('Delhi Technological University, CSE'),
      year: '2nd Year',
      bioEncrypted: encryptAES256('Enthusiastic beginner in Python, ready to exchange Graphic Design and Digital Art skills.'),
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
      skillsGiven: 4,
      skillsTaken: 7,
      rating: 4.6,
      reviewsCount: 8,
      createdAt: '2026-02-01T10:00:00.000Z',
    });

    // Rahul Verma
    const rahulId = 'user-rahul-verma';
    this.users.set(rahulId, {
      id: rahulId,
      name: 'Rahul Verma',
      email: 'rahul.verma@college.edu',
      passwordHash: demoPasswordHash,
      collegeEncrypted: encryptAES256('BITS Pilani, CSE'),
      year: '4th Year',
      bioEncrypted: encryptAES256('Data science practitioner working with Pandas, NumPy, and Scikit-Learn.'),
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      skillsGiven: 15,
      skillsTaken: 2,
      rating: 4.9,
      reviewsCount: 15,
      createdAt: '2025-10-10T10:00:00.000Z',
    });

    // Seed Initial Skills as shown in images 4, 5, 7
    const skillsList: SkillRecord[] = [
      {
        id: 'skill-1',
        userId: alexId,
        userName: 'Alex Kumar',
        userPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        userCollege: 'Indian Institute of Technology',
        userYear: '3rd Year • CSE',
        title: 'Python Programming',
        category: 'Programming',
        description: 'Learn Python from scratch to build real projects. We will cover basics, data structures, mini projects, web scraping, and career tips.',
        type: 'Teach',
        rating: 4.8,
        reviewsCount: 12,
        createdAt: '2026-02-10T10:00:00.000Z',
      },
      {
        id: 'skill-2',
        userId: priyaId,
        userName: 'Priya Sharma',
        userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
        userCollege: 'Delhi Technological University',
        userYear: '2nd Year • CSE',
        title: 'Python (Beginner)',
        category: 'Programming',
        description: 'Looking to master Python for college coursework. I can teach Adobe Illustrator & Figma prototyping in exchange.',
        type: 'Learn',
        rating: 4.6,
        reviewsCount: 8,
        createdAt: '2026-02-15T10:00:00.000Z',
      },
      {
        id: 'skill-3',
        userId: rahulId,
        userName: 'Rahul Verma',
        userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        userCollege: 'BITS Pilani',
        userYear: '4th Year • CSE',
        title: 'Data Science & Machine Learning',
        category: 'Programming',
        description: 'Comprehensive introduction to data exploration, cleaning, machine learning models, and evaluation with Python.',
        type: 'Teach',
        rating: 4.9,
        reviewsCount: 15,
        createdAt: '2026-01-20T10:00:00.000Z',
      },
      {
        id: 'skill-4',
        userId: snehaId,
        userName: 'Sneha Patel',
        userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        userCollege: 'Vellore Institute of Technology',
        userYear: '3rd Year • IT',
        title: 'UI/UX Design Systems',
        category: 'Design',
        description: 'Wireframing, interactive prototyping, typography hierarchy, and scalable design components in Figma.',
        type: 'Teach',
        rating: 4.7,
        reviewsCount: 10,
        createdAt: '2026-02-18T10:00:00.000Z',
      },
      {
        id: 'skill-5',
        userId: snehaId,
        userName: 'Sneha Patel',
        userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        userCollege: 'Vellore Institute of Technology',
        userYear: '3rd Year • IT',
        title: 'Web Development (React & Tailwind)',
        category: 'Programming',
        description: 'Modern front-end web engineering, component architecture, hooks, responsive styling, and state management.',
        type: 'Teach',
        rating: 4.7,
        reviewsCount: 10,
        createdAt: '2026-02-22T10:00:00.000Z',
      },
      {
        id: 'skill-6',
        userId: johnId,
        userName: 'John Doe',
        userPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        userCollege: 'National Institute of Technology',
        userYear: '3rd Year • CSE',
        title: 'Flutter Mobile App Development',
        category: 'Programming',
        description: 'Cross-platform mobile apps with Flutter, Dart, widgets, state management, and Firebase backend.',
        type: 'Teach',
        rating: 4.8,
        reviewsCount: 16,
        createdAt: '2026-01-25T10:00:00.000Z',
      },
      {
        id: 'skill-7',
        userId: 'user-rohan-mehta',
        userName: 'Rohan Mehta',
        userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        userCollege: 'Delhi University',
        userYear: '3rd Year • Arts',
        title: 'Acoustic Guitar Basics',
        category: 'Music',
        description: 'Chords, strumming patterns, fretboard familiarity, and playing popular songs from day one.',
        type: 'Teach',
        rating: 4.9,
        reviewsCount: 14,
        createdAt: '2026-02-12T10:00:00.000Z',
      },
      {
        id: 'skill-8',
        userId: 'user-ananya-roy',
        userName: 'Ananya Roy',
        userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        userCollege: 'JNU New Delhi',
        userYear: '2nd Year • Linguistics',
        title: 'Conversational Spanish (A1-A2)',
        category: 'Language',
        description: 'Interactive conversational practice, common idioms, pronunciation drills, and practical vocabulary.',
        type: 'Teach',
        rating: 4.8,
        reviewsCount: 9,
        createdAt: '2026-02-14T10:00:00.000Z',
      }
    ];

    skillsList.forEach((s) => this.skills.set(s.id, s));

    // Seed Bookings matching Image 7 Screen 8 (My Bookings)
    this.bookings.set('book-1', {
      id: 'book-1',
      teacherId: alexId,
      teacherName: 'Alex Kumar',
      teacherPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      learnerId: johnId,
      learnerName: 'John Doe',
      skillId: 'skill-1',
      skillTitle: 'Python Programming',
      category: 'Programming',
      dateTime: 'Tomorrow • 4:00 PM',
      status: 'Confirmed',
      notesEncrypted: encryptAES256('Focusing on list comprehensions and dictionary mappings with practice problems.'),
      createdAt: '2026-03-01T10:00:00.000Z',
    });

    this.bookings.set('book-2', {
      id: 'book-2',
      teacherId: snehaId,
      teacherName: 'Sneha Patel',
      teacherPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      learnerId: johnId,
      learnerName: 'John Doe',
      skillId: 'skill-4',
      skillTitle: 'UI/UX Design',
      category: 'Design',
      dateTime: 'May 18 • 2:00 PM',
      status: 'Pending',
      notesEncrypted: encryptAES256('Reviewing mobile mockup layouts and typography contrast guidelines.'),
      createdAt: '2026-03-02T10:00:00.000Z',
    });

    this.bookings.set('book-3', {
      id: 'book-3',
      teacherId: 'user-rohan-mehta',
      teacherName: 'Rohan Mehta',
      teacherPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      learnerId: johnId,
      learnerName: 'John Doe',
      skillId: 'skill-7',
      skillTitle: 'Guitar Basics',
      category: 'Music',
      dateTime: 'May 20 • 5:00 PM',
      status: 'Confirmed',
      notesEncrypted: encryptAES256('Bringing acoustic guitar; learning D major and G major transitions.'),
      createdAt: '2026-03-03T10:00:00.000Z',
    });

    // Seed Chats matching Image 7 Screen 7 & Image 6
    this.chats.push(
      {
        id: 'chat-msg-1',
        senderId: johnId,
        senderName: 'John Doe',
        receiverId: alexId,
        receiverName: 'Alex Kumar',
        messageEncrypted: encryptAES256("Hi! I'm interested in learning Python. Are you available tomorrow?"),
        timestamp: '10:15 AM',
        read: true,
      },
      {
        id: 'chat-msg-2',
        senderId: alexId,
        senderName: 'Alex Kumar',
        receiverId: johnId,
        receiverName: 'John Doe',
        messageEncrypted: encryptAES256("Hey! Yes, I'm available tomorrow at 4 PM. Would you like to book it through the app?"),
        timestamp: '10:16 AM',
        read: true,
      },
      {
        id: 'chat-msg-3',
        senderId: johnId,
        senderName: 'John Doe',
        receiverId: alexId,
        receiverName: 'Alex Kumar',
        messageEncrypted: encryptAES256("Yes, that works for me!"),
        timestamp: '10:17 AM',
        read: true,
      }
    );
  }

  // --- USER AUTH & RECOVERY ---
  public async registerUser(data: {
    name: string;
    email: string;
    password: string;
    college: string;
    year: string;
  }): Promise<UserRecord> {
    const existing = Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const id = 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const passwordHash = await hashPassword(data.password);

    // Encrypt personal sensitive fields at rest using AES-256-GCM
    const collegeEncrypted = encryptAES256(data.college || 'Not Specified');
    const bioEncrypted = encryptAES256('Ready to share and exchange skills!');

    const newUser: UserRecord = {
      id,
      name: data.name,
      email: data.email,
      passwordHash,
      collegeEncrypted,
      year: data.year || '1st Year',
      bioEncrypted,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      skillsGiven: 0,
      skillsTaken: 0,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.users.set(id, newUser);
    return newUser;
  }

  public async authenticate(identifier: string, password: string): Promise<UserRecord | null> {
    const lower = identifier.toLowerCase();
    const user = Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === lower || u.name.toLowerCase() === lower
    );
    if (!user) return null;

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    return user;
  }

  public getUserById(id: string): UserRecord | null {
    return this.users.get(id) || null;
  }

  /**
   * Modifies user data according to the given form.
   * Encrypts personal sensitive fields with AES-256 at rest.
   */
  public modifyUserData(
    id: string,
    updates: {
      name?: string;
      email?: string;
      college?: string;
      year?: string;
      bio?: string;
      photo?: string;
    }
  ): UserRecord {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');

    if (updates.name !== undefined) user.name = updates.name.trim();
    if (updates.email !== undefined) user.email = updates.email.trim();
    if (updates.year !== undefined) user.year = updates.year;
    if (updates.photo !== undefined) user.photo = updates.photo;

    // Encrypt updated personal data using AES-256
    if (updates.college !== undefined) {
      user.collegeEncrypted = encryptAES256(updates.college.trim());
    }
    if (updates.bio !== undefined) {
      user.bioEncrypted = encryptAES256(updates.bio.trim());
    }

    this.users.set(id, user);

    // Also update any skills created by this user
    for (const [skillId, skill] of this.skills.entries()) {
      if (skill.userId === id) {
        if (updates.name) skill.userName = updates.name;
        if (updates.photo) skill.userPhoto = updates.photo;
        if (updates.college) skill.userCollege = updates.college;
        if (updates.year) skill.userYear = `${updates.year}`;
        this.skills.set(skillId, skill);
      }
    }

    return user;
  }

  /**
   * Decrypts personal data in-memory for authorized authenticated response
   */
  public toSafeUser(user: UserRecord) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      college: decryptAES256(user.collegeEncrypted),
      year: user.year,
      bio: decryptAES256(user.bioEncrypted),
      photo: user.photo,
      skillsGiven: user.skillsGiven,
      skillsTaken: user.skillsTaken,
      rating: user.rating,
      reviewsCount: user.reviewsCount,
      createdAt: user.createdAt,
    };
  }

  // --- SKILLS ---
  public getSkills(params?: { category?: string; type?: string; search?: string }): SkillRecord[] {
    let result = Array.from(this.skills.values());

    if (params?.category && params.category !== 'All') {
      result = result.filter(
        (s) => s.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params?.type && params.type !== 'All') {
      result = result.filter((s) => s.type.toLowerCase() === params.type!.toLowerCase());
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.userName.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getSkillById(id: string): SkillRecord | null {
    return this.skills.get(id) || null;
  }

  public addSkill(user: UserRecord, data: {
    title: string;
    category: string;
    description: string;
    type: 'Teach' | 'Learn';
  }): SkillRecord {
    const id = 'skill-' + Date.now().toString(36);
    const newSkill: SkillRecord = {
      id,
      userId: user.id,
      userName: user.name,
      userPhoto: user.photo,
      userCollege: decryptAES256(user.collegeEncrypted),
      userYear: `${user.year}`,
      title: data.title,
      category: data.category,
      description: data.description,
      type: data.type,
      rating: user.rating,
      reviewsCount: user.reviewsCount,
      createdAt: new Date().toISOString(),
    };
    this.skills.set(id, newSkill);

    if (data.type === 'Teach') {
      user.skillsGiven += 1;
    } else {
      user.skillsTaken += 1;
    }
    this.users.set(user.id, user);

    return newSkill;
  }

  // --- BOOKINGS / SESSIONS ---
  public getBookingsForUser(userId: string): any[] {
    const list = Array.from(this.bookings.values()).filter(
      (b) => b.teacherId === userId || b.learnerId === userId
    );

    return list.map((b) => ({
      ...b,
      notes: decryptAES256(b.notesEncrypted),
    }));
  }

  public createBooking(data: {
    teacherId: string;
    learnerId: string;
    skillId: string;
    dateTime: string;
    notes?: string;
  }): any {
    const teacher = this.users.get(data.teacherId);
    const learner = this.users.get(data.learnerId);
    const skill = this.skills.get(data.skillId);

    if (!teacher || !learner || !skill) {
      throw new Error('Invalid teacher, learner, or skill');
    }

    const id = 'book-' + Date.now().toString(36);
    const notesEncrypted = encryptAES256(data.notes || 'Skill session scheduled through Skill Swap app.');

    const newBooking: BookingRecord = {
      id,
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherPhoto: teacher.photo,
      learnerId: learner.id,
      learnerName: learner.name,
      skillId: skill.id,
      skillTitle: skill.title,
      category: skill.category,
      dateTime: data.dateTime,
      status: 'Confirmed',
      notesEncrypted,
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(id, newBooking);

    return {
      ...newBooking,
      notes: decryptAES256(newBooking.notesEncrypted),
    };
  }

  public updateBookingStatus(id: string, status: BookingRecord['status']): boolean {
    const booking = this.bookings.get(id);
    if (!booking) return false;
    booking.status = status;
    this.bookings.set(id, booking);
    return true;
  }

  // --- CHATS ---
  public getMessagesBetween(userA: string, userB: string): any[] {
    const filtered = this.chats.filter(
      (c) =>
        (c.senderId === userA && c.receiverId === userB) ||
        (c.senderId === userB && c.receiverId === userA)
    );

    return filtered.map((c) => ({
      id: c.id,
      senderId: c.senderId,
      senderName: c.senderName,
      receiverId: c.receiverId,
      receiverName: c.receiverName,
      message: decryptAES256(c.messageEncrypted),
      timestamp: c.timestamp,
      read: c.read,
      encryptionMetadata: {
        algorithm: c.messageEncrypted.algorithm,
        iv: c.messageEncrypted.iv,
        authTag: c.messageEncrypted.authTag,
      },
    }));
  }

  public sendMessage(sender: UserRecord, receiverId: string, message: string): any {
    const receiver = this.users.get(receiverId);
    if (!receiver) throw new Error('Receiver not found');

    const messageEncrypted = encryptAES256(message);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const record: ChatMessageRecord = {
      id: 'chat-msg-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      senderId: sender.id,
      senderName: sender.name,
      receiverId: receiver.id,
      receiverName: receiver.name,
      messageEncrypted,
      timestamp: timeStr,
      read: false,
    };

    this.chats.push(record);

    return {
      id: record.id,
      senderId: record.senderId,
      senderName: record.senderName,
      receiverId: record.receiverId,
      receiverName: record.receiverName,
      message: decryptAES256(record.messageEncrypted),
      timestamp: record.timestamp,
      read: record.read,
      encryptionMetadata: {
        algorithm: record.messageEncrypted.algorithm,
        iv: record.messageEncrypted.iv,
        authTag: record.messageEncrypted.authTag,
      },
    };
  }

  // --- LIVE CRYPTOGRAPHIC VAULT INSPECTOR ---
  // Returns raw database state at rest with ciphertext, IV, authTag for security verification!
  public getRawDatabaseVault() {
    const rawUsers = Array.from(this.users.values()).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHashBcrypt: u.passwordHash,
      collegeEncryptedAES256: u.collegeEncrypted,
      year: u.year,
      bioEncryptedAES256: u.bioEncrypted,
      rating: u.rating,
      createdAt: u.createdAt,
    }));

    const rawChats = this.chats.map((c) => ({
      id: c.id,
      senderId: c.senderId,
      receiverId: c.receiverId,
      messageCiphertextAES256: c.messageEncrypted,
      timestamp: c.timestamp,
    }));

    const rawBookings = Array.from(this.bookings.values()).map((b) => ({
      id: b.id,
      skillTitle: b.skillTitle,
      status: b.status,
      notesEncryptedAES256: b.notesEncrypted,
      dateTime: b.dateTime,
    }));

    return {
      encryptionStandard: 'AES-256-GCM (Galois/Counter Mode)',
      sessionStandard: 'JSON Web Token (JWT) HS256',
      passwordHashing: 'bcrypt (10 rounds)',
      recordsCount: {
        users: rawUsers.length,
        chats: rawChats.length,
        bookings: rawBookings.length,
        skills: this.skills.size,
      },
      tablesAtRest: {
        users: rawUsers,
        chats: rawChats,
        bookings: rawBookings,
      },
    };
  }
}

export const db = new SecureDatabase();
