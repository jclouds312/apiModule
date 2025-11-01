'use server';

import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002/api';

export async function getProducts() {
    try {
        const res = await fetch(`${API_BASE_URL}/sales`, { cache: 'no-store'});
        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createReservation(data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error(`Failed to create reservation: ${res.statusText}`);
        }
        revalidatePath('/');
        return res.json();
    } catch (error) {
        console.error(error);
        return { success: false, message: (error as Error).message };
    }
}
