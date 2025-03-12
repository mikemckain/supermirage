<template>
  <div id="home">
    <Header @shuffle-items="shuffleItems()" />
    <div class="grid cascade-items">
      <div class="item item-one">
        <img 
          id="item-one" 
          src="../assets/00000 Image.jpg"
          @error="handleImageError($event)" 
          loading="eager"
        />
      </div>
      <div 
        class="item" 
        v-for="item in visibleItems" 
        :key="item.url"
      >
        <Item 
          :item="item" 
          @media-load="handleMediaLoad"
          @media-error="handleMediaError" 
        />
      </div>
    </div>
    <div 
      v-if="hasMoreItems" 
      ref="loadingTrigger" 
      class="loading-more"
      :class="{ 'is-loading': isLoading }"
    >
      {{ isLoading ? 'Loading...' : '' }}
    </div>
  </div>
</template>

<script>
import Item from "./Item";
import Header from "./Header";

const ITEMS_PER_PAGE = 13;
const LOAD_RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

export default {
  name: "Home",
  data() {
    return {
      allItems: [],
      visibleItems: [],
      currentPage: 0,
      isLoading: false,
      videosOn: true,
      removedItems: [],
      observer: null,
      loadingStates: new Map(), // Track loading state of each item
      retryCount: 0,
    };
  },

  components: {
    Item,
    Header,
  },

  methods: {
    handleImageError(event) {
      const img = event.target;
      if (this.retryCount < MAX_RETRIES) {
        setTimeout(() => {
          img.setAttribute('src', img.getAttribute('src') + '?retry=' + Date.now());
          this.retryCount++;
        }, LOAD_RETRY_DELAY);
      }
    },

    handleMediaLoad(itemUrl) {
      this.loadingStates.set(itemUrl, 'loaded');
    },

    handleMediaError(itemUrl) {
      const currentRetries = this.loadingStates.get(itemUrl)?.retries || 0;
      if (currentRetries < MAX_RETRIES) {
        this.loadingStates.set(itemUrl, { 
          status: 'retrying',
          retries: currentRetries + 1 
        });
        // Trigger a re-render of the specific item
        const itemIndex = this.visibleItems.findIndex(item => item.url === itemUrl);
        if (itemIndex !== -1) {
          const item = { ...this.visibleItems[itemIndex] };
          // Add cache-busting parameter to URL
          item.url = item.url + '?retry=' + Date.now();
          this.$set(this.visibleItems, itemIndex, item);
        }
      } else {
        this.loadingStates.set(itemUrl, 'error');
      }
    },

    removeVideos() {
      if (!this.$isMobile) return;
      
      this.backup = [...this.allItems];
      this.allItems = this.allItems.filter(item => item.contentType !== "video/mp4");
      this.videosOn = false;
      
      // Reset visible items
      this.currentPage = 1;
      this.visibleItems = this.allItems.slice(0, ITEMS_PER_PAGE);
    },

    async loadMoreItems() {
      if (this.isLoading || !this.hasMoreItems) return;
      
      try {
        this.isLoading = true;
        
        const start = this.currentPage * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const newItems = this.allItems.slice(start, end);
        
        // Filter out duplicates
        const uniqueNewItems = newItems.filter(newItem => 
          !this.visibleItems.some(visibleItem => visibleItem.url === newItem.url)
        );
        
        if (uniqueNewItems.length) {
          // Initialize loading states for new items
          uniqueNewItems.forEach(item => {
            if (!this.loadingStates.has(item.url)) {
              this.loadingStates.set(item.url, 'loading');
            }
          });
          
          this.visibleItems = [...this.visibleItems, ...uniqueNewItems];
          this.currentPage++;
        }
      } catch (error) {
        console.error('Error loading more items:', error);
      } finally {
        this.isLoading = false;
      }
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
        if (entries[0].isIntersecting && !this.isLoading) {
          requestAnimationFrame(() => this.loadMoreItems());
        }
      }, options);

      if (this.$refs.loadingTrigger) {
        this.observer.observe(this.$refs.loadingTrigger);
      }
    },

    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },

    shuffleItems() {
      this.allItems = this.shuffleArray([...this.allItems]);
      // Reset pagination when shuffling
      this.currentPage = 1;
      this.visibleItems = this.allItems.slice(0, ITEMS_PER_PAGE);
    }
  },

  async beforeMount() {
    try {
      const response = await fetch("https://supermirage.pics/api/files");
      if (!response.ok) throw new Error('Failed to fetch items');
      
      const dataFromServer = await response.json();
      this.allItems = this.shuffleArray([...dataFromServer]);
      this.visibleItems = this.allItems.slice(0, ITEMS_PER_PAGE);
      this.currentPage = 1;

      // Initialize loading states
      this.visibleItems.forEach(item => {
        this.loadingStates.set(item.url, 'loading');
      });

      if (this.$isMobile) {
        this.removeVideos();
      }
    } catch (error) {
      console.error('Error fetching items:', error);
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
      return this.visibleItems.length < this.allItems.length;
    }
  },

  watch: {
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
  min-height: 60px;
  
  &.is-loading {
    opacity: 0.7;
  }
}

.item {
  &.loading {
    background: rgba(0, 0, 0, 0.1);
  }
  
  &.error {
    background: rgba(255, 0, 0, 0.1);
  }
}
</style>
