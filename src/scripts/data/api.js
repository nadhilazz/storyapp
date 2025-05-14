import { API } from './endpoint'; 
import Token from './token'; 

const StoryAPI = {
  async register({ name, email, password }) {
    const response = await fetch(API.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    return response.json();
  },

  async login({ email, password }) {
    const response = await fetch(API.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!data.error && data.loginResult?.token) {
      Token.set(data.loginResult.token); 
    }

    return data;
  },

  async getAllStories({ page = 1, size = 10, location = 0 } = {}) {
    const token = Token.get();
    try {
      const response = await fetch(`${API.GET_ALL_STORIES}?page=${page}&size=${size}&location=${location}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      return { error: 'Failed to fetch stories. Please check your network connection.' };
    }
  },

  async getStoryDetail(id) {
    const token = Token.get();
    const response = await fetch(API.GET_STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.json();
  },

  async addStory({ description, photo, lat, lon }) {
    const token = Token.get();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const response = await fetch(API.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });

    return response.json();
  },

  async subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
    const token = Token.get();
    const data = JSON.stringify({
      endpoint,
      keys: { p256dh, auth },
    });

    const response = await fetch(API.SUBSCRIBE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });

    const json = await response.json();
    console.log(json);

    return {
      ...json,
      ok: response.ok,
    };

  },
  


  async unsubscribePushNotification({ endpoint }) {
    const token = Token.get();
    const data = JSON.stringify({
        endpoint,
    });

    const response = await fetch(API.UNSUBSCRIBE, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });

    const json = await response.json();
    
      return {
        ...json,
        ok: response.ok,
      };
  }
};

export default StoryAPI;
