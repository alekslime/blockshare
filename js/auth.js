document.addEventListener("DOMContentLoaded", function() {
  console.log("Auth page loaded");
  
  // Check which form is present
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const googleSignInBtn = document.getElementById("googleSignInBtn");
  const googleSignUpBtn = document.getElementById("googleSignUpBtn");
  
  console.log("Login form exists:", !!loginForm);
  console.log("Signup form exists:", !!signupForm);
  
  // Handle login form
  if (loginForm) {
    console.log("Adding event listener to login form");
    
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      console.log("Login form submitted");
      
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      
      console.log("Login credentials:", { email, password: "********" });
      
      // Simple validation
      if (!email || !password) {
        showNotification("Please fill in all fields", "error");
        return;
      }
      
      // For demo purposes, we'll just simulate a login
      // In a real app, you would authenticate with Firebase Auth
      
      // Simulate loading
      showNotification("Logging in...", "info");
      
      setTimeout(() => {
        // Create a mock user
        const user = {
          id: "user123",
          username: "DiamondMiner42",
          email: email,
          avatar: "https://placehold.co/150"
        };
        
        console.log("Creating mock user:", user);
        
        try {
          // Save user to localStorage
          localStorage.setItem("blockShareUser", JSON.stringify(user));
          console.log("User saved to localStorage");
          
          // Show success message
          showNotification("Login successful!", "success");
          
          // Redirect to home page
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        } catch (error) {
          console.error("Error saving user to localStorage:", error);
          showNotification("Error logging in: " + error.message, "error");
        }
      }, 1500);
    });
    
    // Add a direct click handler for the login button as a fallback
    const loginButton = loginForm.querySelector('button[type="submit"]');
    if (loginButton) {
      console.log("Adding click handler to login button");
      loginButton.addEventListener("click", function(e) {
        console.log("Login button clicked directly");
        // Prevent the default form submission
        e.preventDefault();
        // Manually trigger the form submission event
        loginForm.dispatchEvent(new Event('submit'));
      });
    }
  }
  
  // Handle signup form
  if (signupForm) {
    console.log("Adding event listener to signup form");
    
    signupForm.addEventListener("submit", function(e) {
      e.preventDefault();
      console.log("Signup form submitted");
      
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const terms = document.getElementById("terms").checked;
      
      console.log("Signup data:", { 
        username, 
        email, 
        password: "********", 
        confirmPassword: "********", 
        terms 
      });
      
      // Simple validation
      if (!username || !email || !password || !confirmPassword) {
        showNotification("Please fill in all fields", "error");
        return;
      }
      
      if (password !== confirmPassword) {
        showNotification("Passwords do not match", "error");
        return;
      }
      
      if (!terms) {
        showNotification("Please agree to the Terms of Service", "error");
        return;
      }
      
      // For demo purposes, we'll just simulate a signup
      // In a real app, you would create a user with Firebase Auth
      
      // Simulate loading
      showNotification("Creating account...", "info");
      
      setTimeout(() => {
        // Create a mock user
        const user = {
          id: "user123",
          username: username,
          email: email,
          avatar: "https://placehold.co/150"
        };
        
        console.log("Creating mock user:", user);
        
        try {
          // Save user to localStorage
          localStorage.setItem("blockShareUser", JSON.stringify(user));
          console.log("User saved to localStorage");
          
          // Show success message
          showNotification("Account created successfully!", "success");
          
          // Redirect to home page
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        } catch (error) {
          console.error("Error saving user to localStorage:", error);
          showNotification("Error creating account: " + error.message, "error");
        }
      }, 1500);
    });
    
    // Add a direct click handler for the signup button as a fallback
    const signupButton = signupForm.querySelector('button[type="submit"]');
    if (signupButton) {
      console.log("Adding click handler to signup button");
      signupButton.addEventListener("click", function(e) {
        console.log("Signup button clicked directly");
        // Prevent the default form submission
        e.preventDefault();
        // Manually trigger the form submission event
        signupForm.dispatchEvent(new Event('submit'));
      });
    }
  }
  
  // Handle Google sign in
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", function() {
      console.log("Google sign in button clicked");
      handleGoogleAuth("login");
    });
  }
  
  // Handle Google sign up
  if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener("click", function() {
      console.log("Google sign up button clicked");
      handleGoogleAuth("signup");
    });
  }
  
  function handleGoogleAuth(type) {
    console.log(`Handling Google ${type}`);
    // For demo purposes, we'll just show a modal explaining that Google Auth needs to be set up
    showGoogleAuthModal(type);
  }
  
  function showGoogleAuthModal(type) {
    console.log(`Showing Google Auth modal for ${type}`);
    // Create modal
    const modal = document.createElement("div");
    modal.className = "modal";
    
    modal.innerHTML = `
      <div class="modal-content block-appear">
        <div class="modal-header">
          <h3>Google Authentication Setup</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>To enable Google Authentication, you need to set up a Google OAuth client ID in the Google Cloud Console.</p>
          
          <h4>Setup Steps:</h4>
          <ol class="setup-steps">
            <li>Go to the <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
            <li>Create a new project or select an existing one</li>
            <li>Navigate to "APIs & Services" > "Credentials"</li>
            <li>Click "Create Credentials" > "OAuth client ID"</li>
            <li>Set up the OAuth consent screen if prompted</li>
            <li>Select "Web application" as the application type</li>
            <li>Add your domain to the authorized JavaScript origins</li>
            <li>Add your redirect URI (usually your domain + /auth)</li>
            <li>Copy the Client ID and update your Firebase configuration</li>
          </ol>
          
          <div class="demo-note">
            <p><strong>For this demo:</strong> We'll simulate a Google login instead.</p>
            <p>Click the button below to continue with a simulated Google ${type}.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="cancelGoogleAuth">Cancel</button>
          <button class="btn btn-primary" id="simulateGoogleAuth">Simulate Google ${type}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle close button
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", function() {
      modal.remove();
    });
    
    // Handle cancel button
    const cancelBtn = modal.querySelector("#cancelGoogleAuth");
    cancelBtn.addEventListener("click", function() {
      modal.remove();
    });
    
    // Handle simulate button
    const simulateBtn = modal.querySelector("#simulateGoogleAuth");
    simulateBtn.addEventListener("click", function() {
      console.log(`Simulating Google ${type}`);
      // Remove modal
      modal.remove();
      
      // Simulate loading
      showNotification(`Simulating Google ${type}...`, "info");
      
      setTimeout(() => {
        // Create a mock user
        const user = {
          id: "google123",
          username: "SteveFromGoogle",
          email: "steve.minecraft@gmail.com",
          avatar: "https://placehold.co/150"
        };
        
        console.log("Creating mock Google user:", user);
        
        try {
          // Save user to localStorage
          localStorage.setItem("blockShareUser", JSON.stringify(user));
          console.log("Google user saved to localStorage");
          
          // Show success message
          showNotification(`Google ${type} successful!`, "success");
          
          // Redirect to home page
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        } catch (error) {
          console.error("Error saving Google user to localStorage:", error);
          showNotification(`Error with Google ${type}: ` + error.message, "error");
        }
      }, 1500);
    });
  }
});

// Show notification
function showNotification(message, type = "info") {
  console.log(`Notification (${type}):`, message);
  
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