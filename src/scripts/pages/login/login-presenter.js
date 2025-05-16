import StoryAPI from "../../data/api";
import Token from "../../data/token";

class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(email, password) {
    if (!email || !password) {
      this.view.showError("Please fill in both the email and password fields.");
      return;
    }

    try {
      this.view.showLoading();
      const result = await StoryAPI.login({ email, password });

      if (result.error) {
        this.view.showError(result.message || "Login failed. Please check your credentials.");
      } else {
        this.view.showSuccess(`Login successful!<br>Welcome, ${result.loginResult.name}`);
        this.view.onLoginSuccess(result.loginResult);
      }
    } catch (error) {
      console.error("Login error:", error);
      this.view.showError("Something went wrong. Please try again later.");
    } finally {
      this.view.hideLoading();
    }
  }
}

export default LoginPresenter;
