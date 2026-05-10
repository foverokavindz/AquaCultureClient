import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// default Leaflet marker icons
const defaultIcon = L.icon({
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface MapPreviewProps {
	latitude: number;
	longitude: number;
	label: string;
	zoom?: number;
	minHeight?: number;
	maxHeight?: number;
}

const MapPreview: React.FC<MapPreviewProps> = ({ latitude, longitude, label, zoom = 12, minHeight = 400, maxHeight = 500 }) => {
	return (
		<Paper
			elevation={0}
			sx={{
				borderRadius: 1,
				overflow: 'hidden',
				height: '100%',
				minHeight,
				maxHeight,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* Header */}
			<Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Box sx={{ p: 1, color: 'text.secondary', display: 'flex' }}>
					<Map size={25} />
				</Box>
				<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
					Map Location
				</Typography>
			</Box>

			{/* Map */}
			<Box sx={{ flexGrow: 1, position: 'relative', minHeight: 350 }}>
				<MapContainer center={[latitude, longitude]} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={[latitude, longitude]}>
						<Popup>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								{label}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{latitude.toFixed(4)}, {longitude.toFixed(4)}
							</Typography>
						</Popup>
					</Marker>
				</MapContainer>
			</Box>
		</Paper>
	);
};

export default MapPreview;
