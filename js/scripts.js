document.addEventListener("DOMContentLoaded", () => {
  console.log("Home page loaded");

  // Check if Firebase is initialized
  if (typeof firebase === "undefined") {
    console.error("Firebase SDK not loaded!");
    showNotification(
      "Error: Firebase SDK not loaded. Please check your internet connection and try again.",
      "error"
    );
    return;
  }

  // Wait a short time to ensure Firebase has initialized
  setTimeout(() => {
    // Check if Firestore is available
    if (!window.db) {
      console.error("Firestore not initialized!");
      showNotification(
        "Error: Database not initialized. Please check your console for details.",
        "error"
      );
      return;
    }

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));
    updateUIForUser(currentUser);

    // Toggle user dropdown menu
    const userAvatar = document.getElementById("userAvatar");
    const userMenu = document.getElementById("userMenu");

    if (userAvatar && userMenu) {
      userAvatar.addEventListener("click", () => {
        userMenu.classList.toggle("active");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (event) => {
        if (
          !userAvatar.contains(event.target) &&
          !userMenu.contains(event.target)
        ) {
          userMenu.classList.remove("active");
        }
      });
    }

    // Handle logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Clear user data
        localStorage.removeItem("blockShareUser");

        // Show notification
        showNotification("Logged out successfully!", "success");

        // Redirect to login page
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1000);
      });
    }

    // Handle profile and settings buttons
    setupNavButtons();

    // Load posts from Firebase
    const postsContainer = document.getElementById("postsContainer");
    const postTemplate = document.getElementById("postTemplate");

    if (postsContainer && postTemplate) {
      loadPosts(postsContainer, postTemplate, currentUser);
    }
  }, 500); // Wait 500ms for Firebase to initialize
});

function setupNavButtons() {
  const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));

  // Handle profile button
  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
      // Check if user is logged in
      if (!currentUser) {
        e.preventDefault();
        showNotification("Please log in to view your profile", "error");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        // The link will work normally and go to profile.html
        showNotification("Loading your profile...", "info");
      }
    });
  }

  // Handle settings button
  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      // Check if user is logged in
      if (!currentUser) {
        e.preventDefault();
        showNotification("Please log in to access settings", "error");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        // The link will work normally and go to settings.html
        showNotification("Loading settings...", "info");
      }
    });
  }
}

