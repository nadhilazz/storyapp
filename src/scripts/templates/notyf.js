import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  types: [
    {
      type: 'info',
      background: '#3498db', // Warna biru
      icon: {
        className: 'fas fa-info-circle', // Icon info
        tagName: 'i',
        text: '',
      },
    },
    {
      type: 'error',
      background: '#e74c3c',
      duration: 4000,
      dismissible: true,
    },
    {
      type: 'success',
      background: '#2ecc71',
      duration: 4000,
      dismissible: true,
    }
  ],
  duration: 3000,
  ripple: true,
  position: {
    x: 'right',
    y: 'top',
  },
});

export default notyf;
