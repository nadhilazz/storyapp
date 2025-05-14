class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const wrapper = document.createElement('div');
    wrapper.classList.add('spinner-wrapper');

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    const loadingText = document.createElement('p');
    loadingText.textContent = 'Loading...';
    loadingText.classList.add('loading-text');

    const style = document.createElement('style');
    style.textContent = `
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
  
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.1); 
          backdrop-filter: blur(3px); 
          z-index: -1; 
        }
  
        .spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
  
        .spinner {
          width: 60px;
          height: 60px;
          border: 8px solid #FFFF;
          border-top: 8px solid rgb(81, 192, 105);
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }
  
        .loading-text {
          font-family: "Fredoka", sans-serif;
          font-size: 1.5rem;
          color: #333;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
  
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;

    wrapper.appendChild(spinner);
    wrapper.appendChild(loadingText);

    shadow.appendChild(style);
    shadow.appendChild(overlay);
    shadow.appendChild(wrapper);
  }
}

customElements.define('loading-indicator', LoadingIndicator);
export function showLoading() {
  if (!document.querySelector('loading-indicator')) {
    const loading = document.createElement('loading-indicator');
    document.body.appendChild(loading);
  }
}

export function hideLoading() {
  const loading = document.querySelector('loading-indicator');
  if (loading) {
    loading.remove();
  }
}

export default LoadingIndicator;
