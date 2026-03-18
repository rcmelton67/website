document.addEventListener('DOMContentLoaded', function () {
  if (!document.querySelector('.mm-tribute-submit')) return;

  const form = document.getElementById('tributeForm');
  if (!form) return;

  // Preview elements
  const previewName = document.getElementById('mmPreviewName');
  const previewMeta = document.getElementById('mmPreviewMeta');
  const previewDates = document.getElementById('mmPreviewDates');
  const previewMessage = document.getElementById('mmPreviewMessage');
  const previewImage = document.getElementById('mmPreviewImage');

  // Field finder helper - tries multiple strategies
  function findFieldByLabel(searchTexts) {
    const labels = Array.from(form.querySelectorAll('label'));
    for (const label of labels) {
      const labelText = label.textContent.toLowerCase();
      for (const searchText of searchTexts) {
        if (labelText.includes(searchText.toLowerCase())) {
          const fieldId = label.getAttribute('for');
          if (fieldId) {
            const field = document.getElementById(fieldId);
            if (field) return field;
          }
        }
      }
    }
    return null;
  }

  // Find fields using multiple strategies
  const petNameField = document.getElementById('petName') || findFieldByLabel(['pet name', 'name']);
  const petTypeField = document.getElementById('petType') || findFieldByLabel(['pet type', 'type']);
  const breedField = document.getElementById('breed') || findFieldByLabel(['breed']);
  const yearsField = document.getElementById('yearsTogether') || findFieldByLabel(['years', 'life', 'together']);
  const messageField = document.getElementById('tributeStory') || findFieldByLabel(['tribute', 'message', 'story']);
  const photoField = document.getElementById('petPhoto') || findFieldByLabel(['photo', 'upload', 'image']);

  // Update preview function
  function updatePreview() {
    // Update name
    if (previewName && petNameField) {
      const name = petNameField.value.trim();
      previewName.textContent = name || "Your Pet's Name";
    }

    // Update meta (type + breed)
    if (previewMeta) {
      const type = petTypeField ? petTypeField.value.trim() : '';
      const breed = breedField ? breedField.value.trim() : '';
      let metaText = '';
      if (type && breed) {
        metaText = type + ' - ' + breed;
      } else if (type) {
        metaText = type;
      } else if (breed) {
        metaText = breed;
      } else {
        metaText = 'Type - Breed';
      }
      previewMeta.textContent = metaText;
    }

    // Update dates
    if (previewDates && yearsField) {
      const dates = yearsField.value.trim();
      previewDates.textContent = dates || 'Years of Life';
    }

    // Update message
    if (previewMessage && messageField) {
      const message = messageField.value.trim();
      if (message) {
        // Preserve line breaks and trim excessive whitespace
        const cleaned = message.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
        previewMessage.textContent = cleaned;
      } else {
        previewMessage.textContent =
          'Your tribute message will appear here as you type. Share a favorite memory, what made your pet special, or words you would like remembered.';
      }
    }
  }

  // Update image preview and adjust container size
  function updatePreviewImage() {
    if (!previewImage || !photoField) return;

    const file = photoField.files && photoField.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;

        // Wait for image to load to get dimensions
        previewImage.onload = function () {
          adjustContainerAspectRatio(previewImage);
        };
      };
      reader.readAsDataURL(file);
    } else {
      // Reset to default when no image
      resetContainerAspectRatio();
    }
  }

  // Adjust container aspect ratio based on image dimensions
  function adjustContainerAspectRatio(img) {
    const imageWrap = img.closest('.mm-preview-image-wrap');
    if (!imageWrap) return;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    if (!imgWidth || !imgHeight) return;

    // Calculate image aspect ratio
    const imageAspectRatio = imgWidth / imgHeight;

    // Constrain aspect ratio between 2/3 (portrait) and 3/2 (landscape)
    // This prevents extreme sizes that would break the layout
    const minAspectRatio = 2 / 3; // 0.667 (tall portrait)
    const maxAspectRatio = 3 / 2; // 1.5 (wide landscape)

    let targetAspectRatio = imageAspectRatio;

    // Clamp to reasonable bounds
    if (targetAspectRatio < minAspectRatio) {
      targetAspectRatio = minAspectRatio;
    } else if (targetAspectRatio > maxAspectRatio) {
      targetAspectRatio = maxAspectRatio;
    }

    // Apply the aspect ratio
    imageWrap.style.aspectRatio = `${targetAspectRatio}`;
  }

  // Reset to default aspect ratio
  function resetContainerAspectRatio() {
    const imageWrap = previewImage?.closest('.mm-preview-image-wrap');
    if (imageWrap) {
      imageWrap.style.aspectRatio = '4 / 3';
    }
  }

  // Attach event listeners
  if (petNameField) {
    petNameField.addEventListener('input', updatePreview);
    petNameField.addEventListener('change', updatePreview);
  }
  if (petTypeField) {
    petTypeField.addEventListener('change', updatePreview);
  }
  if (breedField) {
    breedField.addEventListener('input', updatePreview);
    breedField.addEventListener('change', updatePreview);
  }
  if (yearsField) {
    yearsField.addEventListener('input', updatePreview);
    yearsField.addEventListener('change', updatePreview);
  }
  if (messageField) {
    messageField.addEventListener('input', updatePreview);
    messageField.addEventListener('change', updatePreview);
  }
  if (photoField) {
    photoField.addEventListener('change', updatePreviewImage);
  }

  // Drag-to-position image interaction (XY movement)
  if (previewImage) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let posX = 50;
    let posY = 30;

    // Initialize CSS variables
    previewImage.style.setProperty('--preview-pos-x', posX + '%');
    previewImage.style.setProperty('--preview-pos-y', posY + '%');

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    // Mouse events
    previewImage.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      dragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;

      const deltaX = (e.clientX - startX) * 0.1;
      const deltaY = (e.clientY - startY) * 0.1;

      posX += deltaX;
      posY += deltaY;

      posX = clamp(posX, 10, 90);
      posY = clamp(posY, 10, 90);

      previewImage.style.setProperty('--preview-pos-x', posX + '%');
      previewImage.style.setProperty('--preview-pos-y', posY + '%');

      startX = e.clientX;
      startY = e.clientY;
    });

    // Touch events for mobile
    previewImage.addEventListener('touchstart', (e) => {
      dragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      e.preventDefault();
    });

    window.addEventListener('touchend', () => {
      dragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!dragging) return;

      const deltaX = (e.touches[0].clientX - startX) * 0.1;
      const deltaY = (e.touches[0].clientY - startY) * 0.1;

      posX += deltaX;
      posY += deltaY;

      posX = Math.min(Math.max(posX, 10), 90);
      posY = Math.min(Math.max(posY, 10), 90);

      previewImage.style.setProperty('--preview-pos-x', posX + '%');
      previewImage.style.setProperty('--preview-pos-y', posY + '%');

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      e.preventDefault();
    });
  }

  // Handle initial image load (placeholder)
  if (previewImage) {
    previewImage.addEventListener('load', function () {
      // Only adjust if it's not the placeholder SVG
      if (previewImage.src && !previewImage.src.includes('data:image/svg+xml')) {
        adjustContainerAspectRatio(previewImage);
      }
    });
  }

  // Initial update on page load
  updatePreview();
});