function loadPosts(postsContainer, postTemplate, currentUser) {
  console.log("Loading posts from Firebase...");

  // Show loading state
  postsContainer.innerHTML = `
    <div class="loading-state block-appear">
      <i class="fas fa-cube fa-spin"></i>
      <h3>Loading posts...</h3>
      <p>Please wait while we fetch the latest Minecraft creations</p>
    </div>
  `;

  // Get posts from Firebase
  db.collection("posts")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      console.log(`Retrieved ${querySnapshot.size} posts`);

      // Clear loading state
      postsContainer.innerHTML = "";

      if (querySnapshot.empty) {
        // Show empty state if no posts
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state block-appear";
        emptyState.innerHTML = `
          <i class="fas fa-cube"></i>
          <h3>No Posts Yet</h3>
          <p>Be the first to share your Minecraft progress!</p>
          <a href="create-post.html" class="btn btn-primary">Create Post</a>
        `;
        postsContainer.appendChild(emptyState);
      } else {
        // Render posts
        querySnapshot.forEach((doc, index) => {
          const post = doc.data();
          post.id = doc.id; // Add the document ID as post ID

          console.log(`Rendering post ${index + 1}:`, post.title);

          const postElement = postTemplate.content.cloneNode(true);

          // Set post data
          postElement.querySelector(".author-avatar").src = post.author.avatar;
          postElement.querySelector(".author-avatar").alt = post.author.name;
          postElement.querySelector(".author-name").textContent =
            post.author.name;
          postElement.querySelector(
            ".author-name"
          ).href = `user.html?username=${post.author.name}`;
          postElement.querySelector(".post-time").textContent = post.createdAt;
          postElement.querySelector(".post-category").textContent =
            post.category;
          postElement.querySelector(".post-image").src = post.image;
          postElement.querySelector(".post-image").alt = post.title;
          postElement.querySelector(".post-title").textContent = post.title;
          postElement.querySelector(".post-text").textContent = post.content;
          postElement.querySelector(".like-count").textContent = post.likes;
          postElement.querySelector(".comment-count").textContent =
            post.comments;

          // Set links
          const postLinks = postElement.querySelectorAll(
            ".post-image-container, .post-title-link"
          );
          postLinks.forEach((link) => {
            link.href = `post-detail.html?id=${post.id}`;
          });

          // Add event listeners
          const likeBtn = postElement.querySelector(".like-btn");
          likeBtn.addEventListener("click", function () {
            // Check if user is logged in
            if (!currentUser) {
              showNotification("Please log in to like posts", "error");
              return;
            }

            this.classList.toggle("active");
            const likeCount = this.querySelector(".like-count");
            const newLikeCount = this.classList.contains("active")
              ? Number.parseInt(likeCount.textContent) + 1
              : Number.parseInt(likeCount.textContent) - 1;

            likeCount.textContent = newLikeCount;

            // Update likes in Firebase
            db.collection("posts")
              .doc(post.id)
              .update({
                likes: newLikeCount,
              })
              .catch((error) => {
                console.error("Error updating likes: ", error);
                showNotification(
                  "Error updating likes. Please try again.",
                  "error"
                );
              });
          });

          const saveBtn = postElement.querySelector(".save-btn");
          saveBtn.addEventListener("click", function () {
            // Check if user is logged in
            if (!currentUser) {
              showNotification("Please log in to save posts", "error");
              return;
            }

            this.classList.toggle("active");

            if (this.classList.contains("active")) {
              showNotification("Post saved to your collection", "success");
            } else {
              showNotification("Post removed from your collection", "info");
            }
          });

          // Add post to container with animation
          const postCard = postElement.querySelector(".post-card");
          postCard.classList.add("block-appear");
          postCard.style.animationDelay = `${index * 0.1}s`;
          postCard.setAttribute("data-post-id", post.id);

          postsContainer.appendChild(postElement);
        });
      }
    })
    .catch((error) => {
      console.error("Error getting posts: ", error);
      postsContainer.innerHTML = `
        <div class="error-state block-appear">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Posts</h3>
          <p>There was a problem connecting to the database. Please try again later.</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      `;
    });
}

// Update UI based on user login state
function updateUIForUser(user) {
  console.log("Updating UI for user:", user);

  // Update header
  const createPostBtn = document.querySelector(".create-btn");
  const userNavContainer = document.querySelector(".user-nav");
  const headerContainer = document.querySelector(".header-container");

  if (headerContainer) {
    if (user) {
      // User is logged in
      if (createPostBtn) {
        createPostBtn.style.display = "block";
        createPostBtn.href = "create-post.html";
        createPostBtn.textContent = "Share Progress";
      }

      if (userNavContainer) {
        // Update avatar
        const userAvatar = userNavContainer.querySelector(".user-avatar img");
        if (userAvatar) {
          userAvatar.src = user.avatar;
          userAvatar.alt = user.username;
        }

        // Update dropdown menu
        const userMenu = document.getElementById("userMenu");
        if (userMenu) {
          const username = userMenu.querySelector(".username");
          const email = userMenu.querySelector(".email");

          if (username) username.textContent = user.username;
          if (email) email.textContent = user.email;
        }
      }
    } else {
      // User is not logged in
      if (createPostBtn) {
        createPostBtn.href = "login.html";
        createPostBtn.textContent = "Login / Sign Up";
      }

      // Replace user nav with login/signup buttons if not already there
      if (userNavContainer && !document.querySelector(".auth-buttons")) {
        userNavContainer.innerHTML = `
          <div class="auth-buttons">
            <a href="login.html" class="btn btn-outline btn-sm">Login</a>
            <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
          </div>
        `;
      }
    }
  }
}

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
