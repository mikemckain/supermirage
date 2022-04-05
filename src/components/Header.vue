<template>
  <div class="header">
    <div class="info" @mouseenter="info" @mouseleave="info">
      <p :class="['title', {titleHover: showInfo}]">supermirage</p>
      <div v-show="showInfo">
        <!-- <br /> -->
        <p>shot w/ iPhone, mostly</p>
        <!-- <br /> -->
        <a href="https://slate.host" target="_blank">hosting on IPFS w/ slate</a>
      </div>
    </div>
    <div class="social" v-if="!$isMobile" v-show="!showInfo">
      <a href="https://twitter.com/mmckain_" target="_blank">
        <img src="../assets/icons/twitter.svg" />
      </a>
      <a href="https://soundcloud.com/crowncomfort" target="_blank">
        <img src="../assets/icons/soundcloud.svg" />
      </a>
    </div>
    <!-- <div class="control-panel"> -->
    <div class="control">
      <p class="shuffle-text" v-show="shuffleText && !$isMobile">new grid</p>
      <img
        :class="{shuffleIcon: !$isMobile}"
        @mouseenter="showShuffleText"
        @mouseleave="showShuffleText"
        src="../assets/icons/spiral.svg"
        @click="shuffleItems()"
      />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      showInfo: false,
      shuffleText: false,
    };
  },
  methods: {
    info() {
      this.showInfo = !this.showInfo;
    },
    showShuffleText() {
      this.shuffleText = !this.shuffleText;
    },
    shuffleItems() {
      this.$emit("shuffle-items");
    },
  },
};
</script>

<style scoped lang="scss">
.control {
  position: fixed;
  top: 1vw;
  right: 1vw;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
  height: 20px;

  margin-top: 5px;
  padding-right: 5px;

  p {
    padding: 5px 8px 5px 5px;
    background-color: black;
  }
}

.shuffle-text {
  height: 25px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// .control-panel {
//   position: fixed;
//   top: 1vw;
//   right: 1vw;
//   float: right;
//   display: flex;
//   flex-direction: column;
// }

.shuffleIcon {
  opacity: 0.5;
  cursor: url("../assets/icons/cursor2.png"), pointer;

  &:hover {
    opacity: 1;
    animation: spin 2s linear infinite;
  }
}

.header {
  position: fixed;
  top: 1vw;
  left: 1vw;
  z-index: 100;
  font-family: Telegraf-Bold, sans-serif;
  line-height: 100%;
  font-size: 14px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  box-sizing: border-box;
  p {
    margin: 0;
    opacity: 0.9;
    background-color: black;
    box-sizing: border-box;
  }
}

.info {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: url("../assets/icons/heart.png"), pointer;

  p {
    padding: 5px 5px 5px 0px;
  }

  a {
    color: white;
    opacity: 0.8;
    cursor: url("../assets/icons/cursor2.png"), pointer;
    background-color: black;
    padding: 5px 5px 5px 0px;

    &:hover {
      opacity: 1;
    }
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
    width: 22px;
  }
}

.title {
  margin-top: 5px;
  transition: 1s;

  width: 100%;
}

.titleHover {
  color: rgb(255, 234, 151);
  animation: hue-rotate 4s linear infinite;
}

//Spin Animation
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
//Hue Rotate Animation
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

//Mobile
@media (max-width: 650px) {
  .header {
    top: 0;
    left: 0;
    padding: 0;
    font-size: 10px;
    margin-top: 5px;
    margin-left: 5px;

    p {
      margin: 0;
      padding: 5px;
    }

    img {
      opacity: 1;
      height: 12px;
      width: 12px;
      padding: 5px;
      background-color: black;
    }
  }

  .control {
    opacity: 1;

    top: 0vw;
    right: 0vw;
  }
}
</style>