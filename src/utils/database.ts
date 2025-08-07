
export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: Date;
}

class DatabaseManager {
  private static instance: DatabaseManager;
  private readonly USERS_KEY = 'app_users';

  private constructor() {
    this.initializeDatabase();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeDatabase() {
    // Initialize localStorage with default user if not exists
    const existingUsers = this.getAllUsersFromStorage();
    
    if (existingUsers.length === 0) {
      this.createDefaultUser();
    }
  }

  private createDefaultUser() {
    const defaultUser: User = {
      id: '1',
      email: 'admin@example.com',
      password: 'password', // In a real app, this would be hashed
      fullName: 'Admin User',
      createdAt: new Date()
    };

    const users = [defaultUser];
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private getAllUsersFromStorage(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    if (!usersJson) return [];
    
    const users = JSON.parse(usersJson);
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }));
  }

  private saveUsersToStorage(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = this.getAllUsersFromStorage();
    return users.find(user => user.email === email) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = this.getAllUsersFromStorage();
    const id = (users.length + 1).toString();
    
    const newUser: User = {
      id,
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      fullName: userData.fullName,
      createdAt: new Date()
    };

    users.push(newUser);
    this.saveUsersToStorage(users);

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.getAllUsersFromStorage();
  }
}

export const db = DatabaseManager.getInstance();
