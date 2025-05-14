import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import notyf from "../templates/notyf";
// import markerLeaf from "../assets/leaf-red."

export function initializeMap(
  locationButtonId,
  locationInfoId,
  mapDivId,
  onSuccess = () => {}
) {
  const locationButton = document.getElementById(locationButtonId);
  const locationInfo = document.getElementById(locationInfoId);
  const mapDiv = document.getElementById(mapDivId);
  let map, marker;

  const customIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      locationInfo.textContent = "Geolocation not available on this device.";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        locationButton.style.display = "none";

        if (!map) {
          map = L.map(mapDiv).setView([latitude, longitude], 13);

          const mapTilerStreets = L.tileLayer(
            "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=dkmf3cclz5FrcXxDjdWM",
            {
              attribution:
                '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            }
          );

          const openStreetMap = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            }
          );

          const mapTilerOutdoor = L.tileLayer(
            "https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=dkmf3cclz5FrcXxDjdWM",
            {
              attribution:
                '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            }
          );

          mapTilerStreets.addTo(map);

          L.Control.geocoder({
            defaultMarkGeocode: false,
            collapsed: true,
          })
            .on("markgeocode", function (e) {
              const latlng = e.geocode.center;
              if (marker) {
                marker.setLatLng(latlng);
              } else {
                marker = L.marker(latlng, { icon: customIcon }).addTo(map);
              }
              map.setView(latlng, 13);
              fetchLocationName(latlng.lat, latlng.lng, marker, locationInfo);
              onSuccess(latlng.lat, latlng.lng);
            })
            .addTo(map);

          const baseLayers = {
            "MapTiler Streets": mapTilerStreets,
            "MapTiler Outdoor": mapTilerOutdoor,
            "OpenStreetMap": openStreetMap,
          };
          L.control.layers(baseLayers).addTo(map);

          map.on("click", function (e) {
            const { lat, lng } = e.latlng;
            if (marker) {
              marker.setLatLng([lat, lng]);
            } else {
              marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
            }
            fetchLocationName(lat, lng, marker, locationInfo);
            onSuccess(lat, lng);
          });
        }

        marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(
          map
        );
        fetchLocationName(latitude, longitude, marker, locationInfo);
        onSuccess(latitude, longitude); // <= Inject koordinat ke form
      },
      (err) => {
        locationInfo.innerHTML =
          '<i class="fas fa-exclamation-circle"></i> Failed to retrieve location.';
        console.error(err);
        notyf.error("Please enable location permission in your browser!");
      }
    );
  });
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
    })
    .catch((err) => {
      console.error("Failed to retrieve location name:", err);
      locationInfo.textContent = "Failed to retrieve location name.";
    });
}
