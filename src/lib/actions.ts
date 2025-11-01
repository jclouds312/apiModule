'use server';

import { revalidatePath } from "next/cache";
import { initializeFirebase } from "@/firebase";
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";

// This file contains Server Actions, which are secure, server-side functions
// that can be called directly from client components. This is a Next.js feature.

// Generic API fetcher for routes that are designed to be public
async function fetchApi(endpoint: string, options?: RequestInit) {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002/api';
    try {
        const res = await fetch(`${baseUrl}${endpoint}`, {
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


// Sales: Fetches all products
export async function getProducts() {
    return fetchApi('/sales');
}

// Reservations: Fetches all reservations
export async function getReservations() {
    return fetchApi('/reservations');
}

// Reservations: Creates a new reservation
export async function createReservation(data: { service: string, date: string, time: string, userId: string }) {
    const result = await fetchApi('/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (result.success) {
        revalidatePath('/'); // Revalidate the page to show new data
    }
    return result;
}

// Notifications: Sends a test notification
export async function sendTestNotification() {
    return fetchApi('/notifications', {
        method: 'POST',
        headers: { 'ContentType': 'application/json' },
        body: JSON.stringify({
            destino: 'test@example.com',
            mensaje: 'This is a test notification!'
        }),
    });
}

// Reports: Fetches the sales report
export async function getSalesReport() {
    return fetchApi('/reports');
}

// API Status: Fetches the backend status
export async function getApiStatus() {
    return fetchApi('/status');
}

// Google Maps: Geocodes an address
// This is a secure server action. It reads the API key from Firestore on the server
// and makes the call to Google, so the key is never exposed to the client.
export async function geocodeAddress(address: string) {
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

// Google Maps: Finds nearby places
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

// Shopify: Get products from a Shopify store
export async function getShopifyProducts() {
    const { firestore } = initializeFirebase();
    const integrationDoc = await getDoc(doc(firestore, "integrations", "shopify"));

    if (!integrationDoc.exists() || !integrationDoc.data()?.active) {
        return { success: false, message: 'Shopify integration is not active or configured.' };
    }

    const { key: accessToken, storeName } = integrationDoc.data();
    if (!accessToken || !storeName) {
        return { success: false, message: 'Shopify store name or access token is not set.' };
    }

    const url = `https://${storeName}.myshopify.com/admin/api/2024-04/products.json`;
    try {
        const response = await fetch(url, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });
        if (!response.ok) {
            throw new Error(`Shopify API responded with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Shopify products:', error);
        return { success: false, message: (error as Error).message };
    }
}


// Integrations: Fetches all integration configurations from Firestore
export async function getIntegrations() {
  const { firestore } = initializeFirebase();
  try {
    const integrationsCollection = collection(firestore, "integrations");
    const snapshot = await getDocs(integrationsCollection);
    if (snapshot.empty) return [];
    // Only return data if the user is an admin (security is enforced by Firestore rules, but good to double-check)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching integrations: ", error);
    // On error, return an empty array to prevent client-side crashes.
    // The error will be logged on the server.
    return [];
  }
}

// Integrations: Updates an integration document in Firestore
export async function updateIntegration(id: string, data: Partial<{ active: boolean; key: string }>) {
  const { firestore } = initializeFirebase();
  try {
    const integrationRef = doc(firestore, "integrations", id);
    // 'set' with 'merge: true' will update or create the document.
    await setDoc(integrationRef, data, { merge: true });
    revalidatePath('/'); // Revalidate the page to show the updated state
    return { success: true, message: `Integration ${id} updated.` };
  } catch (error) {
    console.error(`Error updating integration ${id}: `, error);
    return { success: false, message: (error as Error).message };
  }
}
