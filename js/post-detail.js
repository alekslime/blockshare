document.addEventListener("DOMContentLoaded", () => {
  // Get post ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    window.location.href = "index.html";
    return;
  }

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));

  // Get post from Firebase
  db.collection("posts").doc(postId).get()
    .then((doc) => {
      if (doc.exists) {
        const post = doc.data();
        post.id = doc.id;
        
        // Populate post details
        document.getElementById("postTitle").textContent = post.title;
        document.getElementById("postContent").textContent = post.content;
        document.getElementById("postImage").src = post.image;
        document.getElementById("postImage").alt = post.title;
        document.getElementById("postAuthorAvatar").src = post.author.avatar;
        document.getElementById("postAuthorAvatar").alt = post.author.name;
        document.getElementById("postAuthorName").textContent = post.author.name;
        document.getElementById("postAuthorName").href = `user.html?username=${post.author.name}`;
        document.getElementById("postTime").textContent = post.createdAt;
        document.getElementById("postCategory").textContent = post.category;
        document.getElementById("likeCount").textContent = post.likes;
        document.getElementById("commentCount").textContent = post.comments;
        
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
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Error getting post: ", error);
      showNotification("Error loading post. Please try again later.", "error");
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
            
            const commentElement = commentTemplate.content.cloneNode(true);
            
            // Set comment data
            commentElement.querySelector(".comment-avatar").src = comment.author.avatar;
            commentElement.querySelector(".comment-avatar").alt = comment.author.name;
            commentElement.querySelector(".comment-author").textContent = comment.author.name;
            commentElement.querySelector(".comment-author").href = `user.html?username=${comment.author.name}`;
            commentElement.querySelector(".comment-time").textContent = comment.createdAt;
            commentElement.querySelector(".comment-text").textContent = comment.content;
            commentElement.querySelector(".comment-like-count").textContent = comment.likes;
            
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
              db.collection("posts").doc(postId).collection("comments").doc(comment.id).update({
                likes: newLikeCount
              }).catch(error => {
                console.error("Error updating comment likes: ", error);
              });
            });
            
            // Add to list
            commentsList.appendChild(commentElement);
          });
        }
      })
      .catch((error) => {
        console.error("Error getting comments: ", error);
        commentsList.innerHTML = '<div class="error-state"><i class="fas fa-exclamation-triangle"></i><p>Error loading comments. Please try again later.</p></div>';
      });
  }

  // Handle comment submission
  const commentInput = document.getElementById("commentInput");
  const postCommentBtn = document.getElementById("postCommentBtn");

  postCommentBtn.addEventListener("click", () => {
    if (!commentInput.value.trim()) {
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
        const commentTemplate = document.getElementById("commentTemplate");
        const commentElement = commentTemplate.content.cloneNode(true);
        
        // Set comment data
        commentElement.querySelector(".comment-avatar").src = newComment.author.avatar;
        commentElement.querySelector(".comment-avatar").alt = newComment.author.name;
        commentElement.querySelector(".comment-author").textContent = newComment.author.name;
        commentElement.querySelector(".comment-author").href = `user.html?username=${newComment.author.name}`;
        commentElement.querySelector(".comment-time").textContent = newComment.createdAt;
        commentElement.querySelector(".comment-text").textContent = newComment.content;
        commentElement.querySelector(".comment-like-count").textContent = newComment.likes;
        
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

  // Function to show notification
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
});