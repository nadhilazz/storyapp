import { getAllStories, deleteStory } from "../../data/database";
import BookmarkView from "./bookmark";

export default class BookmarkPresenter {
  constructor(container) {
    this.view = new BookmarkView(container);
    this._handleDelete = this._handleDelete.bind(this);
  }

  async init() {
    try {
      const stories = await getAllStories();
      this.view.renderStories(stories);
      this._attachDeleteListeners();
      // Listen for bookmark updates to refresh the list
      window.addEventListener('bookmark-updated', async () => {
        const updatedStories = await getAllStories();
        this.view.renderStories(updatedStories);
        this._attachDeleteListeners();
      });
    } catch (error) {
      this.view.container.innerHTML = `<p>Gagal memuat cerita tersimpan: ${error.message}</p>`;
    }
  }

  _attachDeleteListeners() {
    const deleteButtons = this.view.container.querySelectorAll('.delete-bookmark-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', this._handleDelete);
    });
  }

  async _handleDelete(event) {
    const storyItem = event.target.closest('.saved-story-item');
    if (!storyItem) return;
    const storyId = storyItem.getAttribute('data-id');
    try {
      await deleteStory(storyId);
      const stories = await getAllStories();
      this.view.renderStories(stories);
      this._attachDeleteListeners();
    } catch (error) {
      alert('Gagal menghapus cerita tersimpan: ' + error.message);
    }
  }
}
