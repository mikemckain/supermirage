<template>
  <div id="home">
    <!-- <div class="loading" v-if="!loaded">
      <img src="../assets/icons/loading.png" />
    </div>-->
    <div id="header">
      <p :class="['title', {titleFun: showInfo} ]" @mouseenter="info" @mouseleave="info">supermirage</p>
      <div class="info" v-show="showInfo">
        <a href="https://slate.host" target="_blank">hosting on IPFS w/ slate</a>
        <br />

        <a>shot w/ iPhone, mostly</a>
      </div>
      <div class="social" v-show="!showInfo">
        <a href="https://twitter.com/michael_mckain" target="_blank">
          <img src="../assets/icons/twitter.svg" />
        </a>
        <a href="https://soundcloud.com/crowncomfort" target="_blank">
          <img src="../assets/icons/soundcloud.svg" />
        </a>
      </div>
      <div id="control-panel">
        <div class="control">
          <p class="shuffle-text" v-show="shuffleText">new grid</p>
          <img
            class="shuffle-icon"
            @mouseenter="showShuffleText"
            @mouseleave="showShuffleText"
            src="../assets/icons/spiral.svg"
            @click="shuffleItems()"
          />
        </div>
      </div>
    </div>

    <div class="grid cascade-items">
      <div class="item item-one">
        <img id="item-one" src="../assets/00000 Image.jpg" />
      </div>
      <div class="item" v-for="item in items" :key="item.url">
        <Item :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
import Item from "./Item";

export default {
  name: "Home",
  data() {
    return {
      items: [],
      item: {},
      mobileItems: [],
      shuffleText: false,
      videoText: false,
      loaded: false,
      showInfo: false,
      videosOn: true,
      removedItems: [],
    };
  },

  components: {
    Item,
  },
  methods: {
    info() {
      this.showInfo = !this.showInfo;
    },
    removeVideos() {
      for (var i = this.items.length - 1; i >= 0; --i) {
        this.backup = this.items;
        if (this.items[i].type == "video/mp4") {
          this.removedItems = this.items.splice(i, 1);
          // this.items.splice(i, 1);
          this.videosOn = false;
        }
      }
    },
    initLoad() {
      this.loaded = true;
    },
    shuffleItems() {
      var items = this.items;
      var m = items.length,
        t,
        i;

      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = items[m];
        items[m] = items[i];
        items[i] = t;
      }

      this.items = [];
      this.items = items;
    },
    showShuffleText() {
      this.shuffleText = !this.shuffleText;
    },
  },
  async beforeMount() {
    //slate API call
    const response = await fetch("https://slate.host/api/v1/get-slate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: your API key
        Authorization: "Basic SLAd2700d52-1e9a-4f18-9ad7-dfb046f3b603TE",
      },
      body: JSON.stringify({
        data: {
          // NOTE: your slate ID
          id: "f3597efa-42ee-4d88-a12a-05e8e8cde21d",
        },
      }),
    });
    const json = await response.json();
    // console.log(json);
    this.items = json.slate.data.objects;
    this.shuffleItems();

    if (this.$isMobile) {
      this.removeVideos();
    }
  },
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: "Telegraf-bold";
  src: url("../assets/fonts/Telegraf-Bold.otf");
}

@font-face {
  font-family: "Telegraf";
  src: url("../assets/fonts/Telegraf-Regular.otf");
}

#home {
  cursor: url("../assets/icons/cursor1.png"), pointer;
}

.title {
  cursor: url("../assets/icons/heart.png"), pointer;
  margin: 5px 0px 0px 0px;
  transition: 1s;
  width: 100%;

  &:hover {
    color: rgb(255, 234, 151);
    animation: hue-rotate 4s linear infinite;
  }
}

// .titleFun {
//   // border-bottom: 1px solid white;
// }

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;

  img {
    -webkit-animation: spin 4s linear infinite;
    -moz-animation: spin 4s linear infinite;
    animation: spin 4s linear infinite;
  }
}

