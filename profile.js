document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("blockShareUser"))
    if (!currentUser) {
      // Redirect to login page if not logged in
      window.location.href = "login.html"
      return
    }
  
    // Update profile information
    const profileUsername = document.getElementById("profileUsername")
    const profileEmail = document.getElementById("profileEmail")
    const profileAvatar = document.getElementById("profileAvatar")
  
    if (profileUsername) profileUsername.textContent = currentUser.username
    if (profileEmail) profileEmail.textContent = currentUser.email
    if (profileAvatar) profileAvatar.src = currentUser.avatar
  
    // Handle tab switching
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked button
        this.classList.add("active")
  
        // Show corresponding content
        const tabId = this.getAttribute("data-tab")
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  
    // Load user posts
    const userPostsContainer = document.getElementById("userPostsContainer")
    if (userPostsContainer) {
      // Get posts from localStorage
      const allPosts = JSON.parse(localStorage.getItem("blockSharePosts") || "[]")
  
      // Filter posts by current user
      const userPosts = allPosts.filter((post) => post.author.name === currentUser.username)
  
      // Clear existing content
      userPostsContainer.innerHTML = ""
  
      if (userPosts.length > 0) {
        // Add posts to grid
        userPosts.forEach((post) => {
          const postElement = document.createElement("div")
          postElement.className = "post-grid-item"
          postElement.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="post-grid-image">
            <div class="post-grid-overlay">
              <div class="post-grid-stats">
                <span><i class="fas fa-heart"></i> ${post.likes}</span>
                <span><i class="fas fa-comment"></i> ${post.comments}</span>
              </div>
            </div>
          `
  
          // Add click event to navigate to post detail
          postElement.addEventListener("click", () => {
            window.location.href = `post-detail.html?id=${post.id}`
          })
  
          userPostsContainer.appendChild(postElement)
        })
      } else {
        // Show empty state
        userPostsContainer.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-camera"></i>
            <h3>No posts yet</h3>
            <p>Share your Minecraft creations with the community</p>
            <a href="create-post.html" class="btn btn-primary">Create Your First Post</a>
          </div>
        `
      }
    }
  
    // Load saved posts
    const savedPostsContainer = document.getElementById("savedPostsContainer")
    if (savedPostsContainer) {
      // In a real app, you would fetch saved posts from a database
      // For this demo, we'll just show an empty state
      savedPostsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-bookmark"></i>
          <h3>No saved posts</h3>
          <p>Posts you save will appear here</p>
          <a href="index.html" class="btn btn-primary">Browse Posts</a>
        </div>
      `
    }
  })
  
  