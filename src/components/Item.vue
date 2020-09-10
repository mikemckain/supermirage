<template>
  <div>
    <video
      ref="video"
      class="video"
      v-if="videoItem"
      @mouseenter="toggleAudio"
      @mouseleave="toggleAudio"
      v-bind="$attrs"
      :class="{ expanded }"
      loop
      autoplay
      muted
    ></video>

    <img @click="lightbox()" class="photo" v-else v-bind="$attrs" :class="{ expanded }" />

    <div v-show="largeImage" id="large-image-wrapper" @click="largeImage = !largeImage">
      <img id="large-image" :src="item.url" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expanded: false,
      largeImage: false,
      videoItem: false,
    };
  },
  props: {
    item: Object,
  },
  methods: {
    toggleAudio() {
      var vid = this.$refs.video;
      vid.muted = !vid.muted;
    },
    lightbox() {
      this.largeImage = !this.largeImage;
    },
  },
  mounted() {
    if (this.item.type == "video/mp4") {
      this.videoItem = true;
    } else {
      this.videoItem = false;
    }
  },
};
</script>

<style scoped lang="scss">
.photo {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  object-fit: cover;
}
.video {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  object-fit: cover;
}

#large-image-wrapper {
  z-index: 200;
  position: fixed;
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

#large-image {
  width: auto;
  height: 90%;
  z-index: 300;
}
</style>