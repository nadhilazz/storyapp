import notyf from "../../templates/notyf";
import StoryAPI from "../../data/api";
import { initializeMap } from "../../utils/map";

export default class MapsPage {
  constructor() {
    console.log("MapsPage constructor");
    this.mapInstance = null;
    this.mapContainerId = "map";
  }

  async render() {
    console.log("MapsPage render");
    return `
      <section class="container maps-section">
        <h1>Lokasi Cerita Pengguna</h1>
        <p>Lihat di mana saja pengguna telah membagikan kisah mereka dari berbagai penjuru dunia!</p>
        <div id="${this.mapContainerId}" class="maps-container" style="height: 400px;"></div>
      </section>
    `;
  }


async afterRender() { 
  // Ambil data story
  const response = await StoryAPI.getAllStories();

  if (response.error) {
    console.error('Error fetching stories:', response.error);
    notyf.error(response.error);
    return;
  }

  const stories = response.listStory || [];

  if (!stories.length) {
    console.error("No stories found.");
    return;
  }

  // Gunakan fungsi reusable
  this.mapInstance = initializeMap(
    null, // Tidak pakai tombol lokasi
    null, // Tidak pakai info lokasi
    this.mapContainerId,
    () => {}, // Tidak perlu callback lokasi
    {
      readOnly: true,
      markers: stories,
      initialView: [-2.5489, 118.0149],
      initialZoom: 5,
    }
  );
}
}
