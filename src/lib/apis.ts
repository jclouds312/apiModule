import type { LucideIcon } from 'lucide-react';
import {
  ShoppingCart,
  Calendar,
  Mic,
  Users,
  Bell,
  BarChart,
  Server,
  BookOpen,
  Map,
  Store,
  Cpu,
} from 'lucide-react';

export type ApiModule = {
  id: string;
  name: string;
  description: string;
  Icon: LucideIcon;
  defaultActive: boolean;
};

export const apiModules: ApiModule[] = [
  {
    id: 'sales',
    name: 'Sales API',
    description: 'Manage products, prices, and orders. Integrated with payment gateways.',
    Icon: ShoppingCart,
    defaultActive: true,
  },
  {
    id: 'reservations',
    name: 'Reservations API',
    description: 'Handle service or event reservations with availability control.',
    Icon: Calendar,
    defaultActive: true,
  },
    {
    id: 'google-maps',
    name: 'Google Maps API',
    description: 'Geocoding, routing, and geolocation services.',
    Icon: Map,
    defaultActive: true,
  },
  {
    id: 'shopify',
    name: 'Shopify API',
    description: 'Manage products, orders, and customers for your Shopify store.',
    Icon: Store,
    defaultActive: true,
  },
  {
    id: 'voice-to-text',
    name: 'Voice AI API',
    description: 'Transcribe voice and generate JSON quotes automatically with Genkit.',
    Icon: Mic,
    defaultActive: true,
  },
  {
    id: 'gemini-ai',
    name: 'Gemini AI API',
    description: 'Natural language processing and AI generation powered by Google.',
    Icon: Cpu,
    defaultActive: true,
  },
  {
    id: 'authentication',
    name: 'Authentication API',
    description: 'User registration and login with role-based access control.',
    Icon: Users,
    defaultActive: true,
  },
  {
    id: 'notifications',
    name: 'Notifications API',
    description: 'Send automated notifications via email, WhatsApp, or SMS.',
    Icon: Bell,
    defaultActive: true,
  },
  {
    id: 'reports',
    name: 'Reports API',
    description: 'Dashboard for sales & reservations data with export functionality.',
    Icon: BarChart,
    defaultActive: true,
  },
  {
    id: 'api-status',
    name: 'API Status Endpoint',
    description: 'A public endpoint to display the status of all active APIs.',
    Icon: Server,
    defaultActive: true,
  },
  {
    id: 'documentation',
    name: 'OpenAPI/Swagger',
    description: 'Automatically generated documentation for all your APIs.',
    Icon: BookOpen,
    defaultActive: true,
  },
];
