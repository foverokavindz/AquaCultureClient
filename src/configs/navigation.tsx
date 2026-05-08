import { Home, Fish, Users } from 'lucide-react';
import type { NavItem } from '../components/SideNavBar';

export const MAIN_NAV_ITEMS: NavItem[] = [
	{ label: 'Dashboard', icon: <Home size={22} />, path: '/dashboard' },
	{ label: 'Fish Farms', icon: <Fish size={22} />, path: '/fish-farms' },
	{ label: 'Workers', icon: <Users size={22} />, path: '/workers' },
];
