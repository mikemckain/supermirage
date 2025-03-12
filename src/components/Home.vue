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
      failedItems: [], // Track failed items
      observer: null,
    };
  },

  components: {
    Item,
    Header,
  },
  methods: {
    // Modified to optimize rather than remove videos on mobile
    optimizeForMobile() {
      if (!this.$isMobile) return;
      
      // Instead of removing videos, we'll optimize loading
      // by reducing the initial load count on mobile
      const optimizedItems = [...this.allItems];
      
      // Filter out extremely large videos if needed based on contentType or size
      this.allItems = optimizedItems;
      
      // Adjust items per page for mobile
      this.visibleItems = this.allItems.slice(0, 8); // Fewer items initially for mobile
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
      this.visibleItems = this.allItems.slice(0, this.$isMobile ? 8 : ITEMS_PER_PAGE);
    },
    loadMoreItems() {
      if (this.isLoading || !this.hasMoreItems) return;
      
      this.isLoading = true;
      
      setTimeout(() => {
        const start = this.currentPage * (this.$isMobile ? 8 : ITEMS_PER_PAGE);
        const end = start + (this.$isMobile ? 8 : ITEMS_PER_PAGE);
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
        rootMargin: this.$isMobile ? '150px' : '300px', // Reduced margin on mobile
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
    try {
      const responseFromServer = await fetch("https://supermirage.pics/api/files");
      
      if (!responseFromServer.ok) {
        throw new Error(`Failed to fetch items: ${responseFromServer.status}`);
      }
      
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
      
      // Set initial visible items - fewer for mobile
      const initialCount = this.$isMobile ? 8 : ITEMS_PER_PAGE;
      this.visibleItems = this.allItems.slice(0, initialCount);
      this.currentPage = 1;
      
      // Optimize for mobile instead of removing videos
      this.optimizeForMobile();
    } catch (error) {
      console.error('Failed to load media:', error);
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
  min-height: 100px; /* Ensure minimum height for items */
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
  
  /* Ensure minimum size for mobile grid items */
  .item {
    min-height: 100px;
  }
}

.loading-more {
  text-align: center;
  padding: 2rem;
  font-family: "Telegraf";
}
</style>
