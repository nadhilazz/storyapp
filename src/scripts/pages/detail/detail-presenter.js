import StoryAPI from "../../data/api";
import renderStaticMap from "../../utils/mapDetail";
import DetailStoryView from "./detail-view";
import { addStory, getStory, deleteStory } from "../../data/database";

export default class DetailStoryPresenter {
  constructor(id, container) {
    this.id = id;
    this.view = new DetailStoryView(container);
  }

  async init() {
    this.view.showLoading();

    try {
      const data = await StoryAPI.getStoryDetail(this.id);

      if (data.error) {
        this.view.showError(data.message);
        return;
      }

      const story = data.story;
      this.view.showDetail(story);

      // Add event listener for save button
      const saveBtn = document.getElementById("save-story-btn");
      if (saveBtn) {
        // Set initial button text based on bookmark status
        const existing = await getStory(story.id);
        if (existing) {
          saveBtn.textContent = "Hapus Cerita";
        } else {
          saveBtn.textContent = "Simpan Cerita";
        }

        saveBtn.addEventListener("click", async () => {
          try {
            const existing = await getStory(story.id);
          if (existing) {
            await deleteStory(story.id);
            saveBtn.textContent = "Simpan Cerita";
            alert("Cerita berhasil dihapus dari bookmark!");
            // Dispatch event to notify bookmark page
            window.dispatchEvent(new CustomEvent('bookmark-updated'));
          } else {
            await addStory(story);
            saveBtn.textContent = "Hapus Cerita";
            alert("Cerita berhasil disimpan!");
            // Dispatch event to notify bookmark page
            window.dispatchEvent(new CustomEvent('bookmark-updated'));
          }
          } catch (error) {
            alert("Gagal menyimpan cerita: " + error.message);
          }
        });
      }

      if (story.lat && story.lon) {
        await renderStaticMap(story.lat, story.lon, "story-map");
      } else {
        this.view.showNoLocation();
      }
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
