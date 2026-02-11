import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ============ Types ============

export interface Prize {
  id: string;
  prizeName: string;
  keyDetails: string;
  prizeValue: number;
  sponsorId: string;
  sponsorName: string;
  stockLevel: number;
  status: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Raffle {
  id: string;
  title: string;
  prizeId: string;
  prizeName: string;
  sponsorId: string;
  sponsorName: string;
  ticketSold: number;
  ticketPrice: string;
  startAt: Date;
  endAt: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  status: string;
  createdAt: Date;
}

export interface GamerUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  registrationDate: Date;
  status: string;
}

export interface Admin {
  id: string;
  uid: string;
  email: string;
  name: string;
  company: string;
  role: string;
  phone: string;
  status: string;
  createdAt: Date;
}

// ============ Prizes ============

export async function getPrizes(): Promise<Prize[]> {
  const q = query(collection(db, "prize_database"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Prize[];
}

export async function createPrize(data: Omit<Prize, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, "prize_database"), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updatePrize(id: string, data: Partial<Prize>) {
  return updateDoc(doc(db, "prize_database", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePrize(id: string) {
  return deleteDoc(doc(db, "prize_database", id));
}

// ============ Raffles ============

export async function getRaffles(): Promise<Raffle[]> {
  const q = query(collection(db, "raffles"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    startAt: doc.data().startAt?.toDate() || new Date(),
    endAt: doc.data().endAt?.toDate() || new Date(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Raffle[];
}

export async function getLiveRafflesCount(): Promise<number> {
  const q = query(collection(db, "raffles"), where("status", "==", "live"));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function getTotalTicketsSold(): Promise<number> {
  const snapshot = await getDocs(collection(db, "raffles"));
  return snapshot.docs.reduce((sum, doc) => sum + (doc.data().ticketSold || 0), 0);
}

export async function createRaffle(data: Omit<Raffle, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, "raffles"), {
    ...data,
    startAt: Timestamp.fromDate(data.startAt),
    endAt: Timestamp.fromDate(data.endAt),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

// ============ Sponsors ============

export async function getSponsors(): Promise<Sponsor[]> {
  const q = query(collection(db, "sponsors"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Sponsor[];
}

export async function createSponsor(data: Omit<Sponsor, "id" | "createdAt">) {
  return addDoc(collection(db, "sponsors"), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

// ============ Users (Gamers) ============

export async function getUsers(): Promise<GamerUser[]> {
  const q = query(collection(db, "users"), orderBy("registrationDate", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    registrationDate: doc.data().registrationDate?.toDate() || new Date(),
  })) as GamerUser[];
}

export async function getUsersCount(): Promise<number> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.size;
}

// ============ Admins ============

export async function getAdmins(): Promise<Admin[]> {
  const q = query(collection(db, "admins"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Admin[];
}

export async function createAdmin(uid: string, data: Omit<Admin, "id" | "createdAt">) {
  return setDoc(doc(db, "admins", uid), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function getAdminByUid(uid: string): Promise<Admin | null> {
  const docSnap = await getDoc(doc(db, "admins", uid));
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    } as Admin;
  }
  return null;
}

// ============ KPIs ============

export async function getLowStockCount(): Promise<number> {
  const q = query(collection(db, "prize_database"), where("stockLevel", "<=", 3));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function getLowStockPrizes(): Promise<Prize[]> {
  const q = query(
    collection(db, "prize_database"),
    where("stockLevel", "<=", 5),
    orderBy("stockLevel", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.slice(0, 6).map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Prize[];
}
