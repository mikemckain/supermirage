<template>
  <div @click.native="this.largeImage = !this.largeImage">
    <video
      class="video"
      v-if="index <= NUM_VIDEOS"
      v-bind="$attrs"
      :class="{ expanded }"
      autoplay
      loop
    ></video>
    <img class="photo" v-else v-bind="$attrs" :class="{ expanded }" />

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
  mounted() {
    console.log(this.$key);
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
</style>