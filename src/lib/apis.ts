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
    defaultActive: false,
  },
  {
    id: 'voice-to-text',
    name: 'Voice-to-Text API',
    description: 'Transcribe voice commands and generate JSON quotes automatically.',
    Icon: Mic,
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
    defaultActive: false,
  },
  {
    id: 'reports',
    name: 'Reports API',
    description: 'Dashboard for sales & reservations data with export functionality.',
    Icon: BarChart,
    defaultActive: false,
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
