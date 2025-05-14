const Transition = {
    showLoading() {
      let loading = document.getElementById('global-loading');
      if (!loading) {
        loading = document.createElement('div');
        loading.id = 'global-loading';
        loading.style.position = 'fixed';
        loading.style.top = 0;
        loading.style.left = 0;
        loading.style.width = '100%';
        loading.style.height = '100%';
        loading.style.background = 'rgba(255, 255, 255, 0.8)';
        loading.style.display = 'flex';
        loading.style.alignItems = 'center';
        loading.style.justifyContent = 'center';
        loading.style.zIndex = 9999;
        loading.innerHTML = `
          <div class="spinner"></div>
        `;
  
        document.body.appendChild(loading);
      }
      loading.style.display = 'flex';
    },
  
    hideLoading() {
      const loading = document.getElementById('global-loading');
      if (loading) {
        loading.style.display = 'none';
      }
    }
  };
  
  export default Transition;
  