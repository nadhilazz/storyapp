export default class DetailStoryView {
  constructor(container) {
    this.container = container;
  }

  showLoading() {
    this.container.innerHTML = `<div class="story-content-loading">Loading...</div>`;
  }

  showError(message) {
    this.container.innerHTML = `<p>Failed to load detail: ${message}</p>`;
  }

  showDetail({ id, name, description, photoUrl, createdAt, lat, lon }) {
    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    const formattedTime = new Date(createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit"
    });

    this.container.innerHTML = `
      <button id="back-home-btn" class="back-button" style="margin-bottom: 20px;">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
      <br>
      <img src="${photoUrl || 'images/default.jpg'}" alt="Story Image" class="story-detail-image" />
      <button id="save-story-btn" class="save-story-button" style="display: block; margin: 10px 0;">Simpan Cerita</button>
      <div class="story-content">
        <h2>${name}</h2>
        <p class="story-full-description">${description}</p>
        <div class="story-waktu">
          <div class="story-date">
            <i class="fas fa-calendar-alt"></i> 
            <span class="date-text">${formattedDate}</span> 
          </div>
          <div class="story-time">
            <i class="fas fa-clock"></i> 
            <span class="time-text">${formattedTime}</span> 
          </div>
        </div>

        <h3>Lokasi</h3>
        <div id="story-map" style="height: 300px;"></div>
      </div>
    `;

    document.getElementById("back-home-btn").addEventListener("click", () => {
      window.location.hash = "/";
    });
  }

  showNoLocation() {
    document.getElementById("story-map").innerHTML = "<p>No location data.</p>";
  }
}
