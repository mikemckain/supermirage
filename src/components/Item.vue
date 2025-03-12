<template>
  <div>
    <video
      ref="videoSquare"
      :class="['item video', { videoMuted: videoMuted }, { loading: !loaded && !loadError }]"
      v-if="videoItem"
      muted
      @mouseleave="muteAudio"
      @click="toggleAudio"
      @error="handleVideoError"
      :src="item.url"
      preload="auto"
      loading="lazy"
      fetchpriority="high"
      loop
      autoplay
      playsinline
    ></video>
    <!-- Show fallback for video load errors -->
    <div v-if="videoItem && loadError" class="error-fallback">
      <div class="loading-indicator">Media unavailable</div>
    </div>
    
    <div
      v-if="photoItem"
      @click="showLightbox()"
      :class="[{ lightboxWrapper: lightbox }]"
    >
      <img 
        :class="['image-item', { lightbox: lightbox, 'opacity-0': !imageLoaded && !imageError }]" 
        :src="item.url"
        @load="onImageLoad"
        @error="handleImageError"
      />
      <!-- Show fallback for image load errors -->
      <div v-if="imageError" class="error-fallback">
        <div class="loading-indicator">Image unavailable</div>
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
    };
  },
  props: {
    item: Object,
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
    onImageLoad() {
      this.imageLoaded = true;
      this.imageError = false;
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
    },
    handleImageError() {
      this.imageError = true;
      this.imageLoaded = false;
      console.error('Image failed to load:', this.item.url);
    },
    handleVideoError() {
      this.loadError = true;
      this.loaded = false;
      console.error('Video failed to load:', this.item.url);
    },
    // Attempt to reload media if it initially fails
    retryLoading() {
      if (this.videoItem && this.$refs.videoSquare) {
        this.$refs.videoSquare.load();
      }
    },
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
  },
  mounted() {
    if (this.videoItem) {
      // Set timeout to handle videos that never load
      this.loadingTimeout = setTimeout(() => {
        if (!this.loaded && !this.loadError) {
          console.warn('Video load timeout:', this.item.url);
          this.loadError = true;
        }
      }, 10000); // 10 second timeout
      
      this.$refs.videoSquare.addEventListener("loadeddata", () => {
        //Video should now be loaded but we can add a second check
        if (this.$refs.videoSquare.readyState >= 3) {
          this.loaded = true;
          this.loadError = false;
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
          }
        }
      });
      
      // Stalled event handler
      this.$refs.videoSquare.addEventListener("stalled", () => {
        console.warn('Video stalled:', this.item.url);
        this.retryLoading();
      });
    }
  },
  beforeDestroy() {
    // Clear any pending timeouts
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

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/icons/videoLoading.svg");
  background-color: black;
  animation: loading 10s linear infinite alternate;

  // img {
  //   -webkit-animation: spin 4s linear infinite;
  //   -moz-animation: spin 4s linear infinite;
  //   animation: spin 4s linear infinite;
  // }
}

@keyframes loading {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 0;
  }
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

.setFixed {
  position: fixed;
  z-index: 200;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transition: 0s;
}

@media (max-width: 650px) {
  .lightbox {
    width: 92%;
  }
}

.opacity-0 {
  opacity: 0;
}

.error-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  z-index: 2;
}

.loading-indicator {
  font-family: "Telegraf", sans-serif;
  font-size: 14px;
  color: white;
  opacity: 0.7;
}
</style>
