import StoryAPI from "../../data/api";
import Token from "../../data/token";
import notyf from "../../templates/notyf"; 
import { showLoading, hideLoading } from "../../utils/loading-indicator";

class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(email, password) {
    if (!email || !password) {
      notyf.error("Please fill in both the email and password fields.");
      return;
    }

    try {
      showLoading();
      const result = await StoryAPI.login({ email, password });

      if (result.error) {
        notyf.error(result.message || "Login failed. Please check your credentials.");
      } else {
        notyf.success(`Login successful!<br>Welcome, ${result.loginResult.name}`);
        this.view.onLoginSuccess(result.loginResult);
      }
    } catch (error) {
      console.error("Login error:", error);
      notyf.error("Something went wrong. Please try again later.");
    } finally {
      hideLoading();
    }
  }
}

export default LoginPresenter;
