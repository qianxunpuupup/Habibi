<template>
  <div :class="bgStyle" :style="{ backgroundImage: `url(${bgImage})` }">
    <!-- 猫头鹰图片，可点击交互 -->
    <div
      v-if="!showLetter"
      class="owl-wrapper"
      :style="owlStyle"
      @click="onOwlClick"
    >
      <img :src="owlImage" class="owl-img" alt="猫头鹰" />
      <div class="owl-ring"></div>
      <div class="owl-ring delay"></div>
      <div class="owl-hint">
        <span class="hint-icon">✉️</span>
        <span class="hint-text">点击猫头鹰</span>
      </div>
    </div>

    <!-- 组件 -->
    <LetterModal v-if="showLetter" :visible="showLetter" @close="closeLetter" />
    <MusicPlayer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import bgImage from "../../assets/bg.png";
import owlImage from "../../assets/owl.png";
import LetterModal from "@/components/LetterModal.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

const showLetter = ref(false);
const winW = ref(window.innerWidth);
const winH = ref(window.innerHeight);

// 背景图原始尺寸
const IMG_W = 2848;
const IMG_H = 1600;

// owl.png 原始尺寸
const OWL_IMG_W = 2048;
const OWL_IMG_H = 1870;

const bgStyle = computed(() => {
  const vw = winW.value;
  const vh = winH.value;

  // 背景图宽高比
  const bgRatio = IMG_W / IMG_H;
  const winRatio = vw / vh;

  return winRatio > bgRatio ? "wider" : "higher";
});

// 计算猫头鹰图片在视口中的尺寸
// 宽度取视口的 28%，但不超过背景图中猫头鹰区域的宽度
const owlStyle = computed(() => {
  const vw = winW.value;
  const vh = winH.value;

  // 猫头鹰图片宽度占视口宽度的比例
  let owlW = vw * 0.28;
  // 手机端稍小
  if (vw <= 480) owlW = vw * 0.34;
  else if (vw <= 768) owlW = vw * 0.3;

  // 高度按比例
  let owlH = owlW * (OWL_IMG_H / OWL_IMG_W);

  // 定位：左侧偏下，不遮挡背景中心区域
  let left = vw * 0.04;
  let top = vh - owlH - vh * 0.12;

  // 确保不超出视口
  if (left < 8) left = 8;
  if (top < 8) top = 8;

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
.wider {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-repeat: repeat;
  background-position: center center;
  background-size: 100% auto;
  background-image: url("../../assets/bg.png");
}

.higher {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-repeat: repeat;
  background-position: center center;
  background-size: auto 100%;
  background-image: url("../../assets/bg.png");
}

/* 猫头鹰图片容器 */
.owl-wrapper {
  position: absolute;
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

.owl-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
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
  top: 28%;
  left: 50%;
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
  top: -36px;
  left: 50%;
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
  .owl-ring {
    width: 44px;
    height: 44px;
    border-width: 2px;
  }
  .owl-hint {
    font-size: 11px;
    padding: 4px 10px;
    top: -28px;
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
    top: -32px;
  }
}
</style>
