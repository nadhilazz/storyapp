import StoryAPI from '../../data/api';

class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleSubmit(formData) {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      this.view.showError("Please fill in all fields!");
      return;
    }

    try {
      this.view.showLoading();
      const response = await StoryAPI.register({ name: username, email, password });

      if (response?.error) {
        this.view.showError(response.message || "Registration failed!");
      } else {
        this.view.showSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          this.view.redirect('#/login');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      this.view.showError("An unexpected error occurred.");
    } finally {
      this.view.hideLoading();
    }
  }
}

export default RegisterPresenter;
