<template>
  <div
    class="item-container"
    :style="{ width, height }"
    :class="{ video: videoItem }"
  >
    <!-- Handle images -->
    <div v-if="!videoItem">
      <img
        v-if="(!hasKnownMobileIssue && !fallbackSrc) || !$isMobile"
        :src="fallbackSrc || item.url"
        alt="Image"
        class="item-image"
        @load="imageLoaded"
        @error="handleImageError"
      />
      <img
        v-else
        :src="fallbackSrc || alternateImageSrc"
        alt="Image"
        class="item-image"
        @load="imageLoaded"
        @error="handleImageError"
      />
    </div>

    <!-- Handle videos - simple version for desktop only -->
    <div v-else>
      <video
        :src="item.url"
        class="item-video"
        controls
        playsinline
        muted
        loop
        @loadeddata="videoLoaded"
        @error="handleVideoError"
      ></video>
      
      <!-- Fallback for failed videos -->
      <div v-if="loadError" class="media-unavailable">
        <p>Video unavailable</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lightbox: false,
      videoItem: false,
      photoItem: false,
      setFixed: false,
      loaded: false,
      loadError: false,
      videoMuted: true,
      imageLoaded: false,
      imageError: false,
      loadingTimeout: null,
      hasMobileVersion: false,
      mobileVersionUrl: '',
      fallbackSrc: null,     // For storing fallback image URL
      retryAttempted: false, // Flag to track retry attempts
      videoRetryAttempted: false, // Flag to track video retry attempts
      videoManuallyLoaded: false, // Flag to track if video was manually loaded
      videoFailed: false,
    };
  },
  props: {
    item: Object,
  },
  computed: {
    hasKnownMobileIssue() {
      return this.$isMobile && this.item && this.item._mobileCompatibilityIssue;
    },
    isDebugMode() {
      return typeof window !== 'undefined' && window.location.search.includes('debug=true');
    },
    alternateImageSrc() {
      // Use alternate URL provided by the Home component if available
      if (this.item && this.item._alternateUrl) {
        return this.item._alternateUrl;
      }
      // Otherwise, use the mobile version generated in this component
      return this.mobileVersionUrl;
    },
    isBackblazeVideo() {
      if (!this.item) return false;
      const url = this.item.url;
      return this.videoItem && url && url.includes('f004.backblazeb2.com');
    },
    optimizedVideoUrl() {
      if (!this.item) return '';
      
      const url = this.item.url;
      
      // For Backblaze videos, we need a more aggressive approach
      if (this.isBackblazeVideo) {
        // For MP4 videos hosted on Backblaze
        if (url.includes('.mp4')) {
          // Extract the video filename for potential manipulation
          const videoName = url.split('/').pop();
          const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
          
          // Check if it's in the 2022/videos directory pattern
          if (url.includes('2022/videos/') || url.includes('2023/videos/')) {
            // For mobile devices, try proxy or lower quality version if available
            if (this.$isMobile) {
              // First attempt - try a specific mobile version if it exists
              // This assumes a pattern where lower quality versions might have '-mobile' suffix
              const mobileVersion = `${baseUrl}${videoName.replace('.mp4', '-mobile.mp4')}`;
              
              // Add a caching directive to CDN if possible
              return `${mobileVersion}?mobile=true&cache=true`;
            } else {
              // For desktop, use original but with caching hint
              return `${url}?desktop=true&cache=true`;
            }
          }
        }
        
        // For all other Backblaze videos, add cache control parameters
        return url.includes('?') ? `${url}&cache=true` : `${url}?cache=true`;
      }
      
      return url;
    },
    videoThumbnailUrl() {
      if (!this.item) return '';
      
      const url = this.item.url;
      
      // Check if we can generate a thumbnail from the video
      if (this.isBackblazeVideo && url.includes('.mp4')) {
        // Try multiple potential thumbnail formats
        const videoName = url.split('/').pop();
        const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
        
        // Try the most common thumbnail naming patterns
        const patterns = [
          videoName.replace('.mp4', '-thumb.jpg'),
          videoName.replace('.mp4', '.jpg'),
          videoName.replace('.mp4', '-preview.jpg'),
          videoName.replace('.mp4', '_poster.jpg')
        ];
        
        // Use the first thumbnail in our list - in production this would check if files exist
        return `${baseUrl}${patterns[0]}`;
      }
      
      // Return empty for non-Backblaze videos as fallback
      return '';
    },
    shouldUseDynamicImport() {
      // For very large videos, we might want to use a different loading strategy
      return this.$isMobile && this.isBackblazeVideo;
    }
  },
  methods: {
    enableAudio() {
      var vid = this.$refs.videoSquare;
      vid.muted = false;
      this.videoMuted = false;
    },
    muteAudio() {
      var vid = this.$refs.videoSquare;
      vid.muted = true;
      this.videoMuted = true;
    },
    toggleAudio() {
      var vid = this.$refs.videoSquare;
      vid.muted = !vid.muted;
      this.videoMuted = !this.videoMuted;
    },
    showLightbox() {
      this.lightbox = !this.lightbox;
    },
    imageLoaded() {
      this.loaded = true;
      this.loadError = false;
      this.imageLoaded = true;
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
    },
    handleImageError() {
      if (this.retryAttempted) {
        this.loadError = true;
        return;
      }

      if (this.$isMobile && this.item && this.item.url.includes('f004.backblazeb2.com') && this.item.url.includes('.webp')) {
        console.log('Attempting to load JPG version for:', this.item.url);
        this.fallbackSrc = this.item.url.replace('.webp', '.jpg');
        this.retryAttempted = true;
      } else {
        this.loadError = true;
      }
    },
    handleVideoError() {
      console.error('Video failed to load:', this.item.url);
      this.loadError = true;
    },
    videoLoaded() {
      this.loaded = true;
      this.loadError = false;
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
    },
    checkForMobileVersion() {
      if (!this.$isMobile) return;
      
      const url = this.item.url;
      
      // SPECIFIC FIX FOR BACKBLAZE WebP IMAGES
      // Convert WebP from Backblaze to JPG for mobile
      if (url.includes('f004.backblazeb2.com') && url.includes('.webp')) {
        // Try to replace WebP with JPG for Backblaze images
        this.mobileVersionUrl = url.replace('.webp', '.jpg');
        if (!this.mobileVersionUrl.includes('.jpg')) {
          // If the replacement didn't work, add jpg extension
          this.mobileVersionUrl = url + '.jpg';
        }
        this.hasMobileVersion = true;
        return;
      }
      
      // For other images, just set a flag without changing URL
      this.hasMobileVersion = false;
    }
  },
  beforeMount() {
    // Helper function to check file extension
    const getFileExtension = (url) => {
      return url.split('.').pop().toLowerCase();
    };

    const extension = getFileExtension(this.item.url);
    
    this.photoItem =
      this.item.contentType === "image/jpeg" ||
      this.item.contentType === "image/png" ||
      this.item.contentType === "image/webp" ||
      extension === 'webp' ||
      extension === 'jpg' ||
      extension === 'jpeg' ||
      extension === 'png';
      
    this.videoItem = 
      !this.photoItem && (
        this.item.contentType === "video/mp4" || 
        this.item.contentType === "video/webm" ||
        extension === 'mp4' ||
        extension === 'webm'
      );
      
    // Check for mobile versions if needed
    this.checkForMobileVersion();

    // Set timeout for images on mobile
    if (this.photoItem && this.$isMobile) {
      this.loadingTimeout = setTimeout(() => {
        if (!this.imageLoaded && !this.imageError) {
          console.warn('Image load timeout on mobile:', this.item.url);
          this.handleImageError();
        }
      }, 5000); // 5 second timeout for mobile images
    }
  },
  mounted() {
    // For photos on mobile, set a shorter timeout
    if (this.photoItem && this.$isMobile) {
      this.loadingTimeout = setTimeout(() => {
        if (!this.imageLoaded && !this.imageError) {
          console.warn('Image load timeout on mobile:', this.item.url);
          this.handleImageError();
        }
      }, 5000); // 5 second timeout for mobile images
    }
  },
  beforeDestroy() {
    // Clean up any timeouts
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  },
};
</script>

<style scoped lang="scss">
.item {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  cursor: url("../assets/icons/cursor2.png"), pointer;
}

.image-item {
  object-fit: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.5s ease-in-out;
  opacity: 1;
}

.video {
  cursor: url("../assets/icons/playAudio.png"), pointer;
}

.videoMuted {
  cursor: url("../assets/icons/muteAudio.png"), pointer;
}

.lightboxWrapper {
  position: fixed;
  z-index: 400;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: url("../assets/icons/cursor3.png"), pointer;
}

.lightbox {
  position: fixed;
  max-width: 95%;
  max-height: 95%;
  z-index: 300;
  object-fit: contain;
  cursor: url("../assets/icons/cursor3.png"), pointer;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

@media (max-width: 650px) {
  .lightbox {
    width: 92%;
  }
}

.media-unavailable {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 2;
}

.item-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.item-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
