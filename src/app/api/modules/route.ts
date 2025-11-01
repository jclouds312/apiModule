// /api/modules
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Retrieves all API modules
 *     description: Fetches a list of all configured API modules from Firestore.
 *     tags: [Modules]
 *     responses:
 *       200:
 *         description: A list of API modules.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ApiModule'
 *       500:
 *         description: Server error
 */
export async function GET() {
  const { firestore } = initializeFirebase();
  try {
    const apiModulesCollection = collection(firestore, "apiModules");
    const snapshot = await getDocs(apiModulesCollection);
    const moduleList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(moduleList);
  } catch (error: any) {
    console.error("Error fetching API modules: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch API modules.' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Registers a new API module
 *     description: Adds a new API module configuration to Firestore.
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiModule'
 *     responses:
 *       200:
 *         description: API module registered successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Server error.
 */
export async function POST(request: Request) {
  const { firestore } = initializeFirebase();
  try {
    const body = await request.json();
    const { name, description, category, baseUrl, status } = body;
    
    if (!name || !description || !category || !baseUrl) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    const docRef = await addDoc(collection(firestore, "apiModules"), {
      ...body,
      usageCount: 0,
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ success: true, message: "API module registered", id: docRef.id });
  } catch (error: any) {
    console.error("Error creating API module: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create API module.' }, { status: 500 });
  }
}
