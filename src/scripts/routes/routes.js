import DetailGridStory from '../pages/detail/detail';
import HomePage from '../pages/home/home-page';
import MapsPage from '../pages/maps/maps';
import AddStory from '../pages/add/add-story';
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/add': AddStory,
  '/maps': MapsPage,
  '/login': LoginPage,
  '/register': RegisterPage,
};

export default routes;
