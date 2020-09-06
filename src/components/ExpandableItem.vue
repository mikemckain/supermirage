<template>
  <div @click="largeImage = !largeImage">
    <video
      class="video photo-grid-item"
      v-if="index <= NUM_VIDEOS"
      v-bind="$attrs"
      :class="{ expanded }"
      autoplay
      loop
    ></video>
    <img class="photo photo-grid-item" v-else v-bind="$attrs" :class="{ expanded }" />

    <div v-show="largeImage" id="large-image-wrapper" @click="largeImage = !largeImage">
      <img id="large-image" :src="getMediaUrl" />
    </div>
  </div>
</template>

<script>
export default {
  name: "expandable-item",
  //   inheritAttrs: false,
  data() {
    return {
      expanded: false,
      largeImage: false,
      NUM_VIDEOS: 20,
    };
  },
  props: {
    index: {
      type: Number,
    },
  },
  methods: {
    getMediaUrl() {
      if (this.index <= this.NUM_VIDEOS)
        return require("../assets/" + this.index + " Video.mp4");
      else return require("../assets/" + this.index + " Image.jpg");
    },
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

  // cursor: pointer;
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: url("../assets/icons/cursor3.png"), pointer;
}

#large-image {
  width: auto;
  height: 90%;
  z-index: 300;
}

.photo-grid-item {
  position: relative;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  cursor: url("../assets/icons/cursor2.png"), pointer;

  // -webkit-animation: fade-in 0.2s ease-out 0.3s both;
  // animation: fade-in 0.2s ease-out 0.3s both;
}

.photo-grid-item::before {
  content: "";
  display: block;
  padding-top: 100%;
}
</style>