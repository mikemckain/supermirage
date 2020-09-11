<template>
  <div id="home">
    <div class="loading" v-if="!loaded">
      <img src="../assets/icons/loading.png" />
    </div>
    <div id="header">
      <p id="title">super mirage</p>
      <a id="social" href="https://twitter.com/michael_mckain" target="_blank">
        <img src="../assets/icons/twitter.svg" />
      </a>
      <div id="shuffle">
        <p class="shuffle-text" v-show="shuffleText">shuffle grid</p>
        <img
          class="shuffle-icon"
          @mouseenter="showShuffleText"
          @mouseleave="showShuffleText"
          src="../assets/icons/spiral.svg"
          @click="shuffleItems()"
        />
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
      shuffleText: false,
      loaded: false,
    };
  },
  components: {
    Item,
  },
  methods: {
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
    console.log(json);
    this.items = json.slate.data.objects;
    this.shuffleItems();

    window.addEventListener("load", this.initLoad);
  },
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: "Telegraf";
  src: url("../assets/fonts/Telegraf-Bold.otf");
}

#home {
  cursor: url("../assets/icons/cursor1.png"), pointer;
}

.loading {
  position: absolute;
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
  font-family: "Telegraf";
  font-size: 14px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  p {
    background-color: black;
    padding: 5px;
  }

  #social {
    float: left;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
    cursor: url("../assets/icons/cursor2.png"), pointer;
  }

  #shuffle {
    position: fixed;
    top: 1vw;
    right: 1vw;
    float: right;
    display: flex;
    height: 50px;

    .shuffle-icon {
      opacity: 0.5;
      cursor: url("../assets/icons/cursor2.png"), pointer;

      &:hover {
        animation: spin 2s linear infinite;
        opacity: 1;
      }
    }
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
}

.item-one {
  cursor: url("../assets/icons/cursor1.png"), pointer !important;
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
</style>
