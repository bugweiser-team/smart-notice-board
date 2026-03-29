import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { Notice, NoticeFormData, AppUser } from './types';

const NOTICES_COLLECTION = 'notices';
const USERS_COLLECTION = 'users';

// Convert Firestore doc to Notice
function docToNotice(docSnap: { id: string; data: () => Record<string, unknown> }): Notice {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title as string,
    body: data.body as string,
    category: data.category as Notice['category'],
    tags: (data.tags as string[]) || ['ALL'],
    urgency: data.urgency as Notice['urgency'],
    postedBy: data.postedBy as string,
    postedAt: (data.postedAt as Timestamp)?.toDate?.() || new Date(data.postedAt as string),
    expiryDate: (data.expiryDate as Timestamp)?.toDate?.() || new Date(data.expiryDate as string),
    isPinned: data.isPinned as boolean,
    attachmentUrl: (data.attachmentUrl as string) || null,
    attachmentName: (data.attachmentName as string) || null,
  };
}

// Get all notices (one-time)
export async function getNotices(): Promise<Notice[]> {
  const q = query(collection(db, NOTICES_COLLECTION), orderBy('postedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToNotice);
}

// Get single notice
export async function getNotice(id: string): Promise<Notice | null> {
  const docRef = doc(db, NOTICES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docToNotice(docSnap as unknown as { id: string; data: () => Record<string, unknown> });
}

// Real-time notices listener
export function onNoticesSnapshot(callback: (notices: Notice[]) => void): () => void {
  const q = query(collection(db, NOTICES_COLLECTION), orderBy('postedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const notices = snapshot.docs.map(docToNotice);
    callback(notices);
  });
}

// Add a notice
export async function addNotice(data: NoticeFormData): Promise<string> {
  const docRef = await addDoc(collection(db, NOTICES_COLLECTION), {
    ...data,
    postedAt: Timestamp.now(),
    expiryDate: Timestamp.fromDate(new Date(data.expiryDate)),
    attachmentUrl: data.attachmentUrl || null,
    attachmentName: data.attachmentName || null,
  });
  return docRef.id;
}

// Update a notice
export async function updateNotice(id: string, data: Partial<NoticeFormData>): Promise<void> {
  const docRef = doc(db, NOTICES_COLLECTION, id);
  const updateData: Record<string, unknown> = { ...data };
  if (data.expiryDate) {
    updateData.expiryDate = Timestamp.fromDate(new Date(data.expiryDate));
  }
  await updateDoc(docRef, updateData);
}

// Delete a notice
export async function deleteNotice(id: string): Promise<void> {
  await deleteDoc(doc(db, NOTICES_COLLECTION, id));
}

// Toggle pin
export async function togglePin(id: string, isPinned: boolean): Promise<void> {
  const docRef = doc(db, NOTICES_COLLECTION, id);
  await updateDoc(docRef, { isPinned });
}

// Get user profile
export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { uid: docSnap.id, ...docSnap.data() } as AppUser;
}

// Update user profile
export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, data as Record<string, unknown>);
}

// Seed notices to Firestore
export async function seedNoticesToFirestore(notices: Omit<Notice, 'id'>[]): Promise<void> {
  const existingNotices = await getDocs(collection(db, NOTICES_COLLECTION));
  if (!existingNotices.empty) return; // Already seeded

  for (const notice of notices) {
    await addDoc(collection(db, NOTICES_COLLECTION), {
      ...notice,
      postedAt: Timestamp.fromDate(notice.postedAt),
      expiryDate: Timestamp.fromDate(notice.expiryDate),
    });
  }
}

// Get count of pinned notices
export async function getPinnedCount(): Promise<number> {
  const q = query(collection(db, NOTICES_COLLECTION), where('isPinned', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.size;
}
