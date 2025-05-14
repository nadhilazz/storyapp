import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

async function reverseGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || "Alamat tidak ditemukan";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "Alamat tidak ditemukan";
  }
}

export default async function renderStaticMap(lat, lon, mapDivId) {
  const mapContainer = document.getElementById(mapDivId);
  
  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
    mapContainer.innerHTML = ""; 
  }

  const alamat = await reverseGeocode(lat, lon);

  const map = L.map(mapDivId).setView([lat, lon], 13);

  L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=dkmf3cclz5FrcXxDjdWM", {
    attribution:
      '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(map);

  const customIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.marker([lat, lon], { icon: customIcon })
    .addTo(map)
    .bindPopup(`<b>${alamat}</b>`); 
}
