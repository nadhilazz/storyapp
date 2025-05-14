import routes from '../routes/routes';
import { getActiveRoute, parseActivePathname } from '../routes/url-parser';
import Token from '../data/token';
import DetailGridStory from '../pages/detail/detail';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPageInstance = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupLogoutListener();

    // Tambahkan listener untuk memaksa render ulang saat hash berubah
    window.addEventListener('hashchange', () => this.renderPage());
    window.addEventListener('load', () => this.renderPage());
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _setupLogoutListener() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.matches('#logout-link')) {
        e.preventDefault();
        this.logout();
      }
    });
  }

  checkAuthAndRedirect() {
    const token = Token.get();
    const currentPath = window.location.hash.replace('#', '') || '/';
    const publicRoutes = ['/login', '/register'];

    if (!token && !publicRoutes.includes(currentPath)) {
      window.location.hash = '#/login';
    } else if (token && (currentPath === '/' || currentPath === '/login' || currentPath === '/register')) {
      window.location.hash = '#/home';
    }
  }

  async renderPage() {
    this.checkAuthAndRedirect();

    const url = getActiveRoute();
    const PageClass = routes[url];

    if (url === '/logout') {
      this.cleanupCurrentPage();
      this.logout();
      return;
    }

    if (url.startsWith('/story/')) {
      const { id } = parseActivePathname();
      if (id) {
        this.cleanupCurrentPage();
        this.#currentPageInstance = new DetailGridStory(id);
        this.#content.innerHTML = await this.#currentPageInstance.render();
        await this.#currentPageInstance.afterRender();
      } else {
        this.#content.innerHTML = '<h2>Story ID is missing!</h2>';
      }
      return;
    }

    if (PageClass) {
      this.cleanupCurrentPage();
      this.#currentPageInstance = new PageClass();
      this.#content.innerHTML = '';
      this.#content.innerHTML = await this.#currentPageInstance.render();
      await this.#currentPageInstance.afterRender();
    } else {
      this.cleanupCurrentPage();
      this.#content.innerHTML = `<h2>Page Not Found</h2>`;
    }
  }

  cleanupCurrentPage() {
    if (this.#currentPageInstance && typeof this.#currentPageInstance.stopCameraStream === 'function') {
      this.#currentPageInstance.stopCameraStream();
    }
  }

  logout() {
    Token.remove();
    window.location.hash = '#/login';
  }
  
}

export default App;
