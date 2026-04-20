import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const sessionsCollection = collection(db, "examSessions");
const mistakesCollection = collection(db, "mistakes");

function sortByNewestDate(items, fieldName) {
  return [...items].sort((firstItem, secondItem) => {
    return new Date(secondItem[fieldName]) - new Date(firstItem[fieldName]);
  });
}

export async function fetchUserSessions(userId) {
  const sessionsQuery = query(sessionsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(sessionsQuery);

  const sessions = snapshot.docs.map((sessionDoc) => {
    return {
      id: sessionDoc.id,
      ...sessionDoc.data(),
    };
  });

  return sortByNewestDate(sessions, "examDate");
}

export async function fetchSession(sessionId) {
  const sessionDoc = await getDoc(doc(db, "examSessions", sessionId));

  if (!sessionDoc.exists()) {
    return null;
  }

  return {
    id: sessionDoc.id,
    ...sessionDoc.data(),
  };
}

export async function fetchSessionForUser(userId, sessionId) {
  const sessions = await fetchUserSessions(userId);

  return sessions.find((session) => session.id === sessionId) || null;
}

export async function createSession(userId, sessionData, imageFile) {
  const now = new Date().toISOString();

  const docRef = await addDoc(sessionsCollection, {
    ...sessionData,
    userId,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

export async function updateSession(sessionId, userId, sessionData, imageFile) {
  await updateDoc(doc(db, "examSessions", sessionId), {
    ...sessionData,
    userId,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteSessionAndMistakes(session) {
  const userMistakes = await fetchUserMistakes(session.userId);
  const sessionMistakes = userMistakes.filter((mistake) => mistake.sessionId === session.id);

  for (const mistake of sessionMistakes) {
    await deleteDoc(doc(db, "mistakes", mistake.id));
  }

  await deleteDoc(doc(db, "examSessions", session.id));
}

export async function fetchUserMistakes(userId) {
  const mistakesQuery = query(mistakesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(mistakesQuery);

  const mistakes = snapshot.docs.map((mistakeDoc) => {
    return {
      id: mistakeDoc.id,
      ...mistakeDoc.data(),
    };
  });

  return sortByNewestDate(mistakes, "updatedAt");
}

export async function fetchSessionMistakes(sessionId) {
  const mistakesQuery = query(mistakesCollection, where("sessionId", "==", sessionId));
  const snapshot = await getDocs(mistakesQuery);

  const mistakes = snapshot.docs.map((mistakeDoc) => {
    return {
      id: mistakeDoc.id,
      ...mistakeDoc.data(),
    };
  });

  return [...mistakes].sort((firstMistake, secondMistake) => {
    return Number(firstMistake.questionNumber) - Number(secondMistake.questionNumber);
  });
}

export async function fetchSessionMistakesForUser(userId, sessionId) {
  const userMistakes = await fetchUserMistakes(userId);
  const sessionMistakes = userMistakes.filter((mistake) => mistake.sessionId === sessionId);

  return [...sessionMistakes].sort((firstMistake, secondMistake) => {
    return Number(firstMistake.questionNumber) - Number(secondMistake.questionNumber);
  });
}

export async function createMistake(userId, sessionId, mistakeData) {
  const now = new Date().toISOString();

  await addDoc(mistakesCollection, {
    ...mistakeData,
    userId,
    sessionId,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateMistake(mistakeId, mistakeData) {
  await updateDoc(doc(db, "mistakes", mistakeId), {
    ...mistakeData,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMistake(mistakeId) {
  await deleteDoc(doc(db, "mistakes", mistakeId));
}
