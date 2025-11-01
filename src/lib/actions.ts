'use server';

import { revalidatePath } from "next/cache";
import { initializeFirebase } from "@/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

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
export async function createReservation(data: any) {
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
    return fetchApi(`/maps/geocode?address=${encodeURIComponent(address)}`);
}

export async function findNearbyPlaces(lat: number, lng: number, type: string) {
    return fetchApi(`/maps/places?lat=${lat}&lng=${lng}&type=${type}`);
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

export async function updateIntegration(name: string, data: { active: boolean, key?: string }) {
  const { firestore } = initializeFirebase();
  try {
    const integrationRef = doc(firestore, "integrations", name);
    await setDoc(integrationRef, data, { merge: true });
    revalidatePath('/'); // Revalidate the page to show the updated state
    return { success: true, message: `Integration ${name} updated.` };
  } catch (error) {
    console.error(`Error updating integration ${name}: `, error);
    return { success: false, message: (error as Error).message };
  }
}
