<template>
  <div @click.native="this.largeImage = !this.largeImage">
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

<template></template>

<script>
export default {
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    toggleAudio() {
      var vid = this.$refs.video;
      vid.muted = !vid.muted;
    },
  },
};
</script>