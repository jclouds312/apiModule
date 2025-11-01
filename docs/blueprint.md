# **App Name**: Modular APIs Hub

## Core Features:

- Sales API: CRUD operations for products, prices, and categories. Order generation with status updates (pending, paid, delivered). Integration with PayU or MercadoPago Colombia for payment processing.
- Reservations API: CRUD operations for reservable services or events. Availability control by hour/day. Confirmation notifications via email or WhatsApp.
- Voice-to-Text API: Endpoint `/api/voz/cotizar` that listens to voice commands, transcribes them, generates a JSON quote, and saves it to the database, with automatic quotations generated from voice commands.
- Authentication API: Registration/login functionality using Firebase Auth or JWT. User roles: admin, cliente, proveedor.
- Notifications API: Automatic sending of notifications upon confirming a sale or reservation via email, WhatsApp, or SMS using Twilio or SendGrid.
- Reports API: Dashboard for sales and reservations, along with data export functionality to CSV or PDF format.
- API Activation UI: Firebase Studio web interface for activating/deactivating APIs, testing endpoints (integrated console or Swagger UI), and displaying basic logs and metrics (requests, errors, times).
- API Status Endpoint: Endpoint `/api/status` that displays which APIs are currently active.
- OpenAPI/Swagger Documentation: Automatically generated OpenAPI/Swagger documentation for all APIs.

## Style Guidelines:

- Primary color: A vibrant, deep blue (#3F51B5), inspired by the concepts of security, reliability, and cloud services.
- Background color: A light, desaturated blue (#E8EAF6), providing a clean and unobtrusive backdrop.
- Accent color: A warm, contrasting orange (#FF9800), drawing the user's attention to key interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for headlines or body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use minimalistic icons representing each API module (sales, reservations, voice, etc.).
- Clean and modular layout, with clear separation between API modules and settings.