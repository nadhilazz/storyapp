export default class AddStoryView {
  goToHomePage() {
    setTimeout(() => {
      window.location.hash = "/";
    }, 1500);
  }
}
