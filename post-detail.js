document.addEventListener("DOMContentLoaded", () => {
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const postId = urlParams.get("id")
  
    if (!postId) {
      window.location.href = "index.html"
      return
    }
  
    // Sample post data (in a real app, you would fetch this from a server)
    const post = {
      id: postId,
      title: "My Medieval Castle Build",
      content:
        "Just finished this castle after 3 weeks of building. What do you think? I used mainly stone bricks, oak wood, and some dark oak accents. The interior is fully decorated with custom furniture designs.\n\nI'm particularly proud of the throne room and the library. The towers have spiral staircases and the walls have hidden passages. I also built a moat with a working drawbridge using redstone.\n\nLet me know what you think and if you have any suggestions for improvements!",
      image: "https://via.placeholder.com/1200x600",
      author: {
        name: "DiamondMiner42",
        avatar: "https://via.placeholder.com/40",
      },
      likes: 124,
      comments: 18,
      createdAt: "2 hours ago",
      category: "builds",
    }
  
    // Sample comments
    const comments = [
      {
        id: "1",
        author: {
          name: "EnderQueen",
          avatar: "https://via.placeholder.com/40",
        },
        content: "This is absolutely incredible! How long did it take you to gather all the materials?",
        createdAt: "1 hour ago",
        likes: 12,
      },
      {
        id: "2",
        author: {
          name: "RedstoneWizard",
          avatar: "https://via.placeholder.com/40",
        },
        content: "The drawbridge mechanism looks amazing. Would you mind sharing a tutorial on how you built it?",
        createdAt: "45 minutes ago",
        likes: 8,
      },
      {
        id: "3",
        author: {
          name: "PixelBuilder",
          avatar: "https://via.placeholder.com/40",
        },
        content: "I love the use of dark oak accents with the stone bricks. Really adds depth to the build!",
        createdAt: "30 minutes ago",
        likes: 5,
      },
    ]
  
    // Populate post details
    document.getElementById("postTitle").textContent = post.title
    document.getElementById("postContent").textContent = post.content
    document.getElementById("postImage").src = post.image
    document.getElementById("postImage").alt = post.title
    document.getElementById("postAuthorAvatar").src = post.author.avatar
    document.getElementById("postAuthorAvatar").alt = post.author.name
    document.getElementById("postAuthorName").textContent = post.author.name
    document.getElementById("postAuthorName").href = `user.html?username=${post.author.name}`
    document.getElementById("postTime").textContent = post.createdAt
    document.getElementById("postCategory").textContent = post.category
    document.getElementById("likeCount").textContent = post.likes
    document.getElementById("commentCount").textContent = post.comments
  
    // Set page title
    document.title = `${post.title} - BlockShare`
  
    // Handle like button
    const likeBtn = document.getElementById("likeBtn")
    likeBtn.addEventListener("click", function () {
      this.classList.toggle("active")
      const likeCount = document.getElementById("likeCount")
      if (this.classList.contains("active")) {
        likeCount.textContent = Number.parseInt(likeCount.textContent) + 1
      } else {
        likeCount.textContent = Number.parseInt(likeCount.textContent) - 1
      }
    })
  
    // Handle save button
    const saveBtn = document.getElementById("saveBtn")
    saveBtn.addEventListener("click", function () {
      this.classList.toggle("active")
    })
  
    // Render comments
    const commentsList = document.getElementById("commentsList")
    const commentTemplate = document.getElementById("commentTemplate")
  
    comments.forEach((comment) => {
      const commentElement = commentTemplate.content.cloneNode(true)
  
      commentElement.querySelector(".comment-avatar").src = comment.author.avatar
      commentElement.querySelector(".comment-avatar").alt = comment.author.name
      commentElement.querySelector(".comment-author").textContent = comment.author.name
      commentElement.querySelector(".comment-author").href = `user.html?username=${comment.author.name}`
      commentElement.querySelector(".comment-time").textContent = comment.createdAt
      commentElement.querySelector(".comment-text").textContent = comment.content
      commentElement.querySelector(".comment-like-count").textContent = comment.likes
  
      // Add event listener for like button
      const commentLikeBtn = commentElement.querySelector(".comment-like-btn")
      commentLikeBtn.addEventListener("click", function () {
        this.classList.toggle("active")
        const likeCount = this.querySelector(".comment-like-count")
        if (this.classList.contains("active")) {
          likeCount.textContent = Number.parseInt(likeCount.textContent) + 1
        } else {
          likeCount.textContent = Number.parseInt(likeCount.textContent) - 1
        }
      })
  
      // Add comment to list with animation
      const commentCard = commentElement.querySelector(".comment-card")
      commentCard.classList.add("block-appear")
      commentCard.style.animationDelay = `${comments.indexOf(comment) * 0.1}s`
  
      commentsList.appendChild(commentElement)
    })
  
    // Handle comment submission
    const commentInput = document.getElementById("commentInput")
    const postCommentBtn = document.getElementById("postCommentBtn")
  
    postCommentBtn.addEventListener("click", () => {
      if (commentInput.value.trim() === "") {
        return
      }
  
      // Create new comment
      const newComment = {
        id: Date.now().toString(),
        author: {
          name: "SteveCreeper",
          avatar: "https://via.placeholder.com/40",
        },
        content: commentInput.value.trim(),
        createdAt: "Just now",
        likes: 0,
      }
  
      // Create comment element
      const commentElement = commentTemplate.content.cloneNode(true)
  
      commentElement.querySelector(".comment-avatar").src = newComment.author.avatar
      commentElement.querySelector(".comment-avatar").alt = newComment.author.name
      commentElement.querySelector(".comment-author").textContent = newComment.author.name
      commentElement.querySelector(".comment-author").href = `user.html?username=${newComment.author.name}`
      commentElement.querySelector(".comment-time").textContent = newComment.createdAt
      commentElement.querySelector(".comment-text").textContent = newComment.content
      commentElement.querySelector(".comment-like-count").textContent = newComment.likes
  
      // Add event listener for like button
      const commentLikeBtn = commentElement.querySelector(".comment-like-btn")
      commentLikeBtn.addEventListener("click", function () {
        this.classList.toggle("active")
        const likeCount = this.querySelector(".comment-like-count")
        if (this.classList.contains("active")) {
          likeCount.textContent = Number.parseInt(likeCount.textContent) + 1
        } else {
          likeCount.textContent = Number.parseInt(likeCount.textContent) - 1
        }
      })
  
      // Add animation
      const commentCard = commentElement.querySelector(".comment-card")
      commentCard.classList.add("block-appear")
  
      // Add to top of comments list
      commentsList.insertBefore(commentElement, commentsList.firstChild)
  
      // Update comment count
      const commentCount = document.getElementById("commentCount")
      commentCount.textContent = Number.parseInt(commentCount.textContent) + 1
  
      // Clear input
      commentInput.value = ""
    })
  })
  
  