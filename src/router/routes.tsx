import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import FishFarms from '../pages/FishFarms';
import Workers from '../pages/Workers';

import SideNavBar from '../components/SideNavBar';
import { MAIN_NAV_ITEMS } from '../config/navigation';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <Navigate to="/dashboard" replace />,
	},
	{
		element: <MainLayout sidebar={<SideNavBar routes={MAIN_NAV_ITEMS} />} />,
		children: [
			{
				path: 'dashboard',
				element: <Dashboard />,
			},
			{
				path: 'fish-farms',
				element: <FishFarms />,
			},
			{
				path: 'workers',
				element: <Workers />,
			},
		],
	},
];

export const router = createBrowserRouter(routes);
