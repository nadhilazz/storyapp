import RegisterPresenter from './registerPresenter';
import notyf from '../../templates/notyf';
import { showLoading, hideLoading } from '../../utils/loading-indicator';

export default class RegisterPage {
  async render() {
    return `
      <div class="login-container">
        <div class="login">
          <div class="logo">
            <img src="images/logo.png" alt="Logo" />
          </div>
          <h2>Waktunya Menjadi Legenda!</h2>
          <p>Daftar dan Mulai Berbagi Cerita Menarik Di Dicoding Story</p>

          <form id="register-form" class="form">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" placeholder="Masukkan Username Anda" required />
            </div>
        
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Tuliskan Email Anda" required />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-wrapper">
                <input type="password" id="password" placeholder="Buat Password Anda" required />
                <i class="fas fa-eye toggle-password"></i>
              </div>
            </div>

            <button type="submit" class="btn-login">Daftar</button>
          </form>

          <p class="signup">
            Sudah punya akun? <a href="#/login">Masuk</a>
          </p>
        </div>
      </div>
    `;
  }

  showError(message) {
    notyf.error(message);
  }

  showSuccess(message) {
    notyf.success(message);
  }

  showLoading() {
    showLoading();
  }

  hideLoading() {
    hideLoading();
  }

  redirect(path) {
    window.location.hash = path;
  }

  async afterRender() {
    const header = document.getElementById("header");
    if (header) {
      header.style.display = "none";
    }

    const togglePasswordIcons = document.querySelectorAll(".toggle-password");
    togglePasswordIcons.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        const input = e.target.closest(".password-wrapper").querySelector("input");
        if (input) {
          input.type = input.type === "password" ? "text" : "password";
          e.target.classList.toggle("fa-eye");
          e.target.classList.toggle("fa-eye-slash");
        }
      });
    });

    const presenter = new RegisterPresenter(this);

    const form = document.getElementById("register-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
      };

      await presenter.handleSubmit(formData);
    });
  }
}
