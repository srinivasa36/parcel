import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../config/firebase";

const AuthContext = createContext(null);

const toUser = (u) =>
  u
    ? {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
      }
    : null;

const requireAuth = () => {
  if (!auth)
    throw new Error(
      "Sign-in isn’t set up yet. Add your Firebase keys to the .env file (see README).",
    );
  return auth;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(toUser(firebaseUser));
      setLoading(false);
    });
  }, []);

  const login = useCallback(
    (email, password) =>
      signInWithEmailAndPassword(requireAuth(), email, password),
    [],
  );

  const register = useCallback(async ({ name, email, password }) => {
    const credential = await createUserWithEmailAndPassword(
      requireAuth(),
      email,
      password,
    );
    await updateProfile(credential.user, { displayName: name });
    setUser(toUser(auth.currentUser));
  }, []);

  const loginWithGoogle = useCallback(
    () => signInWithPopup(requireAuth(), new GoogleAuthProvider()),
    [],
  );
  const resetPassword = useCallback(
    (email) => sendPasswordResetEmail(requireAuth(), email),
    [],
  );
  const logout = useCallback(() => signOut(requireAuth()), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      configured: isFirebaseConfigured,
      login,
      register,
      loginWithGoogle,
      resetPassword,
      logout,
    }),
    [user, loading, login, register, loginWithGoogle, resetPassword, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
