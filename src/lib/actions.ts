'use server';

import { revalidatePath } from "next/cache";
import { initializeFirebase } from "@/firebase";
import { collection, getDocs, doc, setDoc, addDoc, getDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

// This file contains Server Actions, which are secure, server-side functions
// that can be called directly from client components. This is a Next.js feature.

// Helper to increment usage count for a specific API module
async function incrementUsage(moduleId: string) {
    const { firestore } = initializeFirebase();
    try {
        const moduleRef = doc(firestore, "apiModules", moduleId);
        await updateDoc(moduleRef, {
            usageCount: increment(1)
        });
    } catch (error) {
        // Non-critical, so we just log it on the server
        console.error(`Failed to increment usage for ${moduleId}:`, error);
    }
}

// Sales: Fetches all products
export async function getProducts() {
    await incrementUsage('sales');
    const { firestore } = initializeFirebase();
    try {
        const productsCollection = collection(firestore, "products");
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return productList;
    } catch (error: any) {
        console.error("Error fetching products: ", error);
        return []; // Return empty array on error
    }
}

// Reservations: Fetches all reservations
export async function getReservations() {
    await incrementUsage('reservations');
    const { firestore } = initializeFirebase();
    try {
        const reservationsCollection = collection(firestore, "reservations");
        const snapshot = await getDocs(reservationsCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
        console.error("Error fetching reservations: ", error);
        return [];
    }
}

// Reservations: Creates a new reservation
export async function createReservation(data: { service: string, date: string, time: string, userId: string }) {
    await incrementUsage('reservations');
    const { firestore } = initializeFirebase();
    try {
         const docRef = await addDoc(collection(firestore, "reservations"), {
            ...data,
            status: "pending",
            createdAt: serverTimestamp()
        });
        revalidatePath('/'); // Revalidate the page to show new data
        return { success: true, id: docRef.id };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// Notifications: Sends a test notification
export async function sendTestNotification() {
    await incrementUsage('notifications');
     // TODO: Implement actual notification logic with Twilio, SendGrid, etc.
    console.log(`Sending notification to test@example.com: "This is a test notification!"`);
    return { success: true, message: `Notification queued for test@example.com` };
}

// Reports: Fetches the sales report
export async function getSalesReport() {
    await incrementUsage('reports');
    const { firestore } = initializeFirebase();
    try {
        const salesCollection = collection(firestore, "sales");
        const salesSnapshot = await getDocs(salesCollection);
        
        const salesData = salesSnapshot.docs.map(doc => doc.data());
        const totalSales = salesData.reduce((sum, sale) => sum + (sale.total || 0), 0);
        const numSales = salesSnapshot.size;

        return { totalSales, numSales };
    } catch (error: any) {
        console.error("Error fetching sales report: ", error);
        return { success: false, message: error.message };
    }
}

// API Status: Fetches the backend status
export async function getApiStatus() {
    await incrementUsage('api-status');
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Backend is running correctly. 🚀',
    };
}

// Google Maps: Geocodes an address
export async function geocodeAddress(address: string) {
    await incrementUsage('google-maps');
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
    await incrementUsage('google-maps');
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
    await incrementUsage('shopify');
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching integrations: ", error);
    return [];
  }
}

// Integrations: Updates an integration document in Firestore
export async function updateIntegration(id: string, data: Partial<{ active: boolean; key: string }>) {
  const { firestore } = initializeFirebase();
  try {
    const integrationRef = doc(firestore, "integrations", id);
    await setDoc(integrationRef, data, { merge: true });
    revalidatePath('/'); 
    return { success: true, message: `Integration ${id} updated.` };
  } catch (error) {
    console.error(`Error updating integration ${id}: `, error);
    return { success: false, message: (error as Error).message };
  }
}
