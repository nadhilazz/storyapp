export default class BookmarkView {
  constructor(container) {
    this.container = container;
  }

  async afterRender() {
    // TODO: initial presenter
  }

  renderStories(stories) {

    this.container.innerHTML = `
      <h2>Cerita Tersimpan</h2>
      <ul class="saved-stories-list">
        ${stories.map(story => `
          <li class="saved-story-item" data-id="${story.id}">
            <img src="${story.photoUrl || 'images/default.jpg'}" alt="Story Image" class="saved-story-image" />
            <div class="saved-story-content">
              <h3>${story.name}</h3>
              <p>${story.description}</p>
              <a href="#/story/${story.id}" class="view-story-link">Lihat Detail</a>
              <button class="delete-bookmark-btn" aria-label="Hapus cerita tersimpan">Hapus</button>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  }
}
