import DetailStoryPresenter from "./detail-presenter";

export default class DetailGridStory {
  constructor(id) {
    this.id = id;
  }

  async render() {
    return `
      <section class="container grid-story-section">
        <div id="story-detail" class="story-card"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById("story-detail");
    const presenter = new DetailStoryPresenter(this.id, container);
    await presenter.init();
  }
}
