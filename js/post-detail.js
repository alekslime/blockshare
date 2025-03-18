document.addEventListener("DOMContentLoaded", () => {
  console.log("Post detail page loaded");
  
  // Check if Firebase is initialized
  if (typeof firebase === 'undefined') {
    console.error("Firebase SDK not loaded!");
    showNotification("Error: Firebase SDK not loaded. Please check your internet connection and try again.", "error");
    return;
  }
  
  // Check if Firestore is available
  if (!window.db) {
    console.error("Firestore not initialized!");
    showNotification("Error: Database not initialized. Please check your console for details.", "error");
    return;
  }
  
  // Get post ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    console.error("No post ID provided");
    showNotification("Error: No post ID provided", "error");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
    return;
  }

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));

  // Show loading state
  document.querySelector(".post-detail-card").innerHTML = `
    <div class="loading-state block-appear">
      <i class="fas fa-cube fa-spin"></i>
      <h3>Loading post...</h3>
      <p>Please wait while we fetch the details</p>
    </div>
  `;
  
  document.querySelector(".comments-list").innerHTML = `
    <div class="loading-state block-appear">
      <i class="fas fa-comment fa-spin"></i>
      <h3>Loading comments...</h3>
      <p>Please wait...</p>
    </div>
  `;

  // Get post from Firebase
  db.collection("posts").doc(postId).get()
    .then((doc) => {
      if (doc.exists) {
        const post = doc.data();
        post.id = doc.id;
        
        console.log("Post data retrieved:", post.title);
        
        // Reset post detail card content
        document.querySelector(".post-detail-card").innerHTML = `
          <div class="post-detail-header">
            <div class="post-author">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar" id="postAuthorAvatar">
              <div class="author-info">
                <a href="user.html?username=${post.author.name}" class="author-name" id="postAuthorName">${post.author.name}</a>
                <p class="post-time" id="postTime">${post.createdAt}</p>
              </div>
            </div>
            <div class="post-category" id="postCategory">${post.category}</div>
          </div>
          <h1 class="post-detail-title" id="postTitle">${post.title}</h1>
          <div class="post-detail-image-container">
            <img src="${post.image}" alt="${post.title}" class="post-detail-image" id="postImage">
          </div>
          <div class="post-detail-content">
            <p id="postContent">${post.content}</p>
          </div>
          <div class="post-detail-footer">
            <div class="post-actions">
              <button class="post-action like-btn" id="likeBtn">
                <i class="fas fa-heart"></i>
                <span class="like-count" id="likeCount">${post.likes}</span>
              </button>
              <button class="post-action comment-btn">
                <i class="fas fa-comment"></i>
                <span class="comment-count" id="commentCount">${post.comments}</span>
              </button>
              <button class="post-action share-btn">
                <i class="fas fa-share"></i>
              </button>
            </div>
            <button class="post-action save-btn" id="saveBtn">
              <i class="fas fa-bookmark"></i>
            </button>
          </div>
        `;
        
        // Set page title
        document.title = `${post.title} - BlockShare`;
        
        // Handle like button
        const likeBtn = document.getElementById("likeBtn");
        likeBtn.addEventListener("click", function () {
          if (!currentUser) {
            showNotification("Please log in to like posts", "error");
            return;
          }
          
          this.classList.toggle("active");
          const likeCount = document.getElementById("likeCount");
          const newLikeCount = this.classList.contains("active") 
            ? Number.parseInt(likeCount.textContent) + 1 
            : Number.parseInt(likeCount.textContent) - 1;
          
          likeCount.textContent = newLikeCount;
          
          // Update likes in Firebase
          db.collection("posts").doc(postId).update({
            likes: newLikeCount
          }).catch(error => {
            console.error("Error updating likes: ", error);
            showNotification("Error updating likes. Please try again.", "error");
          });
        });

        // Handle save button
        const saveBtn = document.getElementById("saveBtn");
        saveBtn.addEventListener("click", function () {
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
        
        // Load comments
        loadComments(postId);
      } else {
        // Post not found
        console.error("Post not found");
        showNotification("Error: Post not found", "error");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }
    })
    .catch((error) => {
      console.error("Error getting post: ", error);
      showNotification("Error loading post. Please try again later.", "error");
      document.querySelector(".post-detail-card").innerHTML = `
        <div class="error-state block-appear">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Post</h3>
          <p>There was a problem retrieving the post. Please try again later.</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      `;
    });

  // Function to load comments
  function loadComments(postId) {
    const commentsList = document.getElementById("commentsList");
    const commentTemplate = document.getElementById("commentTemplate");
    
    db.collection("posts").doc(postId).collection("comments")
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          // Show empty state for comments
          commentsList.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-comment"></i>
              <h3>No comments yet</h3>
              <p>Be the first to comment on this post!</p>
            </div>
          `;
        } else {
          // Clear existing content
          commentsList.innerHTML = "";
          
          // Render comments
          querySnapshot.forEach((doc) => {
            const comment = doc.data();
            comment.id = doc.id;
            
            const commentElement = document.createElement("div");
            commentElement.className = "comment-card block-appear";
            commentElement.innerHTML = `
              <div class="comment-header">
                <img src="${comment.author.avatar}" alt="${comment.author.name}" class="comment-avatar">
                <div class="comment-info">
                  <div class="comment-author-row">
                    <a href="user.html?username=${comment.author.name}" class="comment-author">${comment.author.name}</a>
                    <span class="comment-time">${comment.createdAt}</span>
                  </div>
                  <p class="comment-text">${comment.content}</p>
                  <button class="comment-like-btn" data-comment-id="${comment.id}">
                    <i class="fas fa-heart"></i>
                    <span class="comment-like-count">${comment.likes}</span>
                  </button>
                </div>
              </div>
            `;
            
            // Add to list
            commentsList.appendChild(commentElement);
            
            // Add event listener for like button
            const commentLikeBtn = commentElement.querySelector(".comment-like-btn");
            commentLikeBtn.addEventListener("click", function () {
              if (!currentUser) {
                showNotification("Please log in to like comments", "error");
                return;
              }
              
              this.classList.toggle("active");
              const likeCount = this.querySelector(".comment-like-count");
              const newLikeCount = this.classList.contains("active") 
                ? Number.parseInt(likeCount.textContent) + 1 
                : Number.parseInt(likeCount.textContent) - 1;
              
              likeCount.textContent = newLikeCount;
              
              // Update likes in Firebase
              const commentId = this.getAttribute("data-comment-id");
              db.collection("posts").doc(postId).collection("comments").doc(commentId).update({
                likes: newLikeCount
              }).catch(error => {
                console.error("Error updating comment likes: ", error);
                showNotification("Error updating likes. Please try again.", "error");
              });
            });
          });
        }
      })
      .catch((error) => {
        console.error("Error getting comments: ", error);
        commentsList.innerHTML = `
          <div class="error-state block-appear">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error Loading Comments</h3>
            <p>There was a problem retrieving the comments. Please try again later.</p>
          </div>
        `;
      });
  }

  // Handle comment submission
  const commentInput = document.getElementById("commentInput");
  const postCommentBtn = document.getElementById("postCommentBtn");

  if (commentInput && postCommentBtn) {
    postCommentBtn.addEventListener("click", () => {
      if (!commentInput.value.trim()) {
        showNotification("Please enter a comment", "error");
        return;
      }

      // Check if user is logged in
      if (!currentUser) {
        showNotification("Please log in to comment", "error");
        return;
      }

      // Disable button while posting
      postCommentBtn.disabled = true;
      postCommentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

      // Create new comment
      const newComment = {
        author: {
          name: currentUser.username,
          avatar: currentUser.avatar,
        },
        content: commentInput.value.trim(),
        createdAt: "Just now",
        likes: 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Add comment to Firebase
      db.collection("posts").doc(postId).collection("comments").add(newComment)
        .then((docRef) => {
          console.log("Comment added successfully with ID:", docRef.id);
          
          // Clear input
          commentInput.value = "";
          
          // Update comment count
          const commentCount = document.getElementById("commentCount");
          const newCommentCount = Number.parseInt(commentCount.textContent) + 1;
          commentCount.textContent = newCommentCount;
          
          // Update post document with new comment count
          db.collection("posts").doc(postId).update({
            comments: newCommentCount
          });
          
          // If this is the first comment, clear the empty state
          const emptyState = document.querySelector(".empty-state");
          if (emptyState) {
            document.getElementById("commentsList").innerHTML = "";
          }
          
          // Create comment element
          const commentElement = document.createElement("div");
          commentElement.className = "comment-card block-appear";
          commentElement.innerHTML = `
            <div class="comment-header">
              <img src="${newComment.author.avatar}" alt="${newComment.author.name}" class="comment-avatar">
              <div class="comment-info">
                <div class="comment-author-row">
                  <a href="user.html?username=${newComment.author.name}" class="comment-author">${newComment.author.name}</a>
                  <span class="comment-time">${newComment.createdAt}</span>
                </div>
                <p class="comment-text">${newComment.content}</p>
                <button class="comment-like-btn" data-comment-id="${docRef.id}">
                  <i class="fas fa-heart"></i>
                  <span class="comment-like-count">0</span>
                </button>
              </div>
            </div>
          `;
          
          // Add event listener for like button
          const commentLikeBtn = commentElement.querySelector(".comment-like-btn");
          commentLikeBtn.addEventListener("click", function () {
            this.classList.toggle("active");
            const likeCount = this.querySelector(".comment-like-count");
            const newLikeCount = this.classList.contains("active") 
              ? Number.parseInt(likeCount.textContent) + 1 
              : Number.parseInt(likeCount.textContent) - 1;
            
            likeCount.textContent = newLikeCount;
            
            // Update likes in Firebase
            db.collection("posts").doc(postId).collection("comments").doc(docRef.id).update({
              likes: newLikeCount
            }).catch(error => {
              console.error("Error updating comment likes: ", error);
            });
          });
          
          // Add to top of comments list
          const commentsList = document.getElementById("commentsList");
          commentsList.insertBefore(commentElement, commentsList.firstChild);
          
          // Show success notification
          showNotification("Comment posted successfully!", "success");
          
          // Reset button
          postCommentBtn.disabled = false;
          postCommentBtn.innerHTML = "Post Comment";
        })
        .catch((error) => {
          console.error("Error adding comment: ", error);
          showNotification("Error posting comment. Please try again.", "error");
          postCommentBtn.disabled = false;
          postCommentBtn.innerHTML = "Post Comment";
        });
    });
  }

  // Function to show notification
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
});