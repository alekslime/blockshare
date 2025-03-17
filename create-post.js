document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("blockShareUser"))
    if (!currentUser) {
      // Redirect to login page if not logged in
      window.location.href = "login.html"
      return
    }
  
    const imageInput = document.getElementById("image")
    const selectImageBtn = document.getElementById("selectImageBtn")
    const imageUploadPlaceholder = document.getElementById("imageUploadPlaceholder")
    const imagePreviewContainer = document.getElementById("imagePreviewContainer")
    const imagePreview = document.getElementById("imagePreview")
    const changeImageBtn = document.getElementById("changeImageBtn")
    const createPostForm = document.getElementById("createPostForm")
    const submitPostBtn = document.getElementById("submitPostBtn")
  
    // Handle image selection
    if (selectImageBtn && imageInput) {
      selectImageBtn.addEventListener("click", () => {
        imageInput.click()
      })
    }
  
    // Handle image preview
    if (imageInput && imagePreview && imageUploadPlaceholder && imagePreviewContainer) {
      imageInput.addEventListener("change", function () {
        const file = this.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            imagePreview.src = e.target.result
            imageUploadPlaceholder.classList.add("hidden")
            imagePreviewContainer.classList.remove("hidden")
          }
          reader.readAsDataURL(file)
        }
      })
  
      // Handle change image button
      if (changeImageBtn) {
        changeImageBtn.addEventListener("click", () => {
          imageInput.value = ""
          imageUploadPlaceholder.classList.remove("hidden")
          imagePreviewContainer.classList.add("hidden")
          imageInput.click()
        })
      }
    }
  
    // Handle form submission
    if (createPostForm && submitPostBtn) {
      createPostForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        // Disable submit button and show loading state
        submitPostBtn.disabled = true
        submitPostBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...'
  
        // Get form data
        const formData = new FormData(this)
        const title = formData.get("title")
        const category = formData.get("category")
        const content = formData.get("content")
        const image = imagePreview.src
  
        // Create new post object
        const newPost = {
          id: Date.now().toString(),
          title: title,
          category: category,
          content: content,
          image: image,
          author: {
            name: currentUser.username,
            avatar: currentUser.avatar,
          },
          likes: 0,
          comments: 0,
          createdAt: "Just now",
        }
  
        // Get existing posts or create empty array
        const existingPosts = JSON.parse(localStorage.getItem("blockSharePosts") || "[]")
  
        // Add new post to beginning of array
        existingPosts.unshift(newPost)
  
        // Save updated posts array
        localStorage.setItem("blockSharePosts", JSON.stringify(existingPosts))
  
        // Show success notification
        showNotification("Post created successfully!", "success")
  
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1500)
      })
    }
  
    // Drag and drop functionality
    const dropArea = document.querySelector(".image-upload-container")
    if (dropArea && imageInput && imagePreview) {
      ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, preventDefaults, false)
      })
  
      function preventDefaults(e) {
        e.preventDefault()
        e.stopPropagation()
      }
      ;["dragenter", "dragover"].forEach((eventName) => {
        dropArea.addEventListener(eventName, highlight, false)
      })
      ;["dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, unhighlight, false)
      })
  
      function highlight() {
        dropArea.classList.add("highlight")
      }
  
      function unhighlight() {
        dropArea.classList.remove("highlight")
      }
  
      dropArea.addEventListener("drop", handleDrop, false)
  
      function handleDrop(e) {
        const dt = e.dataTransfer
        const file = dt.files[0]
  
        if (file && file.type.startsWith("image/")) {
          imageInput.files = dt.files
          const reader = new FileReader()
          reader.onload = (e) => {
            imagePreview.src = e.target.result
            imageUploadPlaceholder.classList.add("hidden")
            imagePreviewContainer.classList.remove("hidden")
          }
          reader.readAsDataURL(file)
        }
      }
    }
  
    // Function to show notification
    function showNotification(message, type = "info") {
      // Check if notification container exists, create if not
      let notificationContainer = document.querySelector(".notification-container")
      if (!notificationContainer) {
        notificationContainer = document.createElement("div")
        notificationContainer.className = "notification-container"
        document.body.appendChild(notificationContainer)
      }
  
      // Create notification element
      const notification = document.createElement("div")
      notification.className = `notification notification-${type} block-appear`
      notification.textContent = message
  
      // Add close button
      const closeBtn = document.createElement("button")
      closeBtn.className = "notification-close"
      closeBtn.innerHTML = "&times;"
      closeBtn.addEventListener("click", () => {
        notification.remove()
      })
      notification.appendChild(closeBtn)
  
      // Add to container
      notificationContainer.appendChild(notification)
  
      // Auto-remove after 5 seconds
      setTimeout(() => {
        notification.classList.add("notification-hide")
        setTimeout(() => {
          notification.remove()
        }, 300)
      }, 5000)
    }
  })
  
  