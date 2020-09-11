<template>
  <div>
    <video
      ref="video"
      class="item"
      v-if="showVideoItem"
      @mouseenter="toggleAudio"
      @mouseleave="toggleAudio"
      :src="item.url"
      :class="{ expanded }"
      loop
      autoplay
      muted
    ></video>

    <img
      @click="lightbox()"
      class="iteme"
      :src="item.url"
      v-if="showPhotoItem"
      :class="{ expanded }"
    />
    <!-- <transition name="fade"> -->
    <div
      v-if="largeItem"
      :class="['large-item-wrapper', {setFixed: setFixed} ]"
      @click="largeItem = !largeItem"
    >
      <img id="large-item" :src="item.url" />
    </div>
    <!-- </transition> -->
    <!--       v-bind="$attrs" -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      expanded: false,
      largeItems: false,
      showVideoItem: false,
      showPhotoItem: false,
      setFixed: false,
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
      this.largeItem = !this.largeItem;
    },
  },
  mounted() {
    if (this.item.type == "video/mp4" && !this.$isMobile)
      this.showVideoItem = true;
    else this.showVideoItem = false;

    if (this.item.type == "image/jpeg") this.showPhotoItem = true;
    else this.showPhotoIItem = false;

    // console.log(this.item.url);
    // setTimeout(() => {
    //   this.setFixed = true;
    // }, 500);
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
}

.large-item-wrapper {
  position: fixed;
  z-index: 200;
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

#large-item {
  width: auto;
  height: 95%;
  z-index: 300;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transition: 0s;
}
</style>