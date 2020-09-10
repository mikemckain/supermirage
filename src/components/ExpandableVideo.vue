<template>
  <video
    ref="video"
    @mouseenter="toggleAudio"
    @mouseleave="toggleAudio"
    v-bind="$attrs"
    :class="{ expanded }"
    autoplay
    loop
    muted
  ></video>
</template>

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

<style scoped lang="scss">
</style>