import { formatDate, formatTime } from '../utils/index.js';

export default class StoryItem {
  async render() {
    return ''; 
  }

  createCard(imgSrc, username, description, date, time, storyId) {
    return `
      <div class="story-card">
        <img src="${imgSrc}" alt="Story Image" class="story-image" />
        <div class="story-content">
          <h2>${username}</h2>
          <p class="story-description">${description}</p>
          <div class="story-waktu">
            <div class="story-date">
              <i class="fas fa-calendar-alt"></i> <span>${formatDate(new Date(date))}</span>
            </div>
            <div class="story-time">
              <i class="fas fa-clock"></i> <span>${formatTime(new Date(time))}</span>
            </div>
          </div>
          <a href="#/story/${storyId}" class="view-more-btn" id="${storyId}">View Story</a>
        </div>
      </div>
    `;
  }
}





