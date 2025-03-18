document.addEventListener("DOMContentLoaded", function() {
  console.log("Create post page loaded");
  
  // Wait for Firebase to initialize
  setTimeout(() => {
    console.log("Checking Firebase initialization...");
    
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
    
    console.log("Firebase initialized successfully");
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("blockShareUser"));
    if (!currentUser) {
      showNotification("Please log in to create a post", "error");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      return;
    }
    
    console.log("User is logged in:", currentUser.username);

    // Image upload functionality
    const imageInput = document.getElementById("image");
    const selectImageBtn = document.getElementById("selectImageBtn");
    const changeImageBtn = document.getElementById("changeImageBtn");
    const imageUploadPlaceholder = document.getElementById("imageUploadPlaceholder");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const imageUploadContainer = document.getElementById("imageUploadContainer");

    // Fix: Properly handle the Select Image button click
    if (selectImageBtn) {
      selectImageBtn.addEventListener("click", function(e) {
        e.preventDefault(); // Prevent form submission
        console.log("Select Image button clicked");
        imageInput.click(); // Trigger file input click
      });
    }

    if (changeImageBtn) {
      changeImageBtn.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Change Image button clicked");
        imageInput.click();
      });
    }

    // Handle file selection
    if (imageInput) {
      imageInput.addEventListener("change", function() {
        console.log("File input changed");
        if (this.files && this.files[0]) {
          const file = this.files[0];
          console.log("File selected:", file.name, file.type, file.size);
          
          // Check file type
          if (!file.type.match('image.*')) {
            showNotification("Please select an image file", "error");
            return;
          }
          
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            showNotification("Image size should be less than 5MB", "error");
            return;
          }
          
          const reader = new FileReader();
          
          reader.onload = function(e) {
            console.log("File read successfully");
            // Show preview
            imagePreview.src = e.target.result;
            imageUploadPlaceholder.classList.add("hidden");
            imagePreviewContainer.classList.remove("hidden");
          };
          
          reader.readAsDataURL(file);
        }
      });
    }

    // Handle drag and drop
    if (imageUploadContainer) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        imageUploadContainer.addEventListener(eventName, preventDefaults, false);
      });

      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      ['dragenter', 'dragover'].forEach(eventName => {
        imageUploadContainer.addEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        imageUploadContainer.addEventListener(eventName, unhighlight, false);
      });

      function highlight() {
        imageUploadContainer.classList.add('highlight');
      }

      function unhighlight() {
        imageUploadContainer.classList.remove('highlight');
      }

      imageUploadContainer.addEventListener('drop', handleDrop, false);

      function handleDrop(e) {
        console.log("File dropped");
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && file.type.match('image.*')) {
          console.log("Image file dropped:", file.name);
          imageInput.files = dt.files;
          
          const reader = new FileReader();
          
          reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imageUploadPlaceholder.classList.add("hidden");
            imagePreviewContainer.classList.remove("hidden");
          };
          
          reader.readAsDataURL(file);
        } else {
          showNotification("Please drop an image file", "error");
        }
      }
    }

    // Form submission
    const createPostForm = document.getElementById("createPostForm");
    const submitPostBtn = document.getElementById("submitPostBtn");

    if (createPostForm) {
      console.log("Form found, adding submit event listener");
      
      createPostForm.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("Form submitted");
        
        // Disable submit button to prevent multiple submissions
        if (submitPostBtn) {
          submitPostBtn.disabled = true;
          submitPostBtn.textContent = "Sharing...";
        }
        
        // Get form data
        const title = document.getElementById("title").value;
        const category = document.getElementById("category").value;
        const content = document.getElementById("content").value;
        
        console.log("Form data:", { title, category, content });
        
        // Check if image is selected
        if (!imageInput.files || !imageInput.files[0]) {
          console.error("No image selected");
          showNotification("Please select an image", "error");
          submitPostBtn.disabled = false;
          submitPostBtn.textContent = "Share with Community";
          return;
        }
        
        const imageFile = imageInput.files[0];
        console.log("Image file:", imageFile.name, imageFile.type, imageFile.size);
        
        // For demo purposes, we'll just use the file directly
        // In a real app, you would upload this to Firebase Storage
        const reader = new FileReader();
        
        reader.onload = function(e) {
          console.log("Image read successfully");
          const imageUrl = e.target.result;
          
          // Create post object
          const post = {
            title: title,
            category: category,
            content: content,
            image: imageUrl,
            author: {
              id: currentUser.id,
              name: currentUser.username,
              avatar: currentUser.avatar
            },
            likes: 0,
            comments: 0,
            createdAt: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            timestamp: new Date().getTime()
          };
          
          console.log("Post object created, saving to Firebase...");
          
          // Save to Firebase
          db.collection("posts").add(post)
            .then((docRef) => {
              console.log("Post created with ID: ", docRef.id);
              showNotification("Post created successfully!", "success");
              
              // Redirect to home page
              setTimeout(() => {
                window.location.href = "index.html";
              }, 1500);
            })
            .catch((error) => {
              console.error("Error adding post: ", error);
              showNotification("Error creating post: " + error.message, "error");
              
              // Re-enable submit button
              submitPostBtn.disabled = false;
              submitPostBtn.textContent = "Share with Community";
            });
        };
        
        reader.onerror = function(error) {
          console.error("Error reading file:", error);
          showNotification("Error reading image file. Please try again.", "error");
          submitPostBtn.disabled = false;
          submitPostBtn.textContent = "Share with Community";
        };
        
        console.log("Reading image file...");
        reader.readAsDataURL(imageFile);
      });
      
      // Also add a direct click handler for the submit button as a fallback
      if (submitPostBtn) {
        submitPostBtn.addEventListener("click", function(e) {
          console.log("Submit button clicked directly");
          // The form's submit event should handle this, but just in case
          if (!e.target.disabled) {
            createPostForm.dispatchEvent(new Event('submit'));
          }
        });
      }
    } else {
      console.error("Form not found!");
    }
  }, 1000); // Increased timeout to ensure Firebase is fully initialized
});

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