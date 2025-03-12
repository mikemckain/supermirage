<template>
  <div id="home">
    <Header @shuffle-items="shuffleItems()" />
    <div class="grid cascade-items">
      <div class="item item-one">
        <img id="item-one" src="../assets/00000 Image.jpg" />
      </div>
      <div class="item" v-for="item in visibleItems" :key="item.url">
        <Item :item="item" @image-failed="reportFailedImage" />
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
    // New debug helper to track failed images
    reportFailedImage(item) {
      if (!this.$isMobile) return;
      
      // Add to failed items list
      if (!this.failedItems.some(failedItem => failedItem.url === item.url)) {
        this.failedItems.push(item);
        
        // Log to console in debug mode
        if (typeof window !== 'undefined' && window.location.search.includes('debug=true')) {
          console.warn('Image failed to load:', item.url);
          
          // Every 5 failures, report a summary
          if (this.failedItems.length % 5 === 0) {
            console.error('Failed images summary:', this.failedItems.map(i => ({
              url: i.url,
              contentType: i.contentType,
              extension: i.url.split('.').pop().toLowerCase()
            })));
          }
        }
      }
    },
    
    // Modified to remove videos on mobile
    optimizeForMobile() {
      if (!this.$isMobile) return;
      
      // Filter out videos on mobile devices
      const optimizedItems = this.allItems.filter(item => {
        // Check if item is a video based on URL extension or content type
        const url = item.url || '';
        const extension = url.split('.').pop().toLowerCase();
        const isVideo = 
          extension === 'mp4' || 
          extension === 'webm' || 
          (item.contentType && (
            item.contentType.includes('video/mp4') || 
            item.contentType.includes('video/webm')
          ));
        
        // Keep only non-video items
        return !isVideo;
      });
      
      console.log(`Filtered out ${this.allItems.length - optimizedItems.length} videos for mobile`);
      
      // Replace allItems with filtered list
      this.allItems = optimizedItems;
      
      // Adjust items per page for mobile
      this.visibleItems = this.allItems.slice(0, 8); // Fewer items initially for mobile
      
      // Prevalidate image URLs for mobile
      this.prevalidateNextBatchOfImages();
    },
    
    // Prevalidate image URLs to ensure they're mobile-compatible
    prevalidateNextBatchOfImages() {
      if (!this.$isMobile) return;
      
      // Look ahead at the next batch of images that will be loaded
      const start = this.currentPage * 8;
      const end = start + 16; // Look ahead 2 pages
      const nextBatch = this.allItems.slice(start, end);
      
      // For each item, preload metadata to check if it's likely to work on mobile
      nextBatch.forEach(item => {
        if (!item.url) return;
        
        // Check image extension
        const ext = item.url.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
        
        if (isImage) {
          // Create an image object to test loading
          const img = new Image();
          
          // Set a timeout to catch stalled loads
          const timeout = setTimeout(() => {
            console.warn('Image prevalidation timeout:', item.url);
            // Mark as potentially problematic
            item._mobileCompatibilityIssue = 'timeout';
          }, 5000);
          
          img.onload = () => {
            clearTimeout(timeout);
            // Check if image is extremely large
            if (img.width > 4000 || img.height > 4000) {
              console.warn('Very large image detected, may cause issues on mobile:', item.url);
              item._mobileCompatibilityIssue = 'size';
            } else {
              // Image seems fine
              item._mobileCompatibilityIssue = false;
            }
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            console.warn('Image prevalidation failed:', item.url);
            item._mobileCompatibilityIssue = 'load';
          };
          
          // Start loading the image
          img.src = item.url;
        }
      });
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
      
      // Prevalidate next batch after shuffle
      if (this.$isMobile) {
        this.prevalidateNextBatchOfImages();
      }
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
          
          // Prevalidate next batch after loading more
          if (this.$isMobile) {
            this.prevalidateNextBatchOfImages();
          }
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
      
      // Process items to add mobile-specific metadata
      const processedItems = dataFromServer.map(item => {
        // Add mobile-specific checks
        if (this.$isMobile) {
          // Identify potential problematic formats
          const url = item.url || '';
          const extension = url.split('.').pop().toLowerCase();
          
          // SPECIFIC CHECK FOR BACKBLAZE WEBP IMAGES (known to fail on mobile)
          if (url.includes('f004.backblazeb2.com') && extension === 'webp') {
            item._potentialMobileIssue = true;
            item._mobileCompatibilityIssue = 'backblaze-webp';
            
            // Create an alternate URL if possible (try jpg version)
            if (!item._alternateUrl) {
              item._alternateUrl = url.replace('.webp', '.jpg');
            }
          } else {
            // Check for very large file indicators in URL
            const potentiallyLarge = 
              url.includes('original') || 
              url.includes('full') || 
              url.includes('large');
              
            // Check for uncommon formats that might have issues on mobile
            const uncommonFormat = 
              !['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4'].includes(extension);
              
            // Flag items that might be problematic on mobile
            if (potentiallyLarge || uncommonFormat) {
              item._potentialMobileIssue = true;
            }
          }
        }
        return item;
      });
      
      this.allItems = processedItems;
      
      // Initial shuffle
      const items = [...processedItems];
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
      
      // For mobile, move potentially problematic items further down the list
      if (this.$isMobile) {
        // Reorder so potentially problematic items appear later
        this.allItems.sort((a, b) => {
          if (a._potentialMobileIssue && !b._potentialMobileIssue) return 1;
          if (!a._potentialMobileIssue && b._potentialMobileIssue) return -1;
          return 0;
        });
      }
      
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
      
      // Add mobile debugging console if debug parameter is present
      if (this.$isMobile && window.location.search.includes('debug=true')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        document.body.appendChild(script);
        script.onload = function() {
          window.eruda.init();
        };
      }
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
