'use server';

import { revalidatePath } from "next/cache";

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
        // Handle cases where response might be empty
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
