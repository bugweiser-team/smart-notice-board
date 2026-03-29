import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerStudent(
  email: string, 
  password: string, 
  name: string,
  department: string,
  year: number
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  const { createUserProfile } = await import('@/lib/firestore');
  
  await createUserProfile(result.user.uid, {
    email,
    name,
    department,
    year,
    courses: [],
    isAdmin: false,
    role: 'student',
    tags: [`${department}-${year}`, 'ALL'],
    subscribedCategories: ['Academic', 'General'],
    fcmToken: null,
    readNotices: [],
  });
  
  return result.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
