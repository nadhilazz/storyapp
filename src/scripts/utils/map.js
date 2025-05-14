import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import notyf from "../templates/notyf";

export function initializeMap(
  locationButtonId,
  locationInfoId,
  mapDivId,
  onSuccess = () => {},
  options = {}
) {
  const {
    readOnly = false,
    markers = [],
    showGeocoder = !readOnly,
    showCurrentLocation = !readOnly,
    initialView = [-2.5489, 118.0149],
    initialZoom = 5,
  } = options;

  const mapDiv = document.getElementById(mapDivId);
  if (mapDiv._leaflet_id) {
    mapDiv._leaflet_id = null; // Reset ID agar bisa dibuat ulang
  }
  let map = L.map(mapDiv).setView(initialView, initialZoom);
  let marker;

  const customIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const mapTilerStreets = L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=dkmf3cclz5FrcXxDjdWM",
    {
      attribution:
        '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }
  ).addTo(map);

  const openStreetMap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }
  );

  const baseLayers = {
    "MapTiler Streets": mapTilerStreets,
    "OpenStreetMap": openStreetMap,
  };

  L.control.layers(baseLayers).addTo(map);

  if (readOnly && markers.length) {
    markers.forEach((story) => {
      if (story.lat && story.lon) {
        const popupContent = `
          <div class="map-popup">
            <h3>${story.name}</h3>
            ${story.photoUrl ? `<img src="${story.photoUrl}" alt="${story.name}" />` : ""}
            <p>${story.description || "No description"}</p>
            <button class="map-popup__btn" id="view-detail-${story.id}">View Detail</button>
          </div>
        `;

        const m = L.marker([story.lat, story.lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);

        m.on("popupopen", () => {
          const btn = document.getElementById(`view-detail-${story.id}`);
          if (btn) {
            btn.addEventListener("click", () => {
              window.location.href = `#/story/${story.id}`;
            });
          }
        });
      }
    });
  }

  if (!readOnly) {
    const locationButton = document.getElementById(locationButtonId);
    const locationInfo = document.getElementById(locationInfoId);
  
    if (locationButton) {
      locationButton.addEventListener("click", () => {
        if (!navigator.geolocation) {
          locationInfo.innerHTML = "Geolocation not supported by your browser.";
          return;
        }
  
        locationInfo.innerHTML = "Getting your location...";
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
  
            if (marker) map.removeLayer(marker);
  
            marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
            map.setView([latitude, longitude], 13);
  
            locationInfo.innerHTML = `📍 Location set at [${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`;
            onSuccess(latitude, longitude);
          },
          (error) => {
            console.warn("Geolocation failed:", error.message);
            locationInfo.innerHTML = "📍 Unable to get current location.";
          }
        );
      });
    }
  
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      locationInfo.innerHTML = `📍 Location manually set at [${lat.toFixed(5)}, ${lng.toFixed(5)}]`;
      onSuccess(lat, lng);
    });
  }

  return map;
}

function fetchLocationName(lat, lng, marker, locationInfo) {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const locationName = data.display_name || "Unknown location";
      marker
        .bindPopup(
          `
        <div class="popup-container">
          <h3>Selected Location</h3>
          <p>${locationName}</p>
        </div>
      `
        )
        .openPopup();

      if (locationInfo) {
        locationInfo.innerHTML = `
          <div class="location-box">
            <div class="location-details">
              <div class="location-detail">
                <i class="fas fa-location-arrow"></i> Latitude: ${lat.toFixed(5)}
              </div>
              <div class="location-detail">
                <i class="fas fa-location-arrow"></i> Longitude: ${lng.toFixed(5)}
              </div>
            </div>
          </div>
        `;
      }
    })
    .catch((err) => {
      console.error("Failed to retrieve location name:", err);
      if (locationInfo) locationInfo.textContent = "Failed to retrieve location name.";
    });
}
