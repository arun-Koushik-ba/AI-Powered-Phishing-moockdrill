
import { db, User } from './database';

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  message?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await db.findUserByEmail(email);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Simple password check (in a real app, use proper hashing)
      if (user.password !== password) {
        return { success: false, message: 'Invalid password' };
      }

      const { password: _, ...userWithoutPassword } = user;
      
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  },

  async signup(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      const existingUser = await db.findUserByEmail(email);
      
      if (existingUser) {
        return { success: false, message: 'User already exists' };
      }

      const newUser = await db.createUser({
        email,
        password,
        fullName
      });

      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, message: 'Signup failed' };
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await db.findUserByEmail(email);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // In a real app, you'd send an email with reset link
      // For demo, we'll just return success
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      return { success: false, message: 'Reset failed' };
    }
  },

  logout(): void {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser(): Omit<User, 'password'> | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
};
