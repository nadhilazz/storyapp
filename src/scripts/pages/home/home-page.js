import StoryItem from "../../templates/story-item";
import HomePresenter from "./home-presenter";

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter(this);
  }

  async render() {
    return `
      <section class="container home-section">
        <h1 id="welcome-title">Halo Semua!</h1>
        <h3 id="subtitle">Ayo kita tulis kisah luar biasa yang mengguncang dunia!</h3>
      </section>
      <div id="grid-story-container"></div>
    `;
  }

  async afterRender() {
    this.animatePageContent();
    setTimeout(() => {
      this.presenter.loadStories();
    }, 0);
  }

  animatePageContent() {
    const welcomeTitle = document.getElementById("welcome-title");
    const subtitle = document.getElementById("subtitle");

    welcomeTitle.animate(
      [{ opacity: 0, transform: "translateY(-30px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 800, easing: "ease-out", fill: "forwards" }
    );

    subtitle.animate(
      [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 800, easing: "ease-out", fill: "forwards", delay: 200 }
    );
  }

  showStories(stories) {
    const gridStoryContainer = document.getElementById("grid-story-container");
    const storyItem = new StoryItem();
    const storyCards = stories.map(story =>
      storyItem.createCard(
        story.photoUrl || 'images/default.jpg',
        story.name,
        story.description,
        story.createdAt,
        story.createdAt,
        story.id  
      )
    ).join('');

    gridStoryContainer.innerHTML = `
      <section class="container grid-story-section">
        <div class="grid-container">
          ${storyCards}
        </div>
      </section>
    `;
  }

  showError(message) {
    document.getElementById("grid-story-container").innerHTML = `<p>Failed to load stories: ${message}</p>`;
  }

  showEmpty() {
    document.getElementById("grid-story-container").innerHTML = `<p>No stories available.</p>`;
  }
}

