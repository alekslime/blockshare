
document.addEventListener("DOMContentLoaded", () => {
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
        const postData = {
          title: formData.get("title"),
          category: formData.get("category"),
          content: formData.get("content"),
          image: imagePreview.src,
        }
  
        // Simulate API call
        console.log("Submitting post:", postData)
  
        // Simulate delay for demo purposes
        setTimeout(() => {
          // Save to localStorage for demo
          const posts = JSON.parse(localStorage.getItem("blockSharePosts") || "[]")
          const newPost = {
            id: Date.now().toString(),
            ...postData,
            author: {
              name: "SteveCreeper",
              avatar: "https://via.placeholder.com/40",
            },
            likes: 0,
            comments: 0,
            createdAt: "Just now",
          }
          posts.unshift(newPost)
          localStorage.setItem("blockSharePosts", JSON.stringify(posts))
  
          // Redirect to home page
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
  })
  
  