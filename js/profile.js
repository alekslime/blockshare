document.addEventListener("DOMContentLoaded", function() {
  console.log("Profile page loaded");
  
  // Wait for Firebase to initialize
  setTimeout(() => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));
    if (!currentUser) {
      showNotification("Please log in to view your profile", "error");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      return;
    }
    
    // Update profile info
    document.getElementById("profileUsername").textContent = currentUser.username;
    document.getElementById("profileEmail").textContent = currentUser.email;
    document.getElementById("profileAvatar").src = currentUser.avatar;
    
    // Handle tabs
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    
    tabBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        // Remove active class from all buttons
        tabBtns.forEach(b => b.classList.remove("active"));
        
        // Add active class to clicked button
        this.classList.add("active");
        
        // Get tab to show
        const tabToShow = this.dataset.tab;
        
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove("active"));
        
        // Show selected tab content
        document.getElementById(`${tabToShow}-tab`).classList.add("active");
      });
    });
    
    // Load user posts
    loadUserPosts(currentUser.id);
    
    // Load saved posts
    loadSavedPosts(currentUser.id);
  }, 500); // Wait for Firebase to initialize
});

function loadUserPosts(userId) {
  const userPostsContainer = document.getElementById("userPostsContainer");
  
  // Show loading state
  userPostsContainer.innerHTML = `
    <div class="loading-state block-appear">
      <i class="fas fa-cube fa-spin"></i>
      <h3>Loading your posts...</h3>
    </div>
  `;
  
  // Get posts from Firebase
  db.collection("posts")
    .where("author.id", "==", userId)
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      // Clear loading state
      userPostsContainer.innerHTML = '';
      
      if (querySnapshot.empty) {
        // Show empty state if no posts
        userPostsContainer.innerHTML = `
          <div class="empty-state block-appear">
            <i class="fas fa-cube"></i>
            <h3>No Posts Yet</h3>
            <p>Share your Minecraft progress with the community!</p>
            <a href="create-post.html" class="btn btn-primary">Create Post</a>
          </div>
        `;
      } else {
        // Render posts
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          
          const postElement = document.createElement("div");
          postElement.className = "post-grid-item block-appear";
          postElement.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="post-grid-image">
            <div class="post-grid-overlay">
              <div class="post-grid-stats">
                <span><i class="fas fa-heart"></i> ${post.likes}</span>
                <span><i class="fas fa-comment"></i> ${post.comments}</span>
              </div>
            </div>
          `;
          
          // Add click event
          postElement.addEventListener("click", function() {
            window.location.href = `post-detail.html?id=${post.id}`;
          });
          
          userPostsContainer.appendChild(postElement);
        });
      }
    })
    .catch((error) => {
      console.error("Error getting user posts: ", error);
      userPostsContainer.innerHTML = `
        <div class="error-state block-appear">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Posts</h3>
          <p>There was a problem loading your posts. Please try again later.</p>
        </div>
      `;
    });
}

function loadSavedPosts(userId) {
  const savedPostsContainer = document.getElementById("savedPostsContainer");
  
  // Show loading state
  savedPostsContainer.innerHTML = `
    <div class="loading-state block-appear">
      <i class="fas fa-cube fa-spin"></i>
      <h3>Loading saved posts...</h3>
    </div>
  `;
  
  // For demo purposes, we'll just show an empty state
  // In a real app, you would query saved posts from Firebase
  setTimeout(() => {
    savedPostsContainer.innerHTML = `
      <div class="empty-state block-appear">
        <i class="fas fa-bookmark"></i>
        <h3>No Saved Posts</h3>
        <p>Posts you save will appear here for easy access.</p>
        <a href="index.html" class="btn btn-primary">Browse Posts</a>
      </div>
    `;
  }, 1000);
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