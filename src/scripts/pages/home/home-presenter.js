import StoryAPI from '../../data/api';
import Transition from "../../utils/transition";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
  }

  async loadStories() {
    try {
      Transition.showLoading();
      const data = await StoryAPI.getAllStories({ page: 1, size: 10 });
      if (data.error) {
        this.view.showError(data.message);
        return;
      }

      if (data.listStory.length === 0) {
        this.view.showEmpty();
      } else {
        this.view.showStories(data.listStory);
      }
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      Transition.hideLoading();
    }
  }
}
