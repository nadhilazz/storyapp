import AddStoryPresenter from "./add-story-presenter";
import { initializeMap } from "../../utils/map";
import notyf from "../../templates/notyf";

export default class AddStory {
  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita Baru</h1>
        <p>Unggah foto dan deskripsi untuk membagikan cerita Anda.</p>
        <form id="story-form">

          <label for="story" class="title">
            <i class="fas fa-pen-alt"></i> Deskripsi Cerita
          </label>
          <textarea
            id="story"
            name="story"
            required
            placeholder="Tulis deskripsi cerita Anda..."
            rows="10"
          ></textarea>

          <label class="title">
            <i class="fas fa-camera-retro"></i> Gambar Cerita
          </label>
          <div class="media-container">
            <div class="photo-option" id="camera-option">
              <i class="fas fa-camera fa-2x"></i>
              <p>Ambil Foto</p>
            </div>
            <p class="atau-text">Or</p>
            <div class="photo-option" id="gallery-option">
              <i class="fas fa-image fa-2x"></i>
              <p>Pilih Foto</p>
            </div>
          </div>

          <label for="camera-select" class="title" style="display:none;" id="camera-select-label">
            <i class="fas fa-video"></i> Pilih Kamera
          </label>
          <select id="camera-select" style="display:none;"></select>

          <video id="video" autoplay playsinline style="display: none;"></video>
          <canvas id="canvas" style="display: none;"></canvas>

          <button type="button" id="capture" style="display: none;">
            <i class="fas fa-camera"></i> Ambil Foto
          </button>

          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            style="display: none;"
          />

          <div
            id="photo-result"
            class="photo-preview"
            style="display: none;"
          >
            <p>Hasil Foto</p>
            <img
              id="captured-photo"
              src=""
              alt="Photo from Camera"
            />
            <button type="button" id="delete-photo" class="delete-btn">
              <i class="fas fa-trash-alt"></i> Hapus Foto
            </button>
          </div>

          <label for="location" class="title">
            <i class="fas fa-location-dot"></i> Lokasi Cerita
          </label>
          <div id="map-container">
            <div id="map">
              <button type="button" id="get-location">
                <i class="fas fa-street-view"></i> Lokasi Cerita
              </button>
            </div>
          </div>
          <p id="location-info">
            <i class="fas fa-exclamation-circle"></i> Lokasi tidak dapat diidentifikasi.
          </p>

          <div style="margin-top: 20px; text-align: center;">
            <button type="submit">
              <i class="fas fa-paper-plane"></i> Unggah Cerita
            </button>
          </div>

