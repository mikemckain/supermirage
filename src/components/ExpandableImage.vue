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
</style>