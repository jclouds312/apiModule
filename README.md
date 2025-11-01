# Modular APIs Hub

This is a Next.js application built with Firebase Studio, designed to be a central hub for managing and interacting with various commercial APIs.

## Architecture Overview

This project utilizes a modern, integrated architecture built on Next.js, leveraging its full-stack capabilities.

### Backend

The backend is built using **Next.js API Routes**. Instead of a separate server (like Express), our API endpoints are defined directly within the `src/app/api/` directory.

- Each subdirectory corresponds to a RESTful resource (e.g., `/api/sales`, `/api/reservations`).
- Each `route.ts` file within these directories handles the HTTP methods (GET, POST, etc.) for that endpoint.
- This approach unifies the frontend and backend in a single project, simplifying development and deployment.

### Frontend

The frontend is built with **React** and **Next.js App Router**, using Server Components by default for optimal performance.

- **UI Components**: We use `shadcn/ui` for beautiful and accessible components.
- **Styling**: Tailwind CSS is used for styling, configured via `tailwind.config.ts` and `src/app/globals.css`.

### Database

**Firebase Firestore** is our primary database.

- **Data Models**: Defined in `docs/backend.json`, which acts as a blueprint for our data structures.
- **Security**: Firestore Security Rules are managed in `firestore.rules` to protect data.
- **Interaction**: We use the Firebase client-side SDK (`firebase`) throughout the app, even in API Routes. This allows for a consistent API and easy integration with Firebase Authentication. Custom hooks like `useUser`, `useCollection`, and `useDoc` simplify real-time data fetching in the frontend.

### Generative AI

We use **Genkit**, Google's official framework for building AI-powered applications.

- **Flows**: AI logic is encapsulated in "flows" located in `src/ai/flows/`. These flows define chains of operations, like calling the Gemini model.
- **Example**: `voiceCommandToQuote` is a flow that takes audio, transcribes it, generates a JSON quote, and saves it to Firestore, all in one server-side operation.

### Server-Side Logic

For server-side operations that are called from the client (like form submissions or button clicks), we use **Next.js Server Actions**.

- These are functions defined in `'use server';` files (e.g., `src/lib/actions.ts`).
- They allow the frontend to call backend logic securely without manually creating API endpoints for every action, simplifying the code for mutations and data fetching.

## Getting Started

To get started, explore the components in `src/components/` and the API routes in `src/app/api/`. The main page is `src/app/page.tsx`, which renders the `DashboardPage`.
