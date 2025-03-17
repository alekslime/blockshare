document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));
  if (currentUser) {
    // If on login or signup page, redirect to home
    if (
      window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("signup.html")
    ) {
      window.location.href = "index.html";
    }
  }

  // Handle Google Sign-In button click
  const googleSignInBtn = document.getElementById("googleSignInBtn");
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", () => {
      // Show setup instructions modal
      showGoogleSetupModal("signin");
    });
  }

  // Handle Google Sign-Up button click
  const googleSignUpBtn = document.getElementById("googleSignUpBtn");
  if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener("click", () => {
      // Show setup instructions modal
      showGoogleSetupModal("signup");
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Simulate login (in a real app, this would validate against a backend)
      if (email && password) {
        // Create mock user data
        const user = {
          id: "user_" + Date.now(),
          username: email.split("@")[0],
          email: email,
          avatar: "https://via.placeholder.com/40",
          isLoggedIn: true,
        };

        // Save to localStorage
        localStorage.setItem("blockShareUser", JSON.stringify(user));

        // Show success message
        showNotification("Login successful! Redirecting...", "success");

        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        showNotification("Please enter both email and password", "error");
      }
    });
  }

  // Handle signup form submission
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const terms = document.getElementById("terms").checked;

      // Validate form
      if (!username || !email || !password || !confirmPassword) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (password !== confirmPassword) {
        showNotification("Passwords do not match", "error");
        return;
      }

      if (!terms) {
        showNotification("You must agree to the Terms of Service", "error");
        return;
      }

      // Create user
      const user = {
        id: "user_" + Date.now(),
        username: username,
        email: email,
        avatar: "https://via.placeholder.com/40",
        isLoggedIn: true,
      };

      // Save to localStorage
      localStorage.setItem("blockShareUser", JSON.stringify(user));

      // Show success message
      showNotification(
        "Account created successfully! Redirecting...",
        "success"
      );

      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    });
  }

  // Close modal when clicking outside
  document.addEventListener("click", (event) => {
    const modal = document.querySelector(".modal");
    if (
      modal &&
      !modal.querySelector(".modal-content").contains(event.target) &&
      !event.target.matches("#googleSignInBtn, #googleSignUpBtn")
    ) {
      modal.remove();
    }
  });
});

// Show Google setup instructions modal
function showGoogleSetupModal(mode) {
  // Create modal element
  const modal = document.createElement("div");
  modal.className = "modal fade-in";

  // Create modal content
  modal.innerHTML = `
      <div class="modal-content block-appear">
        <div class="modal-header">
          <h3>Set Up Google Authentication</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>To enable Google ${
            mode === "signin" ? "Sign-In" : "Sign-Up"
          }, you need to set up a Google OAuth client ID:</p>
          <ol class="setup-steps">
            <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a></li>
            <li>Create a new project or select an existing one</li>
            <li>Navigate to "APIs & Services" > "Credentials"</li>
            <li>Click "Create Credentials" > "OAuth client ID"</li>
            <li>Set the application type to "Web application"</li>
            <li>Add your domain to the "Authorized JavaScript origins"</li>
            <li>Add your redirect URI (e.g., https://yourdomain.com/login.html)</li>
            <li>Click "Create" and copy your Client ID</li>
            <li>Replace "YOUR_GOOGLE_CLIENT_ID" in the code with your actual Client ID</li>
          </ol>
          <p>For now, you can use the regular email/password login instead.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary modal-close-btn">Got it</button>
          <button class="btn btn-outline use-demo-btn">Use Demo Mode</button>
        </div>
      </div>
    `;

  // Add modal to body
  document.body.appendChild(modal);

  // Handle close button
  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Handle "Got it" button
  const closeModalBtn = modal.querySelector(".modal-close-btn");
  closeModalBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Handle "Use Demo Mode" button
  const useDemoBtn = modal.querySelector(".use-demo-btn");
  useDemoBtn.addEventListener("click", () => {
    // Create demo user
    const demoUser = {
      id: "demo_user_" + Date.now(),
      username: mode === "signin" ? "DiamondMiner42" : "NewMinecrafter",
      email: "demo@blockshare.com",
      avatar: "https://via.placeholder.com/40",
      isLoggedIn: true,
    };

    // Save to localStorage
    localStorage.setItem("blockShareUser", JSON.stringify(demoUser));

    // Show success message
    showNotification("Demo login successful! Redirecting...", "success");

    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    // Remove modal
    modal.remove();
  });
}

// Google Sign-In callback
function handleCredentialResponse(response) {
  // Decode the credential response
  // In a real app, you would verify this token on your backend
  const responsePayload = parseJwt(response.credential);

  if (responsePayload) {
    // Create user from Google data
    const user = {
      id: responsePayload.sub,
      username: responsePayload.name.replace(/\s+/g, ""),
      email: responsePayload.email,
      avatar: responsePayload.picture,
      isLoggedIn: true,
    };

    // Save to localStorage
    localStorage.setItem("blockShareUser", JSON.stringify(user));

    // Show success message
    showNotification("Google sign-in successful! Redirecting...", "success");

    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

// Helper function to parse JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT token", e);
    return null;
  }
}

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