        </form>
      </section>
    `;
  }

  async afterRender() {
    this.initLocationFeature();
    this.initPhotoUIFeature();
    this.initFormSubmission();
  }

  async initLocationFeature() {
    const form = document.getElementById("story-form");
    const getLocationBtn = document.getElementById("get-location");
    const locationInfo = document.getElementById("location-info");
  
    let mapInitialized = false;
  
    const onSuccess = (lat, lon) => {
      form.dataset.lat = lat;
      form.dataset.lon = lon;
      locationInfo.innerHTML = `<i class="fas fa-check-circle"></i> Location set at [${lat.toFixed(5)}, ${lon.toFixed(5)}]`;
    };
  
    getLocationBtn.addEventListener("click", () => {
      if (mapInitialized) return;
  
      // Custom permission popup before initializing map
      const permissionGranted = window.confirm("Izinkan aplikasi menggunakan lokasi Anda untuk menampilkan peta?");
      if (!permissionGranted) {
        locationInfo.innerHTML = "<i class='fas fa-exclamation-circle'></i> Izin lokasi ditolak.";
        return;
      }
  
      initializeMap("get-location", "location-info", "map", onSuccess);
      mapInitialized = true;
    });
  }
  

  constructor() {
    this.stream = null;
  }

  stopCameraStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      const video = document.getElementById("video");
      const captureBtn = document.getElementById("capture");
      video.style.display = "none";
      captureBtn.style.display = "none";
    }
  }

  initPhotoUIFeature() {
    const cameraBtn = document.getElementById("camera-option");
    const galleryBtn = document.getElementById("gallery-option");
    const fileInput = document.getElementById("photo");
    const captureBtn = document.getElementById("capture");
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const photoResult = document.getElementById("photo-result");
    const photoPreview = document.getElementById("captured-photo");
    const deleteBtn = document.getElementById("delete-photo");
    const ctx = canvas.getContext("2d");
    const mediaContainer = document.querySelector(".media-container");
    const cameraSelect = document.getElementById("camera-select");
    const cameraSelectLabel = document.getElementById("camera-select-label");

    let currentDeviceId = null;

    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        cameraSelect.innerHTML = "";
        videoDevices.forEach((device, index) => {
          const option = document.createElement("option");
          option.value = device.deviceId;
          option.text = device.label || `Camera ${index + 1}`;
          cameraSelect.appendChild(option);
        });
        if (videoDevices.length > 0) {
          cameraSelect.style.display = "inline-block";
          cameraSelectLabel.style.display = "block";
          currentDeviceId = videoDevices[0].deviceId;
        } else {
          cameraSelect.style.display = "none";
          cameraSelectLabel.style.display = "none";
        }
      } catch (err) {
        console.error("Error enumerating devices:", err);
        cameraSelect.style.display = "none";
        cameraSelectLabel.style.display = "none";
      }
    }

    const startCamera = async (deviceId) => {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: deviceId ? { exact: deviceId } : undefined } });
        video.srcObject = this.stream;
        video.style.display = "block";
        captureBtn.style.display = "inline-block";
        mediaContainer.style.display = "none";
        photoResult.style.display = "none";
      } catch (err) {
        console.error("Failed to access camera:", err);
        notyf.error("Please enable camera permission in your browser.");
      }
    };

    cameraBtn.addEventListener("click", async () => {
      // Custom permission popup before accessing camera
      const permissionGranted = window.confirm("Izinkan aplikasi mengakses kamera Anda?");
      if (!permissionGranted) {
        notyf.error("Izin kamera ditolak.");
        return;
      }
      await getCameras();
      if (currentDeviceId) {
        await startCamera(currentDeviceId);
      }
    });

    cameraSelect.addEventListener("change", async (event) => {
      currentDeviceId = event.target.value;
      await startCamera(currentDeviceId);
    });

    captureBtn.addEventListener("click", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      photoPreview.src = canvas.toDataURL("image/png");

      photoResult.style.display = "block";
      photoResult.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 });

      video.style.display = "none";
      captureBtn.style.display = "none";

      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }
    });

    galleryBtn.addEventListener("click", () => {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
        video.style.display = "none";
        captureBtn.style.display = "none";
      }
      fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
        photoResult.style.display = "block";
        photoResult.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
      };
      reader.readAsDataURL(file);
    });

    deleteBtn.addEventListener("click", () => {
      photoPreview.src = "";
      photoResult.style.display = "none";
      fileInput.value = "";

      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
        video.style.display = "none";
        captureBtn.style.display = "none";
      }

      mediaContainer.style.display = "flex";
      mediaContainer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 });

      deleteBtn.style.display = "none";
      setTimeout(() => {
        deleteBtn.style.display = "inline-block";
        deleteBtn.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
      }, 500);
    });
  }

  initFormSubmission() {
    const form = document.getElementById("story-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const description = document.getElementById("story").value.trim();
      const photoPreview = document.getElementById("captured-photo");
      const fileInput = document.getElementById("photo");

      let photo = null;

      const isPhotoTakenFromCamera = photoPreview.src &&
                                     photoPreview.src.startsWith("data:image") &&
                                     photoPreview.style.display !== "none";

      const isPhotoSelectedFromGallery = fileInput.files && fileInput.files.length > 0;

      // Pastikan salah satu harus ada
      if (isPhotoTakenFromCamera) {
        const blob = await (await fetch(photoPreview.src)).blob();
        photo = new File([blob], "camera-photo.png", { type: blob.type });
      } else if (isPhotoSelectedFromGallery) {
        photo = fileInput.files[0];
      } else {
        notyf.error("Please upload or capture a photo before submitting.");
      }

      const lat = form.dataset.lat || null;
      const lon = form.dataset.lon || null;

      await AddStoryPresenter.submitStory({ description, photo, lat, lon });
    });
  }
}
