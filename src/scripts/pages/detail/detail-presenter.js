import StoryAPI from "../../data/api";
import renderStaticMap from "../../utils/mapDetail";
import DetailStoryView from "./detail-view";

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
