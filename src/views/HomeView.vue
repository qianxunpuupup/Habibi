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
    <MusicPlayer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import LetterModal from "@/components/LetterModal.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

const showLetter = ref(false); // 信件弹窗显隐；打开时猫头鹰同时隐藏（v-if 互斥）
const winW = ref(window.innerWidth); // 视口宽度（响应式，驱动设备判断与猫头鹰布局）
const winH = ref(window.innerHeight); // 视口高度

// ==================== 设备判断与背景切换 ====================
// 约定 <= 480px 为手机。isMobile 绑定到根元素 class，
// 由 CSS（.home.is-mobile）将背景图从 pc-bg.png 换成 mobile-bg.png
const isMobile = computed(() => winW.value <= 480);
// 以 CSS 变量形式把"播放器建议高度"传给子组件样式使用
// （视口高的 25%，最小 180px，防止小屏下播放器过矮）
const homeStyle = computed(() => ({
  "--music-player-h": `${Math.max(180, winH.value * 0.25)}px`,
}));

// owl.png 原始尺寸（用于等比缩放，防止图片变形）
const OWL_IMG_W = 2048;
const OWL_IMG_H = 1870;

// ==================== 猫头鹰布局计算 ====================
// 以视口高度的 20% 定高（最小 110px），宽度按原图宽高比换算；
// 位置固定在左上区域（top ≈ 视口 10%~22%），避免遮挡中间人物和底部播放器
const owlStyle = computed(() => {
  const vw = winW.value;
  const vh = winH.value;
  const owlH = Math.max(110, vh * 0.2); // 高度：20% 视口高，兜底 110px
  const owlW = owlH * (OWL_IMG_W / OWL_IMG_H); // 宽度按原图比例推导

  // left: 视口宽 4%，至少留 8px 边距
  // top : 视口高 22% 处（vh - owlH - vh*0.78 等价于 vh*0.22 - owlH 的底部对齐写法）
  const left = Math.max(8, vw * 0.04);
  const top = Math.max(8, vh - owlH - vh * 0.78);

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${owlW}px`,
    height: `${owlH}px`,
  };
});

// 点击猫头鹰 → 打开信件（LetterModal 内部触发打字机效果）
const onOwlClick = () => {
  showLetter.value = true;
};
// 关闭信件 → 猫头鹰重新出现
const closeLetter = () => {
  showLetter.value = false;
};

// 监听窗口尺寸变化：更新 winW/winH，触发 isMobile / owlStyle / homeStyle 重算
const onResize = () => {
  winW.value = window.innerWidth;
  winH.value = window.innerHeight;
};

onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => window.removeEventListener("resize", onResize)); // 卸载时移除监听，防止泄漏
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

/* 手机端（isMobile=true 时根元素带此类）：换竖版手机背景图 */
.home.is-mobile {
  background-image: url("../../assets/mobile-bg.png");
  background-position: center bottom;
  background-size: cover;
}

/* 中间人物立绘层：figure.png 居中靠底，pointer-events:none 不挡点击 */
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
