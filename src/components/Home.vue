<template>
  <div id="home">
    <div id="header">
      <p id="title">super mirage</p>
      <a id="social" href="https://twitter.com/michael_mckain" target="_blank">
        <img src="../assets/icons/twitter.svg" />
      </a>
      <img id="shuffle" src="../assets/icons/spiral.svg" @click="shuffleItems()" />
    </div>
    <div class="photo-grid">
      <div class="photo-grid-item photo-grid-item-one">
        <img id="photo-one" src="../assets/00000 Image.jpg" />
      </div>
      <div class="photo-grid-item cascade-items" v-for="item in items" :key="item">
        <!-- <expandable-video class="video" v-if="item <= NUM_VIDEOS" :src="getMediaUrl(item)" /> -->
        <Item class="photo" :src="item.url" :item="item" />
      </div>
    </div>
    <!-- <div v-show="largeImage" id="large-image-wrapper" @click="largeImage = !largeImage">
      <img id="large-image" :src="item.url" />
    </div>-->
  </div>
</template>

<script>
import Item from "./Item";
// import ExpandableVideo from "./ExpandableVideo";

export default {
  name: "Home",
  data() {
    return {
      // largeImage: false,
      // currentImage: 2,
      items: [],
      item: {},
      // NUM_VIDEOS: 26,
    };
  },
  components: {
    Item,
  },
  methods: {
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
    // getMediaUrl() {
    //   console.log(this.items.url);
    //   // return this.items[].url;
    // },
    // lightbox(item) {
    //   this.currentImage = item;
    //   // this.largeImage = !this.largeImage;
    // },
  },
  async beforeMount() {
    // for (var i = 1; i <= 231; i++) this.items.push(i);

    const response = await fetch("https://slate.host/api/v1/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: your API key
        Authorization: "Basic SLAeedf8c8e-4179-4a55-8b31-82dc67f76310TE",
      },
      body: JSON.stringify({
        data: {
          // NOTE: optional, if you want your private slates too.
          private: false,
        },
      }),
    });
    const json = await response.json();
    console.log(json);

    this.items = json.slates[0].data.objects;
    // console.log(this.collection.item.url);
    this.shuffleItems();
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
  }

  img {
    opacity: 0.5;

    cursor: url("../assets/icons/cursor2.png"), pointer;
    &:hover {
      opacity: 1;
    }
  }

  #shuffle {
    position: fixed;
    top: 1vw;
    right: 1vw;
    float: right;

    &:hover {
      animation: spin 2s linear infinite;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.hideBG {
  opacity: 0.35;
}

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

.photo-grid-item {
  position: relative;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  cursor: url("../assets/icons/cursor2.png"), pointer;

  // -webkit-animation: fade-in 0.2s ease-out 0.3s both;
  // animation: fade-in 0.2s ease-out 0.3s both;
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

  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.photo-grid-item-one {
  cursor: url("../assets/icons/cursor1.png"), pointer !important;
}

.photo {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  object-fit: cover;

  // cursor: pointer;
}

.video {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  object-fit: cover;
}

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

  .photo-grid {
    border: 0px solid black;
    grid-gap: 1px;
  }

  #photo-one {
    height: 45%;
    width: 35%;
  }

  #large-image {
    height: auto;
    width: 90%;
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
