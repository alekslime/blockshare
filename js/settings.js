document.addEventListener("DOMContentLoaded", function() {
    console.log("Settings page loaded");
    
    // Wait for Firebase to initialize
    setTimeout(() => {
      // Check if user is logged in
      const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));
      if (!currentUser) {
        showNotification("Please log in to access settings", "error");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
        return;
      }
      
      // Handle settings navigation
      const navItems = document.querySelectorAll(".settings-nav-item");
      const settingsSections = document.querySelectorAll(".settings-section");
      
      navItems.forEach(item => {
        item.addEventListener("click", function(e) {
          e.preventDefault();
          
          // Remove active class from all items
          navItems.forEach(i => i.classList.remove("active"));
          
          // Add active class to clicked item
          this.classList.add("active");
          
          // Get section to show
          const sectionId = this.getAttribute("href").substring(1);
          const sectionToShow = document.getElementById(`${sectionId}-section`);
          
          // Hide all sections
          settingsSections.forEach(section => section.classList.remove("active"));
          
          // Show selected section
          sectionToShow.classList.add("active");
        });
      });
      
      // Fill in user data
      document.getElementById("account-email").value = currentUser.email;
      document.getElementById("account-username").value = currentUser.username;
      
      // Handle theme options
      const themeOptions = document.querySelectorAll(".theme-option");
      
      themeOptions.forEach(option => {
        option.addEventListener("click", function() {
          // Remove active class from all options
          themeOptions.forEach(o => o.classList.remove("active"));
          
          // Add active class to clicked option
          this.classList.add("active");
          
          // Show notification
          showNotification("Theme preference saved", "success");
        });
      });
      
      // Handle form submissions
      const forms = document.querySelectorAll(".settings-form");
      
      forms.forEach(form => {
        form.addEventListener("submit", function(e) {
          e.preventDefault();
          
          // Show notification
          showNotification("Settings saved successfully", "success");
        });
      });
    }, 500); // Wait for Firebase to initialize
  });
  
  // Show notification
  function showNotification(message, type = "info") {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector(".notification-container");
    if (!notificationContainer) {
      notificationContainer = document.createElement("div");
      notificationContainer.className = "notification-container";
      document.body.appendChild(notificationContainer);
    }
  
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type} block-appear`;
    notification.textContent = message;
  
    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "notification-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => {
      notification.remove();
    });
    notification.appendChild(closeBtn);
  
    // Add to container
    notificationContainer.appendChild(notification);
  
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("notification-hide");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }