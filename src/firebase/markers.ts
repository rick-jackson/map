import {
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

interface Marker {
  id: string;
  lat: number;
  long: number;
  timestamp: number;
}

const fetchMarkers = async (): Promise<Marker[]> => {
  const q = query(collection(db, "markers"), orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Marker[];
};

const addMarker = async (lng: number, lat: number) => {
  const timestamp = Date.now();
  await addDoc(collection(db, "markers"), { long: lng, lat, timestamp });
};

const updateMarker = async (id: string, lng: number, lat: number) => {
  const markerRef = doc(db, "markers", id);
  await updateDoc(markerRef, { long: lng, lat });
};

const deleteMarker = async (id: string) => {
  await deleteDoc(doc(db, "markers", id));
};

const deleteAllMarkers = async () => {
  const markersData = await fetchMarkers();
  for (const marker of markersData) {
    await deleteDoc(doc(db, "markers", marker.id));
  }
};

export {
  fetchMarkers,
  addMarker,
  updateMarker,
  deleteMarker,
  deleteAllMarkers,
};
export type { Marker };
