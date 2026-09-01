<template>
  <div class="home" :class="{ 'is-mobile': isMobile }" :style="homeStyle">
    <div class="figure-layer" aria-hidden="true"></div>

    <!-- 猫头鹰图片，可点击交互 -->
    <div
      v-if="!showLetter"
      class="owl-wrapper"
      :style="owlStyle"
      @click="onOwlClick"
    >
      <div class="owl-image" aria-hidden="true"></div>
      <div class="owl-ring"></div>
      <div class="owl-ring delay"></div>
      <div class="owl-hint">
        <span class="hint-icon">✉️</span>
        <span class="hint-text">点我看看</span>
      </div>
    </div>

    <!-- 信件 -->
    <LetterModal v-if="showLetter" :visible="showLetter" @close="closeLetter" />

    <!-- 音乐播放器 -->
    <!-- <MusicPlayer /> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import LetterModal from "@/components/LetterModal.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

const showLetter = ref(false);
const winW = ref(window.innerWidth);
const winH = ref(window.innerHeight);

// 根据设备类型切换不同背景图
const isMobile = computed(() => winW.value <= 480);
const homeStyle = computed(() => ({
  "--music-player-h": `${Math.max(180, winH.value * 0.25)}px`,
}));

// owl.png 原始尺寸
const OWL_IMG_W = 2048;
const OWL_IMG_H = 1870;

// 计算猫头鹰图片在视口中的尺寸：按背景高度 30% 控制，保持原图比例
const owlStyle = computed(() => {
  const vw = winW.value;
  const vh = winH.value;
  const owlH = Math.max(110, vh * 0.2);
  const owlW = owlH * (OWL_IMG_W / OWL_IMG_H);

  // 位置：底部左侧，避免压住中心画面
  const left = Math.max(8, vw * 0.04);
  const top = Math.max(8, vh - owlH - vh * 0.78);

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${owlW}px`,
    height: `${owlH}px`,
  };
});

const onOwlClick = () => {
  showLetter.value = true;
};
const closeLetter = () => {
  showLetter.value = false;
};

const onResize = () => {
  winW.value = window.innerWidth;
  winH.value = window.innerHeight;
};

onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => window.removeEventListener("resize", onResize));
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  background-image: url("../../assets/pc-bg.png");
  --music-player-h: 25vh;
}

.home.is-mobile {
  background-image: url("../../assets/mobile-bg.png");
  background-position: center bottom;
  background-size: cover;
}

.figure-layer {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  width: min(42vw, 620px);
  height: min(70vh, 100%);
  min-width: 120px;
  min-height: 180px;
  max-width: 100%;
  max-height: 70vh;
  aspect-ratio: 700 / 1040;
  background-image: url("../../assets/figure.png");
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: contain;
  background-color: transparent;
  z-index: 10;
  pointer-events: none;
  opacity: 0.98;
  transform-origin: center bottom;
}

.figure-layer::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0%;
  transform: translateX(-50%);
  width: 58%;
  height: 9%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(61, 72, 79, 0.18) 0%,
    rgba(61, 72, 79, 0.1) 28%,
    rgba(61, 72, 79, 0.02) 62%,
    rgba(61, 72, 79, 0) 100%
  );
  filter: blur(10px);
  pointer-events: none;
  z-index: -1;
}

/* 猫头鹰图片容器 */
.owl-wrapper {
  position: absolute;
  top: 10%;
  left: 12%;
  z-index: 20;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;

  &:hover {
    transform: scale(1.03);
    filter: brightness(1.08);
  }
  &:active {
    transform: scale(0.97);
  }
}

.owl-image {
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: url("../../assets/owl.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  /* 阴影增强立体感 */
  filter: drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.35));
  animation: owlFloat 4s ease-in-out infinite;
}

@keyframes owlFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-1deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
  }
}

/* 脉冲提示圈 */
.owl-ring {
  position: absolute;
  top: 68%;
  left: 70%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 220, 100, 0.7);
  border-radius: 50%;
  animation: pulseRing 2s ease-out infinite;
  pointer-events: none;
}
.owl-ring.delay {
  animation-delay: 1s;
}
@keyframes pulseRing {
  0% {
    transform: translate(-50%, -50%) scale(0.6);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }
}

/* 提示标签 */
.owl-hint {
  position: absolute;
  top: 30%;
  left: 90%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  font-size: 13px;
  color: #8b4513;
  font-weight: 600;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  animation: hintBob 2.2s ease-in-out infinite;
  pointer-events: none;
}
@keyframes hintBob {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-6px);
  }
}
.hint-icon {
  font-size: 15px;
}

/* ===== 手机端 (<= 480px) ===== */
@media (max-width: 480px) {
  .figure-layer {
    width: min(50vw, 300px);
    height: auto;
    min-width: 230px;
    min-height: 150px;
    max-height: 62vh;
    bottom: 7%;
    background-size: contain;
    filter: none;
  }

  .owl-ring {
    width: 44px;
    height: 44px;
    border-width: 2px;
  }
  .owl-hint {
    font-size: 11px;
    padding: 4px 10px;
    top: 30%;
    gap: 3px;
  }
  .hint-icon {
    font-size: 13px;
  }
}

/* ===== 平板端 (481px ~ 768px) ===== */
@media (min-width: 481px) and (max-width: 768px) {
  .owl-ring {
    width: 52px;
    height: 52px;
  }
  .owl-hint {
    font-size: 12px;
    top: 30%;
  }
}
</style>
