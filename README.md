# Modular APIs Hub

This is a Next.js application built with Firebase Studio, designed to be a central hub for managing and interacting with various commercial APIs.

## Architecture Overview

This project utilizes a modern, integrated architecture built on Next.js, leveraging its full-stack capabilities.

### Backend

The backend is built using **Next.js API Routes** and **Server Actions**. Instead of a separate server (like Express), our API endpoints are defined directly within the `src/app/api/` directory or as secure server-callable functions.

- Each subdirectory in `/api/` corresponds to a RESTful resource (e.g., `/api/sales`, `/api/reservations`).
- Server Actions in `src/lib/actions.ts` handle mutations and data submissions securely from the client.
- This approach unifies the frontend and backend in a single project, simplifying development and deployment.

### Frontend

The frontend is built with **React** and **Next.js App Router**, using Server Components by default for optimal performance.

- **UI Components**: We use `shadcn/ui` for beautiful and accessible components.
- **Styling**: Tailwind CSS is used for styling, configured via `tailwind.config.ts` and `src/app/globals.css`.

### Database & Authentication

**Firebase** is our service backend.

- **Database**: **Firestore** is our primary NoSQL database. The data models are outlined in `docs/backend.json`, and security is enforced via `firestore.rules`.
- **Authentication**: We use **Firebase Authentication** for user management, supporting both email/password and Google Sign-In.
- **Interaction**: We use the Firebase client-side SDK (`firebase`) and custom hooks like `useUser`, `useCollection`, and `useDoc` to simplify real-time data fetching in the frontend.

### Generative AI

We use **Genkit**, Google's official framework for building AI-powered applications.

- **Flows**: AI logic is encapsulated in "flows" located in `src/ai/flows/`. These flows define chains of operations, like calling the Gemini model.
- **Example**: `voiceCommandToQuote` is a flow that takes audio, transcribes it, generates a JSON quote, and saves it to Firestore, all in one server-side operation.

### Deployment

The application is pre-configured for **Firebase App Hosting**.

- The `apphosting.yaml` file defines the build and run configuration for Firebase.
- When connected to a Git repository, Firebase App Hosting can automatically build and deploy the application upon pushes to the main branch, providing a seamless CI/CD experience.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Set up environment variables**:
    - Copy the `.env.example` file to `.env` (if it exists) or create a new `.env` file.
    - You will need to add your Firebase project configuration keys and any other necessary API keys (like `GEMINI_API_KEY`).
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
This will start the Next.js application on `http://localhost:9002`.
