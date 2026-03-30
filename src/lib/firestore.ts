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
  setDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';
import { Notice, NoticeFormData, AppUser, Assignment } from './types';

const NOTICES_COLLECTION = 'notices';
const USERS_COLLECTION = 'users';
const ASSIGNMENTS_COLLECTION = 'assignments';

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

// Convert Firestore doc to Assignment
function docToAssignment(docSnap: { id: string; data: () => Record<string, unknown> }): Assignment {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title as string,
    course: data.course as string,
    description: (data.description as string) || '',
    dueDate: (data.dueDate as Timestamp)?.toDate?.() || new Date(data.dueDate as string),
    tags: (data.tags as string[]) || ['ALL'],
    isCompleted: false,
    postedBy: data.postedBy as string,
    postedAt: (data.postedAt as Timestamp)?.toDate?.() || new Date(data.postedAt as string),
  };
}

// ──────────── NOTICES ────────────

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
export function onNoticesSnapshot(callback: (notices: Notice[]) => void, onError?: (error: Error) => void): () => void {
  const q = query(collection(db, NOTICES_COLLECTION), orderBy('postedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const notices = snapshot.docs.map(docToNotice);
    callback(notices);
  }, (error) => {
    console.error("Firestore Snapshot Error:", error);
    if (onError) onError(error);
  });
}

// Real-time notices listener WITH change detection (for notifications)
export function onNoticesSnapshotWithChanges(
  callback: (notices: Notice[]) => void,
  onNewNotice: (notice: Notice) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(collection(db, NOTICES_COLLECTION), orderBy('postedAt', 'desc'));
  let isInitialLoad = true;
  return onSnapshot(q, (snapshot) => {
    const notices = snapshot.docs.map(docToNotice);
    callback(notices);
    if (isInitialLoad) {
      isInitialLoad = false;
      return;
    }
    // Fire callback for genuinely new notices
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const newNotice = docToNotice(change.doc as unknown as { id: string; data: () => Record<string, unknown> });
        onNewNotice(newNotice);
      }
    });
  }, (error) => {
    console.error("Firestore Snapshot Error:", error);
    if (onError) onError(error);
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

// ──────────── ASSIGNMENTS ────────────

// Real-time assignments listener
export function onAssignmentsSnapshot(callback: (assignments: Assignment[]) => void, onError?: (error: Error) => void): () => void {
  const q = query(collection(db, ASSIGNMENTS_COLLECTION), orderBy('dueDate', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const assignments = snapshot.docs.map(docToAssignment);
    callback(assignments);
  }, (error) => {
    console.error("Assignments Snapshot Error:", error);
    if (onError) onError(error);
  });
}

// Add assignment
export async function addAssignment(data: {
  title: string;
  course: string;
  description: string;
  dueDate: string;
  tags: string[];
  postedBy: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, ASSIGNMENTS_COLLECTION), {
    ...data,
    dueDate: Timestamp.fromDate(new Date(data.dueDate)),
    postedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Delete assignment
export async function deleteAssignment(id: string): Promise<void> {
  await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, id));
}

// Toggle assignment completion for a user
export async function toggleAssignmentCompletion(uid: string, assignmentId: string, completed: boolean): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  if (completed) {
    await updateDoc(docRef, { completedAssignments: arrayUnion(assignmentId) });
  } else {
    await updateDoc(docRef, { completedAssignments: arrayRemove(assignmentId) });
  }
}

// ──────────── USERS ────────────

// Get user profile
export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { uid: docSnap.id, ...docSnap.data() } as AppUser;
}

// Create new user profile
export async function createUserProfile(uid: string, data: Omit<AppUser, "uid">): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await setDoc(docRef, data);
}

// Update user profile
export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, data as Record<string, unknown>);
}

// Mark notice as read
export async function markNoticeAsRead(uid: string, noticeId: string): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, {
    readNotices: arrayUnion(noticeId)
  });
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
