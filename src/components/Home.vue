<template>
  <div id="home">
    <Header @shuffle-items="shuffleItems()" />
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
import Header from "./Header";

export default {
  name: "Home",
  data() {
    return {
      items: [],
      item: {},
      videosOn: true,
      removedItems: [],
    };
  },

  components: {
    Item,
    Header,
  },
  methods: {
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

// .cascade-items {
//   @for $i from 1 through 15 {
//     :nth-child(#{$i}n) {
//       animation-delay: #{$i * 0.15}s !important;
//     }
//   }
// }

//Mobile
@media (max-width: 650px) {
  .grid {
    border: 0px solid black;
    grid-gap: 1px;
  }

  #item-one {
    height: 45%;
    width: 35%;
  }
}

// Transition In
// @keyframes fade-in {
//   0% {
//     -webkit-transform: translateY(5px);
//     transform: translateY(15px);
//     opacity: 0;
//   }
//   100% {
//     -webkit-transform: translateY(0);
//     transform: translateY(0);
//     opacity: 1;
//   }
// }
// @-webkit-keyframes fade-in {
//   0% {
//     -webkit-transform: translateY(5px);
//     transform: translateY(50px);
//     opacity: 0;
//   }
//   100% {
//     -webkit-transform: translateY(0);
//     transform: translateY(0);
//     opacity: 1;
//   }
// }
</style>
