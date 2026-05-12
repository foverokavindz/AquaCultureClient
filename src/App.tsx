import { RouterProvider } from 'react-router-dom';
import { router } from './router/routes';
import { Toaster } from 'react-hot-toast';

function App() {
	return (
		<>
			<RouterProvider router={router} />
			<Toaster position="top-center" toastOptions={{ duration: 4000, style: { fontSize: '15px', fontFamily: 'inherit' } }} />
		</>
	);
}

export default App;
