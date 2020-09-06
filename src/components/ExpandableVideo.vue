<template>
  <video v-bind="$attrs" :class="{ expanded }" autoplay loop></video>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.video {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  object-fit: cover;
}
</style>