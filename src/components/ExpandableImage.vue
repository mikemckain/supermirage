<template>
  <img v-bind="$attrs" :class="{ expanded }" />
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
</style>