import LoginPresenter from "./login-presenter";
import notyf from "../../templates/notyf";
import { showLoading, hideLoading } from "../../utils/loading-indicator";

export default class LoginPage {
  async render() {
    return `
      <div class="login-container">
        <div class="login">
          <div class="logo">
            <img src="images/logo.png" alt="Logo" />
          </div>
          <h2>Dicoding Story</h2>
          <p>Silahkan Masuk dan Bagikan Ceritamu</p>

          <form id="login-form" class="form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Tulis Email Anda" required />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-wrapper">
                <input type="password" id="password" placeholder="Masukkan Password Anda" required />
                <i class="fas fa-eye toggle-password"></i>
              </div>
            </div>
            <button type="submit" class="btn-login">Masuk</button>
          </form>

          <p class="signup">
            Belum punya akun? <a href="#/register">Daftar</a>
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

  async afterRender() {
    const header = document.getElementById("header");
    if (header) header.style.display = "none";

    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");

    if (togglePassword) {
      togglePassword.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";
        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
      });
    }

    const presenter = new LoginPresenter(this);

    const form = document.getElementById("login-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      presenter.login(email, password);
    });
  }
}
