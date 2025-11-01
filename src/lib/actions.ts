'use server';

import { revalidatePath } from "next/cache";
import { initializeFirebase } from "@/firebase";
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002/api';

async function fetchApi(endpoint: string, options?: RequestInit) {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            cache: 'no-store',
            ...options
        });
        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`API Error (${res.status}) on ${endpoint}: ${errorBody}`);
            throw new Error(`Request failed with status ${res.status}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : { success: true };
    } catch (error) {
        console.error(`Fetch error for endpoint ${endpoint}:`, error);
        return { success: false, message: (error as Error).message };
    }
}


// Sales
export async function getProducts() {
    return fetchApi('/sales');
}

// Reservations
export async function getReservations() {
    return fetchApi('/reservations');
}

export async function createReservation(data: { servicio: string, fecha: string, hora: string, usuarioId: string }) {
    const result = await fetchApi('/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (result.success) {
        revalidatePath('/');
    }
    return result;
}

// Notifications
export async function sendTestNotification() {
    return fetchApi('/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            destino: 'test@example.com',
            mensaje: 'This is a test notification!'
        }),
    });
}

// Reports
export async function getSalesReport() {
    return fetchApi('/reports');
}

// API Status
export async function getApiStatus() {
    return fetchApi('/status');
}

// Google Maps
export async function geocodeAddress(address: string) {
    // We need to retrieve the API key from a secure, server-side location.
    // We'll read it from the 'integrations' collection in Firestore.
    const { firestore } = initializeFirebase();
    const integrationDoc = await getDoc(doc(firestore, "integrations", "google-maps"));

    if (!integrationDoc.exists() || !integrationDoc.data()?.active) {
        return { status: 'ERROR', error_message: 'Google Maps integration is not active or configured.' };
    }
    const apiKey = integrationDoc.data()?.key;
    if (!apiKey) {
         return { status: 'ERROR', error_message: 'Google Maps API key is not set.' };
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const resp = await fetch(url, { cache: 'no-store' });
    return resp.json();
}

export async function findNearbyPlaces(lat: number, lng: number, type: string) {
    const { firestore } = initializeFirebase();
    const integrationDoc = await getDoc(doc(firestore, "integrations", "google-maps"));
     if (!integrationDoc.exists() || !integrationDoc.data()?.active) {
        return { status: 'ERROR', error_message: 'Google Maps integration is not active or configured.' };
    }
    const apiKey = integrationDoc.data()?.key;
    if (!apiKey) {
         return { status: 'ERROR', error_message: 'Google Maps API key is not set.' };
    }
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${type}&key=${apiKey}`;
    const resp = await fetch(url, { cache: 'no-store' });
    return resp.json();
}

// Integrations
export async function getIntegrations() {
  const { firestore } = initializeFirebase();
  try {
    const integrationsCollection = collection(firestore, "integrations");
    const snapshot = await getDocs(integrationsCollection);
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching integrations: ", error);
    // Return empty array on error to avoid crashing the client
    return [];
  }
}

export async function updateIntegration(id: string, data: Partial<{ active: boolean; key: string }>) {
  const { firestore } = initializeFirebase();
  try {
    const integrationRef = doc(firestore, "integrations", id);
    await setDoc(integrationRef, data, { merge: true });
    revalidatePath('/'); // Revalidate the page to show the updated state
    return { success: true, message: `Integration ${id} updated.` };
  } catch (error) {
    console.error(`Error updating integration ${id}: `, error);
    return { success: false, message: (error as Error).message };
  }
}
