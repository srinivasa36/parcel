const MESSAGES = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/email-already-in-use":
    "An account with this email already exists. Try signing in.",
  "auth/weak-password": "Choose a password with at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
  "auth/network-request-failed":
    "Network error. Check your connection and try again.",
  "auth/operation-not-allowed":
    "This sign-in method isn’t enabled in your Firebase project yet.",
  "auth/unauthorized-domain":
    "Add this domain to Authorized domains in Firebase Authentication settings.",
};

export function getAuthErrorMessage(err) {
  if (
    err?.code === "auth/popup-closed-by-user" ||
    err?.code === "auth/cancelled-popup-request"
  )
    return null;
  return (
    MESSAGES[err?.code] ||
    err?.message ||
    "Something went wrong. Please try again."
  );
}