.info {
  // position: fixed;
  width: 100%;
  background-color: black;
  color: white;
  // border: 1px solid white;
  text-decoration: none;
  font-family: Telegraf-Bold, sans-serif;
  font-weight: 200;
  font-size: 14px;
  line-height: 80%;
  // padding: 24px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px 5px 5px 0px;

  a {
    color: white !important;
    text-decoration: none !important;

    cursor: url("../assets/icons/cursor2.png"), pointer !important;
    &:hover {
      color: rgb(255, 229, 35);
    }
    margin: 0;
  }

  p {
    margin: 0;
  }

  img {
    height: 35px;
    margin: 0px 15px;
    cursor: url("../assets/icons/cursor2.png"), pointer !important;
  }
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

#header {
  position: fixed;
  top: 1vw;
  left: 1vw;
  z-index: 100;
  font-family: "Telegraf-Bold";
  font-size: 14px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 0px 10px 5px 0px;
  text-align: left;

  p {
    background-color: black;
    padding: 5px 3px 5px 0px;
  }

  a:visited {
    text-decoration: none !important;
  }
}

.social {
  display: flex;
  flex-direction: column;
  float: left;
  margin-top: 10px;
  cursor: url("../assets/icons/cursor2.png"), pointer;

  a {
    cursor: url("../assets/icons/cursor2.png"), pointer;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }

  img {
    width: 25px;
  }
}

#control-panel {
  position: fixed;
  top: 1vw;
  right: 1vw;
  float: right;
  display: flex;
  flex-direction: column;
  height: 50px;

  p {
    margin: 0;
  }

  .shuffle-icon {
    &:hover {
      animation: spin 2s linear infinite;
    }
  }
}

.control {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  cursor: url("../assets/icons/cursor2.png"), pointer;

  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
  p {
    padding-left: 5px !important;
  }
}

.grid {
  position: relative;

  border: 5vw solid black;
  box-sizing: border-box;

  display: grid;
  grid-auto-flow: row;
  grid-gap: 4px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(auto, auto);
}

.item {
  position: relative;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  cursor: url("../assets/icons/cursor2.png"), pointer;

  // -webkit-animation: fade-in 0.5s ease-in 0.3s both;
  // animation: fade-in 0.5s ease-in 0.3s both;
}

.item::before {
  content: "";
  display: block;
  padding-top: 100%;
}

#item-one {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 100%;

  height: 60%;
  width: 50%;

  object-fit: cover;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  cursor: url("../assets/icons/smile.png"), pointer !important;
}

.item-one {
  cursor: url("../assets/icons/smile.png"), pointer !important;
}

.cascade-items {
  @for $i from 1 through 15 {
    :nth-child(#{$i}n) {
      animation-delay: #{$i * 0.15}s !important;
    }
  }
}

//Mobile
@media (max-width: 650px) {
  #header {
    top: 0;
    left: 0;
    padding: 0;

    p {
      margin: 0;
      font-size: 10px;
    }

    img {
      opacity: 1;
      height: 12px;
      width: 12px;
      padding: 5px;
      background-color: black;
    }
  }
  .social {
    margin-top: 0;
    flex-direction: row;
  }
  .grid {
    border: 0px solid black;
    grid-gap: 1px;
  }

  #item-one {
    height: 45%;
    width: 35%;
  }

  #large-image {
    height: auto;
    width: 90%;
  }
}

//Transition In
@keyframes fade-in {
  0% {
    -webkit-transform: translateY(5px);
    transform: translateY(15px);
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

//Shuffle Button
@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-moz-keyframes hue-rotate {
  0% {
    -webkit-filter: hue-rotate(0deg);
  }

  50% {
    -webkit-filter: hue-rotate(180deg);
  }

  100% {
    -webkit-filter: hue-rotate(0deg);
  }
}

@-webkit-keyframes hue-rotate {
  0% {
    -webkit-filter: hue-rotate(0deg);
  }

  50% {
    -webkit-filter: hue-rotate(180deg);
  }

  100% {
    -webkit-filter: hue-rotate(0deg);
  }
}

@keyframes hue-rotate {
  0% {
    filter: hue-rotate(0deg);
  }

  50% {
    filter: hue-rotate(180deg);
  }

  100% {
    filter: hue-rotate(0deg);
  }
}
</style>
