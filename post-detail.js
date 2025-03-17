document.addEventListener("DOMContentLoaded", () => {
  // Get post ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    window.location.href = "index.html";
    return;
  }

  // Get posts from localStorage
  const posts = JSON.parse(localStorage.getItem("blockSharePosts") || "[]");

  // Find the post with the matching ID
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    // Post not found, redirect to home
    window.location.href = "index.html";
    return;
  }

  // Populate post details
  document.getElementById("postTitle").textContent = post.title;
  document.getElementById("postContent").textContent = post.content;
  document.getElementById("postImage").src = post.image;
  document.getElementById("postImage").alt = post.title;
  document.getElementById("postAuthorAvatar").src = post.author.avatar;
  document.getElementById("postAuthorAvatar").alt = post.author.name;
  document.getElementById("postAuthorName").textContent = post.author.name;
  document.getElementById(
    "postAuthorName"
  ).href = `user.html?username=${post.author.name}`;
  document.getElementById("postTime").textContent = post.createdAt;
  document.getElementById("postCategory").textContent = post.category;
  document.getElementById("likeCount").textContent = post.likes;
  document.getElementById("commentCount").textContent = post.comments;

  // Set page title
  document.title = `${post.title} - BlockShare`;

  // Handle like button
  const likeBtn = document.getElementById("likeBtn");
  likeBtn.addEventListener("click", function () {
    this.classList.toggle("active");
    const likeCount = document.getElementById("likeCount");
    if (this.classList.contains("active")) {
      likeCount.textContent = Number.parseInt(likeCount.textContent) + 1;
    } else {
      likeCount.textContent = Number.parseInt(likeCount.textContent) - 1;
    }
  });

  // Handle save button
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", function () {
    this.classList.toggle("active");
  });

  // Sample comments (in a real app, these would be stored with the post)
  const comments = post.comments ? post.comments : [];

  // Render comments
  const commentsList = document.getElementById("commentsList");
  const commentTemplate = document.getElementById("commentTemplate");

  if (comments.length > 0) {
    comments.forEach((comment) => {
      const commentElement = commentTemplate.content.cloneNode(true);

      commentElement.querySelector(".comment-avatar").src =
        comment.author.avatar;
      commentElement.querySelector(".comment-avatar").alt = comment.author.name;
      commentElement.querySelector(".comment-author").textContent =
        comment.author.name;
      commentElement.querySelector(
        ".comment-author"
      ).href = `user.html?username=${comment.author.name}`;
      commentElement.querySelector(".comment-time").textContent =
        comment.createdAt;
      commentElement.querySelector(".comment-text").textContent =
        comment.content;
      commentElement.querySelector(".comment-like-count").textContent =
        comment.likes;

      // Add event listener for like button
      const commentLikeBtn = commentElement.querySelector(".comment-like-btn");
      commentLikeBtn.addEventListener("click", function () {
        this.classList.toggle("active");
        const likeCount = this.querySelector(".comment-like-count");
        if (this.classList.contains("active")) {
          likeCount.textContent = Number.parseInt(likeCount.textContent) + 1;
        } else {
          likeCount.textContent = Number.parseInt(likeCount.textContent) - 1;
        }
      });

      // Add comment to list with animation
      const commentCard = commentElement.querySelector(".comment-card");
      commentCard.classList.add("block-appear");
      commentCard.style.animationDelay = `${comments.indexOf(comment) * 0.1}s`;

      commentsList.appendChild(commentElement);
    });
  } else {
    // Show empty state for comments
    commentsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-comment"></i>
          <h3>No comments yet</h3>
          <p>Be the first to comment on this post!</p>
        </div>
      `;
  }

  // Handle comment submission
  const commentInput = document.getElementById("commentInput");
  const postCommentBtn = document.getElementById("postCommentBtn");

  postCommentBtn.addEventListener("click", () => {
    if (commentInput.value.trim() === "") {
      return;
    }

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));
    if (!currentUser) {
      showNotification("Please log in to comment", "error");
      return;
    }

    // Create new comment
    const newComment = {
      id: Date.now().toString(),
      author: {
        name: currentUser.username,
        avatar: currentUser.avatar,
      },
      content: commentInput.value.trim(),
      createdAt: "Just now",
      likes: 0,
    };

    // If this is the first comment, clear the empty state
    if (comments.length === 0) {
      commentsList.innerHTML = "";
    }

    // Create comment element
    const commentElement = commentTemplate.content.cloneNode(true);

    commentElement.querySelector(".comment-avatar").src =
      newComment.author.avatar;
    commentElement.querySelector(".comment-avatar").alt =
      newComment.author.name;
    commentElement.querySelector(".comment-author").textContent =
      newComment.author.name;
    commentElement.querySelector(
      ".comment-author"
    ).href = `user.html?username=${newComment.author.name}`;
    commentElement.querySelector(".comment-time").textContent =
      newComment.createdAt;
    commentElement.querySelector(".comment-text").textContent =
      newComment.content;
    commentElement.querySelector(".comment-like-count").textContent =
      newComment.likes;

    // Add event listener for like button
    const commentLikeBtn = commentElement.querySelector(".comment-like-btn");
    commentLikeBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      const likeCount = this.querySelector(".comment-like-count");
      if (this.classList.contains("active")) {
        likeCount.textContent = Number.parseInt(likeCount.textContent) + 1;
      } else {
        likeCount.textContent = Number.parseInt(likeCount.textContent) - 1;
      }
    });

    // Add animation
    const commentCard = commentElement.querySelector(".comment-card");
    commentCard.classList.add("block-appear");

    // Add to top of comments list
    commentsList.insertBefore(commentElement, commentsList.firstChild);

    // Update comment count
    const commentCount = document.getElementById("commentCount");
    commentCount.textContent = Number.parseInt(commentCount.textContent) + 1;

    // Clear input
    commentInput.value = "";

    // Show success notification
    showNotification("Comment posted successfully!", "success");
  });

  // Function to show notification
  function showNotification(message, type = "info") {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector(
      ".notification-container"
    );
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
});
