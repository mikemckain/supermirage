<template>
  <div id="home">
    <div id="header">
      <p id="title">super mirage</p>
      <a id="icon" href="https://twitter.com/michael_mckain" target="_blank">
        <img src="../assets/icons/twitter.svg" />
      </a>
    </div>
    <div class="photo-grid">
      <div class="photo-grid-item">
        <img id="photo-one" src="../assets/00000 Image.jpg" />
      </div>
      <div class="photo-grid-item cascade-items" v-for="n in 228" :key="n">
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
    // getImageUrl() {
    //   var imageNum = Math.floor(Math.random() * 228);
    //   return require("../assets/" + imageNum + " Image.jpg");
    // },
  },
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: "Telegraf";
  src: url("../assets/fonts/Telegraf-Bold.otf");
}

#header {
  position: fixed;
  top: 1vw;
  left: 1vw;
  z-index: 100;
  font-family: "Telegraf";
  font-size: 14px;

  p {
    background-color: black;
    padding: 5px;
  }

  #icon {
    float: left;
    opacity: 0.25;

    &:hover {
      opacity: 1;
    }
  }
}

// .cascade-items {
//   @for $i from 1 through 272 {
//     .photo-grid div:nth-child(#{$i}) {
//       animation-delay: #{$i * 0.5}s !important;
//     }
//   }
// }

.photo-grid {
  position: relative;

  border: 5vw solid black;
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
  border-radius: 100%;

  height: 60%;
  width: 50%;

  object-fit: cover;
}

@media (max-width: 650px) {
  #header {
    #icon {
      opacity: 0.8;

      img {
        height: 16px;
        width: 16px;
      }
    }
  }
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
