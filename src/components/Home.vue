<template>
  <div id="home">
    <Header @shuffle-items="shuffleItems()" />
    <div class="grid cascade-items">
      <div class="item item-one">
        <img id="item-one" src="../assets/00000 Image.jpg" />
      </div>
      <div class="item" v-for="item in visibleItems" :key="item.url">
        <Item :item="item" />
      </div>
    </div>
    <!-- Modified loading indicator with ref -->
    <div v-if="hasMoreItems" ref="loadingTrigger" class="loading-more">
      {{ isLoading ? '' : '' }}
    </div>
  </div>
</template>

<script>
import Item from "./Item";
import Header from "./Header";

const ITEMS_PER_PAGE = 13;

export default {
  name: "Home",
  data() {
    return {
      allItems: [], // All items from server
      visibleItems: [], // Currently visible items
      currentPage: 0,
      isLoading: false,
      videosOn: true,
      removedItems: [],
      observer: null,
    };
  },

  components: {
    Item,
    Header,
  },
  methods: {
    removeVideos() {
      for (var i = this.allItems.length - 1; i >= 0; --i) {
        this.backup = this.allItems;
        if (this.allItems[i].contentType == "video/mp4") {
          this.removedItems = this.allItems.splice(i, 1);
          // this.items.splice(i, 1);
          this.videosOn = false;
        }
      }
    },
    shuffleItems() {
      const items = [...this.allItems];
      var m = items.length,
        t,
        i;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = items[m];
        items[m] = items[i];
        items[i] = t;
      }
      this.allItems = items;
      
      // Reset pagination when shuffling
      this.currentPage = 1;
      this.visibleItems = this.allItems.slice(0, ITEMS_PER_PAGE);
    },
    loadMoreItems() {
      if (this.isLoading || !this.hasMoreItems) return;
      
      this.isLoading = true;
      
      setTimeout(() => {
        const start = this.currentPage * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const newItems = this.allItems.slice(start, end);
        
        // Filter out any duplicates
        const uniqueNewItems = newItems.filter(newItem => 
          !this.visibleItems.some(visibleItem => visibleItem.url === newItem.url)
        );
        
        if (uniqueNewItems.length) {
          this.visibleItems = [...this.visibleItems, ...uniqueNewItems];
          this.currentPage++;
        }
        
        this.isLoading = false;
      }, 500);
    },
    setupIntersectionObserver() {
      if (this.observer) {
        this.observer.disconnect();
      }

      const options = {
        root: null,
        rootMargin: '300px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadMoreItems();
        }
      }, options);

      // Use $refs to observe the loading trigger
      if (this.$refs.loadingTrigger) {
        this.observer.observe(this.$refs.loadingTrigger);
      }
    }
  },

  async beforeMount() {
    const responseFromServer = await fetch("https://supermirage.pics/api/files");
    const dataFromServer = await responseFromServer.json();
    this.allItems = dataFromServer;
    
    // Initial shuffle
    const items = [...dataFromServer];
    var m = items.length,
      t,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = items[m];
      items[m] = items[i];
      items[i] = t;
    }
    this.allItems = items;
    
    // Set initial visible items
    this.visibleItems = this.allItems.slice(0, ITEMS_PER_PAGE);
    this.currentPage = 1;

    if (this.$isMobile) {
      this.removeVideos();
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.setupIntersectionObserver();
    });
  },

  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },

  computed: {
    hasMoreItems() {
      // Check if we have more unique items to load
      const currentCount = this.visibleItems.length;
      const totalCount = this.allItems.length;
      return currentCount < totalCount;
    }
  },

  watch: {
    // Re-setup observer when loading trigger becomes visible
    hasMoreItems: {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.setupIntersectionObserver();
          });
        }
      },
      immediate: true
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
  // animation: fade-in 0.5s ease-in-out;
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
  cursor: url("../assets/icons/dove.png"), pointer !important;
}

.item-one {
  cursor: url("../assets/icons/dove.png"), pointer !important;
}

.cascade-items {
  @for $i from 1 through 15 {
    :nth-child(#{$i}n) {
      animation-delay: #{$i * 0.15}s !important;
    }
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// mobile screens
@media (max-width: 650px) {
  .grid {
    border: 0px solid black;
    grid-gap: 1px;
    grid-template-columns: repeat(2, 1fr);
  }

  #item-one {
    height: 45%;
    width: 35%;
  }
}

.loading-more {
  text-align: center;
  padding: 2rem;
  font-family: "Telegraf";
}
</style>
