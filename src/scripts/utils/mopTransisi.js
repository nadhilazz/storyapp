const MorphTransition = {
    async transition(sourceElement, targetPageLoader, direction = "left") {
      if (!sourceElement || typeof targetPageLoader !== "function") {
        console.error("MorphTransition: Invalid parameters.");
        return;
      }
  
      try {
        const sourceBounds = sourceElement.getBoundingClientRect();
        const transitionContainer = document.createElement("div");
        transitionContainer.className = "morph-transition-container";
        document.body.appendChild(transitionContainer);
  
        const morphElement = document.createElement("div");
        morphElement.className = "morph-element";
        transitionContainer.appendChild(morphElement);
  
        morphElement.style.top = `${sourceBounds.top}px`;
        morphElement.style.left = `${sourceBounds.left}px`;
        morphElement.style.width = `${sourceBounds.width}px`;
        morphElement.style.height = `${sourceBounds.height}px`;
  
        morphElement.innerHTML = sourceElement.innerHTML;
  
        await new Promise((resolve) => requestAnimationFrame(resolve));
  
        // SLIDE effect
        morphElement.classList.add("slide-transition");
        morphElement.style.transform = direction === "left" ? "translateX(-100vw)" : "translateX(100vw)";
  
        await new Promise((resolve) => setTimeout(resolve, 600));
  
        await targetPageLoader();
  
        transitionContainer.remove();
      } catch (error) {
        console.error("MorphTransition Error:", error);
      }
    },
  };
  
  export default MorphTransition;
  