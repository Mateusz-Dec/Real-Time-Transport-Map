import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const getVehicleIcon = (type) => {
    const emoji = type === 'bus' ? '🚌' : '🚋';
    return L.divIcon({
        html: emoji,
        className: 'vehicle-icon',
        iconSize: [24, 24],
    });
};

const VehicleMarker = ({ vehicle }) => {
    const { id, type, position } = vehicle;
    const icon = getVehicleIcon(type);

    return (
        <Marker position={position} icon={icon}>
            <Popup>
                Vehicle ID: {id} <br />
                Type: {type}
            </Popup>
        </Marker>
    );
};

export default VehicleMarker;
