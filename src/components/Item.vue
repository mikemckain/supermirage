<template>
  <div>
    <video
      ref="videoSquare"
      :class="['item video', { videoMuted: videoMuted }, { loading: !loaded }]"
      v-if="videoItem"
      muted
      @mouseleave="muteAudio"
      @click="toggleAudio"
      :src="item.url"
      preload="auto"
      loading="lazy"
      fetchpriority="high"
      loop
      autoplay
      playsinline
      @loadeddata="onVideoLoad"
      @error="onVideoError"
    ></video>
    <div
      v-if="photoItem"
      @click="showLightbox()"
      :class="[{ lightboxWrapper: lightbox }]"
    >
      <img 
        :class="['image-item', { lightbox: lightbox, 'opacity-0': !imageLoaded, 'loading': !imageLoaded }]" 
        :src="item.url"
        @load="onImageLoad"
        @error="onImageError"
        loading="lazy"
        fetchpriority="high"
      />
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
      videoMuted: true,
      imageLoaded: false,
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
    onVideoLoad() {
      if (this.$refs.videoSquare.readyState >= 3) {
        this.loaded = true;
        this.$emit('media-load', this.item.url);
      }
    },
    onVideoError(event) {
      console.error('Video load error:', event);
      this.$emit('media-error', this.item.url);
    },
    onImageLoad() {
      this.imageLoaded = true;
      this.$emit('media-load', this.item.url);
    },
    onImageError(event) {
      console.error('Image load error:', event);
      this.$emit('media-error', this.item.url);
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
      this.$refs.videoSquare.addEventListener("loadeddata", () => {
        //Video should now be loaded but we can add a second check
        if (this.$refs.videoSquare.readyState >= 3) {
          this.loaded = true;
        }
      });
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
  background: rgba(0, 0, 0, 0.1);
  background-image: url("../assets/icons/videoLoading.svg");
  background-size: 40px;
  background-position: center;
  background-repeat: no-repeat;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
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
</style>
