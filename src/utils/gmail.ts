import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize firebase app if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const gmailAuth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add required Gmail scopes
provider.addScope('https://mail.google.com/');
provider.addScope('https://www.googleapis.com/auth/gmail.compose');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initGmailAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(gmailAuth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(gmailAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google OAuth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGmailAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setGmailAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const googleSignOut = async () => {
  await gmailAuth.signOut();
  cachedAccessToken = null;
};

// Helper to build a standard simple MIME email
function buildSimpleMime(to: string, subject: string, htmlContent: string) {
  const emailLines = [
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    "",
    htmlContent
  ];
  return emailLines.join("\r\n");
}

// Send email using Gmail API
export const sendGmailEmail = async (to: string, subject: string, htmlBody: string): Promise<any> => {
  if (!cachedAccessToken) {
    throw new Error('User not authenticated with Gmail. Please sign in first.');
  }

  const rawMime = buildSimpleMime(to, subject, htmlBody);
  const base64Safe = btoa(unescape(encodeURIComponent(rawMime)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: base64Safe
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail API failed: ${errText}`);
  }

  return res.json();
};

// List messages from Gmail
export const listGmailMessages = async (query: string = '', maxResults: number = 10): Promise<any[]> => {
  if (!cachedAccessToken) {
    throw new Error('User not authenticated with Gmail. Please sign in first.');
  }

  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${cachedAccessToken}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to list Gmail messages');
  }

  const data = await res.json();
  if (!data.messages) return [];

  const details = await Promise.all(
    data.messages.map(async (msg: { id: string }) => {
      try {
        const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: {
            'Authorization': `Bearer ${cachedAccessToken}`
          }
        });
        if (detailRes.ok) {
          return detailRes.json();
        }
      } catch (err) {
        console.error(`Failed to fetch email details for id ${msg.id}`, err);
      }
      return null;
    })
  );

  return details.filter(Boolean);
};

// Helper to extract clean headers from Gmail message
export function parseGmailMessage(msg: any) {
  if (!msg || !msg.payload) return null;
  const headers = msg.payload.headers || [];
  
  const getHeader = (name: string) => {
    const found = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
    return found ? found.value : '';
  };

  const subject = getHeader('subject');
  const from = getHeader('from');
  const to = getHeader('to');
  const date = getHeader('date');
  const snippet = msg.snippet || '';

  // Extract body
  let body = '';
  if (msg.payload.body && msg.payload.body.data) {
    body = decodeBase64Url(msg.payload.body.data);
  } else if (msg.payload.parts) {
    // Look for text/html or text/plain
    const findPartBody = (parts: any[]): string => {
      for (const part of parts) {
        if (part.mimeType === 'text/html' && part.body && part.body.data) {
          return decodeBase64Url(part.body.data);
        }
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          return decodeBase64Url(part.body.data);
        }
        if (part.parts) {
          const sub = findPartBody(part.parts);
          if (sub) return sub;
        }
      }
      return '';
    };
    body = findPartBody(msg.payload.parts);
  }

  return {
    id: msg.id,
    subject,
    from,
    to,
    date,
    snippet,
    body: body || snippet
  };
}

function decodeBase64Url(data: string) {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(atob(base64)));
}
