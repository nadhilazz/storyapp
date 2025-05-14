import StoryAPI from "../../data/api";
import notyf from "../../templates/notyf";
import { showLoading, hideLoading } from "../../utils/loading-indicator";
import AddStoryView from "./add-story-view";

const AddStoryPresenter = {
  view: new AddStoryView(),

  async submitStory({ description, photo, lat = null, lon = null }) {
    if (!description || !photo) {
      notyf.error("Description and photo are required.");
      return;
    }

    try {
      showLoading();
      const response = await StoryAPI.addStory({ description, photo, lat, lon });

      if (response.error) {
        notyf.error(response.message || "Failed to add story.");
        return;
      }

      notyf.success("Successfully published your story!");
      this.view.goToHomePage();
    } catch (error) {
      console.error("Failed to submit story:", error);
      notyf.error("Something went wrong. Please try again later.");
    } finally {
      hideLoading();
    }
  }
};

export default AddStoryPresenter;
