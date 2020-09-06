<template>
  <div id="home">
    <div id="header">
      <p id="title">super mirage</p>
      <a id="social" href="https://twitter.com/michael_mckain" target="_blank">
        <img src="../assets/icons/twitter.svg" />
      </a>

      <img id="shuffle" src="../assets/icons/spiral.svg" @click="shuffleCollection()" />
    </div>
    <!-- <div class="photo-grid" :class="{ hideBG: largeImage }">
      <div class="photo-grid-item photo-grid-item-one">
        <img id="photo-one" src="../assets/00000 Image.jpg" />
    </div>-->
    <virtual-list
      class="photo-grid"
      ref="vlist"
      :data-key="'index'"
      :data-sources="collection"
      :data-component="expandableItem"
    />

    <!-- <div class="photo-grid-item cascade-items" v-for="index in collection" :key="index">
        <transition name="fade">
          <expandable-item
          <expandable-video
            class="video"
            v-if="index <= NUM_VIDEOS"
            :src="getMediaUrl(index)"
            @click.native="lightbox(index)"
          />
          <expandable-image
            class="photo"
            v-else
            :src="imageUrl(index)"
            @click.native="lightbox(index)"
          />

        </transition>
    </div>-->
  </div>
</template>

<script>
// import ExpandableImage from "./ExpandableImage";
// import ExpandableVideo from "./ExpandableVideo";

import ExpandableItem from "./ExpandableItem";
import VirtualList from "vue-virtual-scroll-list";

export default {
  name: "Home",
  components: { "virtual-list": VirtualList },
  data() {
    return {
      expandableItem: ExpandableItem,
      collection: [],
      largeImage: false,
    };
  },
  methods: {
    shuffleCollection() {
      var collection = this.collection;
      var m = collection.length,
        t,
        i;

      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = collection[m];
        collection[m] = collection[i];
        collection[i] = t;
      }

      this.collection = [];
      this.collection = collection;
    },

    imageUrl(index) {
      return require("../assets/" + index + " Image.jpg");
    },

    // getImageUrl() {
    //   var imageNum = Math.floor(Math.random() * 228);
    //   return require("../assets/" + imageNum + " Image.jpg");
    // },
  },
  beforeMount() {
    for (var i = 1; i <= 224; i++) this.collection.push({ index: i });
    this.shuffleCollection();
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
    opacity: 0.25;

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

// #large-image-wrapper {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: url("../assets/icons/cursor3.png"), pointer;
// }

// #large-image {
//   width: auto;
//   height: 90%;
//   z-index: 300;
// }

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

// .photo-grid-item {
//   position: relative;
//   user-select: none;
//   -moz-user-select: none;
//   -webkit-user-drag: none;
//   -webkit-user-select: none;
//   -ms-user-select: none;
//   cursor: url("../assets/icons/cursor2.png"), pointer;

//   // -webkit-animation: fade-in 0.2s ease-out 0.3s both;
//   // animation: fade-in 0.2s ease-out 0.3s both;
// }

// .photo-grid-item::before {
//   content: "";
//   display: block;
//   padding-top: 100%;
// }

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
