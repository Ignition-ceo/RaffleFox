import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Dev mode flag - set to true to bypass auth for development
const AUTH_DISABLED = import.meta.env.VITE_AUTH_DISABLED === "true";

export interface AdminProfile {
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

// Mock dev user for when auth is disabled
const DEV_USER_PROFILE: AdminProfile = {
  id: "dev",
  uid: "dev",
  email: "dev@rafflefox.local",
  name: "Dev User",
  company: "Raffle Fox",
  role: "super_admin",
  phone: "",
  status: "active",
  createdAt: new Date(),
};

interface AuthContextType {
  user: User | null;
  adminProfile: AdminProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  authDisabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(
    AUTH_DISABLED ? DEV_USER_PROFILE : null
  );
  const [loading, setLoading] = useState(!AUTH_DISABLED);

  useEffect(() => {
    // Skip Firebase auth when disabled
    if (AUTH_DISABLED) {
      console.log("[DEV MODE] Auth disabled - using mock dev user");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch admin profile from Firestore
        try {
          const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            setAdminProfile({
              id: adminDoc.id,
              uid: data.uid,
              email: data.email,
              name: data.name,
              company: data.company,
              role: data.role,
              phone: data.phone,
              status: data.status,
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          } else {
            setAdminProfile(null);
          }
        } catch (error) {
          console.error("Error fetching admin profile:", error);
          setAdminProfile(null);
        }
      } else {
        setAdminProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    if (AUTH_DISABLED) return;
    await signOut(auth);
    setAdminProfile(null);
  };

  const isAdmin = AUTH_DISABLED || (!!adminProfile && adminProfile.status === "active");

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        loading,
        signIn,
        signUp,
        logout,
        isAdmin,
        authDisabled: AUTH_DISABLED,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
