import StoryAPI from '../../data/api';
import notyf from '../../templates/notyf';
import { showLoading, hideLoading } from "../../utils/loading-indicator";

const RegisterPresenter = {
  async handleSubmit(formData) {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      notyf.error("Please fill in all fields!");
      return;
    }

    try {
      showLoading();
      const response = await StoryAPI.register({ name: username, email, password });

      if (response?.error) {
        notyf.error(response.message || "Registration failed!");
      } else {
        notyf.success("Registration successful! Redirecting...");
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      notyf.error("An unexpected error occurred.");
    } finally {
      hideLoading();
    }
  }
};

export default RegisterPresenter;
