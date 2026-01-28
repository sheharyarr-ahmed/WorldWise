import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import styles from "./Map.module.css";
import { useCities } from "../contexts/CitiesContext";

function Map() {
  const { cities, currentCity, lastVisitedPosition } = useCities();
  const [mapPosition, setMapPosition] = useState(
    lastVisitedPosition ?? [40, 0],
  );
  const [searchParams] = useSearchParams();

  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  const lat = Number(mapLat);
  const lng = Number(mapLng);

  useEffect(() => {
    if (lastVisitedPosition || currentCity?.position) return;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    setMapPosition([lat, lng]);
  }, [lat, lng, lastVisitedPosition, currentCity]);

  useEffect(() => {
    if (!currentCity?.position) return;
    const { lat: cityLat, lng: cityLng } = currentCity.position;
    if (!Number.isFinite(cityLat) || !Number.isFinite(cityLng)) return;
    setMapPosition([cityLat, cityLng]);
  }, [currentCity]);

  useEffect(() => {
    if (!Array.isArray(lastVisitedPosition)) return;
    const [latValue, lngValue] = lastVisitedPosition;
    if (!Number.isFinite(latValue) || !Number.isFinite(lngValue)) return;
    setMapPosition([latValue, lngValue]);
  }, [lastVisitedPosition]);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        // center={[mapLat, mapLng]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

ChangeCenter.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Map;
