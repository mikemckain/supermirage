<template>
  <video v-bind="$attrs" :class="{ expanded }" autoplay loop></video>
</template>

<script>
export default {
  data() {
    return {
      expanded: false,
    };
  },
};
</script>

<style scoped lang="scss">
</style>