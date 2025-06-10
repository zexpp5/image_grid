// ==UserScript==
// @name         Pinterest-Style Image Layout with Popup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reorganize images larger than 320x180 into a Pinterest-style layout with popup preview
// @author       Your name
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        // Add domains to block here (without http:// or https://)
        blockedSites: [
            'x.com',
            'github.com',
            'taobao.com'
        ]
    };

    // Check if current site is blocked
    function isSiteBlocked() {
        const currentHost = window.location.hostname;
        return config.blockedSites.some(blockedSite =>
            currentHost === blockedSite || currentHost.endsWith('.' + blockedSite)
        );
    }

    // If site is blocked, don't run the script
    if (isSiteBlocked()) {
        return;
    }

    // Create and inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .pinterest-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            z-index: 9999;
            overflow-y: auto;
            display: none;
        }

        .pinterest-grid {
            column-count: 4;
            column-gap: 15px;
            padding: 15px;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
        }

        @media (min-width: 1920px) {
            .pinterest-grid {
                column-count: 8;
                max-width: 95%;
            }
        }

        @media (min-width: 1600px) and (max-width: 1919px) {
            .pinterest-grid {
                column-count: 6;
                max-width: 95%;
            }
        }

        @media (max-width: 1200px) {
            .pinterest-grid {
                column-count: 3;
                max-width: 95%;
            }
        }

        @media (max-width: 800px) {
            .pinterest-grid {
                column-count: 2;
                max-width: 95%;
            }
        }

        @media (max-width: 400px) {
            .pinterest-grid {
                column-count: 1;
                max-width: 95%;
            }
        }

        .pinterest-item {
            break-inside: avoid;
            margin-bottom: 15px;
            position: relative;
        }

        .pinterest-item img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .pinterest-item img:hover {
            transform: scale(1.02);
        }

        .close-button {
            position: fixed;
            bottom: 200px;
            right: 10px;
            background: rgba(255, 68, 68, 0.8);
            color: white;
            border: none;
            padding: 10px 10px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10000;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
        }

        .close-button:hover {
            transform: scale(1.2);
            background: rgba(255, 68, 68, 0.9);
        }

        .toggle-button {
            position: fixed;
            bottom: 200px;
            right: 10px;
            background: rgba(33, 150, 243, 0.8);
            color: white;
            border: none;
            padding: 10px 10px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9998;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
        }

        .toggle-button:hover {
            transform: scale(1.2);
            background: rgba(33, 150, 243, 0.9);
        }

        .menu-buttons {
            position: fixed;
            bottom: 200px;
            right: 10px;
            z-index: 9997;
            display: none;
            width: 0;
            height: 0;
        }

        .toggle-button:hover + .menu-buttons {
            display: block;
        }

        .menu-button {
            position: absolute;
            width: 30px;
            height: 30px;
            background: rgba(136, 136, 136, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        }

        .menu-button:hover {
            transform: scale(1.2);
            background: rgba(170, 170, 170, 0.8);
        }

        /* Position buttons in an arc */
        .menu-button:nth-child(1) { transform: translate(-65px, -94px); }
        .menu-button:nth-child(2) { transform: translate(-85px, -54px); }
        .menu-button:nth-child(3) { transform: translate(-85px, -14px); }
        .menu-button:nth-child(4) { transform: translate(-65px, 26px); }

        /* Hover states with arc positions */
        .menu-button:nth-child(1):hover { transform: translate(-65px, -94px) scale(1.2); }
        .menu-button:nth-child(2):hover { transform: translate(-85px, -54px) scale(1.2); }
        .menu-button:nth-child(3):hover { transform: translate(-85px, -14px) scale(1.2); }
        .menu-button:nth-child(4):hover { transform: translate(-65px, 26px) scale(1.2); }

        .image-modal {
            display: none;
            position: fixed;
            z-index: 10001;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            cursor: pointer;
            padding: 0;
        }

        .modal-content {
            margin: 0 auto;
            display: block;
            max-width: 95%;
            max-height: 98vh;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 12px;
            object-fit: contain;
        }

        .modal-content.vertical {
            max-width: none;
            max-height: 100vh;
            height: 100vh;
            width: auto;
            top: 0;
            transform: translateX(-50%);
            border-radius: 0;
        }

        .thumbnail-sidebar {
            position: fixed;
            right: 0;
            top: 0;
            width: 75px;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            overflow-y: scroll;
            padding: 5px;
            scrollbar-width: thin;
            scroll-behavior: auto;
        }

        .thumbnail-container {
            padding: 50vh 0;
        }

        .thumbnail {
            width: 100%;
            height: auto;
            margin-bottom: 5px;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
            border-radius: 8px;
        }

        .thumbnail.active {
            opacity: 1;
            border: 2px solid #fff;
            border-radius: 8px;
        }

        .image-count {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            z-index: 10000;
        }
    `;
    document.head.appendChild(style);

    // Create elements
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'IMG';
    toggleButton.className = 'toggle-button';
    document.body.appendChild(toggleButton);

    // Create menu buttons container
    const menuButtons = document.createElement('div');
    menuButtons.className = 'menu-buttons';
    document.body.appendChild(menuButtons);

    // Create menu buttons
    for (let i = 1; i <= 4; i++) {
        const menuButton = document.createElement('button');
        menuButton.textContent = i.toString();
        menuButton.className = 'menu-button';
        menuButtons.appendChild(menuButton);
    }

    const overlay = document.createElement('div');
    overlay.className = 'pinterest-overlay';
    document.body.appendChild(overlay);

    const closeButton = document.createElement('button');
    closeButton.textContent = ' X ';
    closeButton.className = 'close-button';
    overlay.appendChild(closeButton);

    const imageCount = document.createElement('div');
    imageCount.className = 'image-count';
    overlay.appendChild(imageCount);

    const grid = document.createElement('div');
    grid.className = 'pinterest-grid';
    overlay.appendChild(grid);

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <img class="modal-content">
        <div class="thumbnail-sidebar"></div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('.modal-content');
    const thumbnailSidebar = modal.querySelector('.thumbnail-sidebar');

    // Function to collect images
    function collectImages() {
        return Array.from(document.getElementsByTagName('img'))
            .filter(img => {
                // Check if the image has a valid source
                if (!img.src) return false;

                // Get the natural dimensions if available, otherwise use offset dimensions
                const width = img.naturalWidth || img.offsetWidth;
                const height = img.naturalHeight || img.offsetHeight;

                // Check if the image meets size requirements
                const meetsSizeRequirements = width >= 240 && height >= 140;

                // Check if the image is not already in our grid or modal
                const notInOurElements = !img.closest('.pinterest-grid') && !img.closest('.image-modal');

                // Check if the image is visible
                const isVisible = img.offsetParent !== null;

                return meetsSizeRequirements && notInOurElements && isVisible;
            });
    }

    // Function to show modal with specific image
    function showModal(clickedImg) {
        const images = collectImages();
        modal.style.display = 'block';
        modalImg.src = clickedImg.src;

        // Add load event to handle image dimensions
        modalImg.onload = function() {
            if (this.naturalHeight > this.naturalWidth) {
                this.classList.add('vertical');
            } else {
                this.classList.remove('vertical');
            }
        };

        updateThumbnails(images, clickedImg.src);

        // Add mousewheel event listener
        const handleWheel = (e) => {
            e.preventDefault();
            const direction = e.deltaY > 0 ? 1 : -1;
            navigateImages(direction, images);
        };

        modal.addEventListener('wheel', handleWheel);

        // Remove wheel event listener when modal closes
        const cleanup = () => {
            modal.removeEventListener('wheel', handleWheel);
            modal.removeEventListener('click', cleanup);
        };
        modal.addEventListener('click', cleanup);
    }

    // Initialize image listeners
    function initializeImageListeners() {
        const images = collectImages();
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showModal(img);
            });
        });
    }

    // Call after page loads
    setTimeout(initializeImageListeners, 1000);  // Wait for images to load

    // Modify the displayImages function
    function displayImages() {
        grid.innerHTML = '';
        const images = collectImages();
        imageCount.textContent = `Found ${images.length} images`;

        images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'pinterest-item';

            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;

            newImg.addEventListener('click', (e) => {
                e.stopPropagation();
                showModal(img);
            });

            item.appendChild(newImg);
            grid.appendChild(item);
        });

        overlay.style.display = 'block';
    }

    // Function to update thumbnails
    function updateThumbnails(images, currentSrc) {
        thumbnailSidebar.innerHTML = '<div class="thumbnail-container"></div>';
        const container = thumbnailSidebar.querySelector('.thumbnail-container');

        images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img.src;
            thumb.className = 'thumbnail' + (img.src === currentSrc ? ' active' : '');
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                modalImg.src = img.src;
                updateActiveThumbnail(img.src);
                centerActiveThumbnail();
            });
            container.appendChild(thumb);
        });

        // Initial centering
        centerActiveThumbnail();
    }

    // New function to update active thumbnail
    function updateActiveThumbnail(currentSrc) {
        thumbnailSidebar.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnailSidebar.querySelector(`[src="${currentSrc}"]`).classList.add('active');
    }

    // New function to handle image navigation
    function navigateImages(direction, images) {
        const currentIndex = images.findIndex(img => img.src === modalImg.src);
        let newIndex = currentIndex + direction;

        if (newIndex >= images.length) {
            newIndex = 0;
            thumbnailSidebar.scrollTop = 0;
        }
        if (newIndex < 0) {
            newIndex = images.length - 1;
            thumbnailSidebar.scrollTop = thumbnailSidebar.scrollHeight;
        }

        modalImg.src = images[newIndex].src;
        updateActiveThumbnail(images[newIndex].src);
        centerActiveThumbnail();
    }

    // Add new function to center the active thumbnail
    function centerActiveThumbnail() {
        const activeThumb = thumbnailSidebar.querySelector('.thumbnail.active');
        if (activeThumb) {
            activeThumb.scrollIntoView({
                block: 'center',
                behavior: 'auto'
            });
        }
    }

    // Event listeners
    toggleButton.addEventListener('click', displayImages);
    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // Close modal when clicking outside image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close overlay and modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlay.style.display = 'none';
            modal.style.display = 'none';
        }
    });
})();
