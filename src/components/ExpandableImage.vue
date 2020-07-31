<template>
  <img v-bind="$attrs" :class="{ expanded }" @click="expanded = !expanded" />
</template>

<script>
export default {
  //   inheritAttrs: false,
  data() {
    return {
      expanded: false,
    };
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

.expanded {
  z-index: 500;
  position: absolute;
  transform-origin: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: auto;
  //   opacity: 0.5;
}
</style>