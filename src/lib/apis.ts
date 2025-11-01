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
  KeyRound,
  FileCode,
  LineChart,
  PhoneCall
} from 'lucide-react';

export type ApiModule = {
  id: string;
  name: string;
  description: string;
  Icon: LucideIcon;
  defaultActive: boolean;
  category: 'Commerce' | 'Reservations' | 'Location' | 'AI' | 'Voice' | 'System';
};

export const apiModules: ApiModule[] = [
  {
    id: 'sales',
    name: 'Sales API',
    description: 'Manage products, prices, and orders. Integrated with payment gateways.',
    Icon: ShoppingCart,
    defaultActive: true,
    category: 'Commerce',
  },
  {
    id: 'reservations',
    name: 'Reservations API',
    description: 'Handle service or event reservations with availability control.',
    Icon: Calendar,
    defaultActive: true,
    category: 'Reservations',
  },
  {
    id: 'google-maps',
    name: 'Google Maps API',
    description: 'Geocoding, routing, and geolocation services.',
    Icon: Map,
    defaultActive: true,
    category: 'Location',
  },
  {
    id: 'shopify',
    name: 'Shopify API',
    description: 'Manage products, orders, and customers for your Shopify store.',
    Icon: Store,
    defaultActive: true,
    category: 'Commerce',
  },
  {
    id: 'voice-to-text',
    name: 'Voice AI API',
    description: 'Transcribe voice and generate JSON quotes automatically with Genkit.',
    Icon: Mic,
    defaultActive: true,
    category: 'Voice',
  },
   {
    id: 'retell-ai',
    name: 'Retell AI',
    description: 'Build and manage voice agents with conversational AI.',
    Icon: PhoneCall,
    defaultActive: false,
    category: 'Voice',
  },
  {
    id: 'gemini-ai',
    name: 'Gemini AI API',
    description: 'Natural language processing and AI generation powered by Google.',
    Icon: Cpu,
    defaultActive: true,
    category: 'AI',
  },
  {
    id: 'authentication',
    name: 'Authentication API',
    description: 'User registration and login with role-based access control.',
    Icon: Users,
    defaultActive: true,
    category: 'System',
  },
  {
    id: 'notifications',
    name: 'Notifications API',
    description: 'Send automated notifications via email, WhatsApp, or SMS.',
    Icon: Bell,
    defaultActive: true,
    category: 'System',
  },
  {
    id: 'reports',
    name: 'Reports API',
    description: 'Dashboard for sales & reservations data with export functionality.',
    Icon: LineChart,
    defaultActive: true,
    category: 'System',
  },
  {
    id: 'api-status',
    name: 'API Status Endpoint',
    description: 'A public endpoint to display the status of all active APIs.',
    Icon: Server,
    defaultActive: true,
    category: 'System',
  },
  {
    id: 'documentation',
    name: 'OpenAPI/Swagger',
    description: 'Automatically generated documentation for all your APIs.',
    Icon: FileCode,
    defaultActive: true,
    category: 'System',
  },
];
