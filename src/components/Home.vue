<template>
  <div id="home">
    <h1 id="title">super mirage</h1>
    <div class="photo-grid">
      <div class="photo-grid-item">
        <img id="photo-one" src="../assets/00000 Image.jpg" />
      </div>
      <div class="photo-grid-item cascade-items" v-for="n in 272" :key="n">
        <img class="photo" :src="getImageUrl(n)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    getImageUrl(n) {
      return require("../assets/" + n + " Image.jpg");
    },
  },
};
</script>

<style scoped lang="scss">
/* @font-face {
  font-family: "Caledo";
  src: url("../assets/fonts/Caledo_bold.otf");
}
@font-face {
  font-family: "Half";
  src: url("../assets/fonts/Half-Regular.otf");
}
@font-face {
  font-family: "Panamera-Bold";
  src: url("../assets/fonts/Panamera-Bold.otf");
}
@font-face {
  font-family: "Panamera-Regular";
  src: url("../assets/fonts/Panamera-Regular.otf");
} */
@font-face {
  font-family: "Telegraf";
  src: url("../assets/fonts/Telegraf-Bold.otf");
}
h1 {
  font-family: "Telegraf";
  font-size: 12px;
  border: 25px solid black;
  text-align: left;

  top: 0;
  left: 0;
}

.cascade-items {
  @for $i from 1 through 115 {
    .photo-grid div:nth-child(#{$i}) {
      animation-delay: #{$i * 0.5}s !important;
    }
  }
}

.photo-grid {
  position: relative;

  border: 25px solid black;
  box-sizing: border-box;

  display: grid;
  grid-auto-flow: row;
  grid-gap: 4px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(auto, auto);
}

.photo {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  object-fit: cover;
}

.photo-grid-item {
  position: relative;

  -webkit-animation: fade-in 1s ease-out 0.3s both;
  animation: fade-in 1s ease-out 0.3s both;
}

.photo-grid-item::before {
  content: "";
  display: block;
  padding-top: 100%;
}

#photo-one {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 40px solid black;
  border-radius: 100%;

  height: 50%;
  width: 50%;

  object-fit: cover;
}

@keyframes fade-in {
  0% {
    -webkit-transform: translateY(5px);
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}
@-webkit-keyframes fade-in {
  0% {
    -webkit-transform: translateY(5px);
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
