<template>
  <Transition name="modal">
    <div v-if="visible" class="letter-modal-overlay" @click.self="close">
      <!-- 飘落的花瓣装饰（样式预先计算，避免重渲染时重新随机） -->
      <div
        v-for="(style, i) in petalStyles"
        :key="'p' + i"
        class="petal-fall"
        :style="style"
      >
        🌸
      </div>

      <div class="letter-modal" @click.stop>
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="close">
          <span class="close-x">✕</span>
        </button>

        <!-- 信纸 -->
        <div class="letter-paper-wrap">
          <div class="paper-top">
            <div class="paper-hole"></div>
            <div class="paper-hole"></div>
            <div class="paper-hole"></div>
          </div>

          <div class="letter-content" ref="contentRef">
            <h2 class="letter-title">{{ titleText }}</h2>

            <div class="letter-date">{{ dateText }}</div>

            <div class="letter-body">
              <p
                v-for="(para, pIdx) in paragraphs"
                :key="'p' + pIdx"
                class="letter-paragraph"
              >
                <span class="typed-text" v-html="getParagraph(pIdx)"></span>
                <span
                  v-if="isTyping && currentPara === pIdx"
                  class="cursor"
                ></span>
              </p>
            </div>

            <div class="letter-sign">
              <div class="sign-line" v-show="currentPara >= paragraphs.length">
                <span class="typed-sign">{{ signText }}</span>
              </div>
              <div
                class="sign-name"
                v-show="currentPara >= paragraphs.length + 1"
              >
                <span class="typed-sign-name">{{ nameText }}</span>
              </div>
            </div>
          </div>

          <!-- 打字进度条 -->
          <div class="typing-progress" v-if="isTyping">
            <div
              class="progress-bar"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>

          <!-- 跳过按钮 -->
          <button v-if="isTyping" class="skip-btn" @click="skipTyping">
            <span>跳过打字效果</span>
            <span class="skip-arrow">→</span>
          </button>

          <!-- 底部装饰 -->
          <div class="paper-bottom">
            <svg
              class="decor-wave"
              viewBox="0 0 400 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0,10 Q50,0 100,10 T200,10 T300,10 T400,10"
                stroke="#E8DCC8"
                stroke-width="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from "vue";

const props = defineProps({
  visible: Boolean, // 父组件控制弹窗显隐；注意：组件由 v-if 挂载，创建时 visible 即为 true
});
const emit = defineEmits(["close"]);

// ==================== 信件静态文案 ====================
// 标题和日期直接渲染（不参与打字），只有正文/落款/署名逐字输出
const titleText = "💌 亲爱的 Habibi：";
const dateText = "2026年8月25日 · 阳光明媚的海边小屋";
const paragraphs = [
  "当你看到这封信的时候，窗外的海风正轻拂着白房子的屋顶，路边的小花儿们在阳光里摇曳着，像是在和你招手呢~",
  "记得我们说好要一起去看海的吗？S弯的公路会带我们穿过所有美好的风景，每一栋白色的小房子都藏着一个温暖的故事，每一朵盛开的花儿都为你准备了一个甜蜜的心愿。",
  "此刻的我，正坐在阳光里为你写下这些字。希望这封信能像海风一样，轻轻抱抱你；希望你打开播放器的时候，那首歌能替我说尽所有温柔；希望你知道，不管今天过得怎么样，总有一个人在惦记你呀。",
  "愿你每天都有好心情，像海边的阳光一样灿烂；愿你所有的愿望，都能像路旁的花儿一样慢慢绽放；愿你永远是那个被世界温柔以待的 Habibi。",
];
const signText = "—— 来自海边小屋的问候 ——";
const nameText = "🌊  永远的海边小伙伴  🌊";

// ==================== 打字机状态机 ====================
// 状态推进顺序：正文第0段 → 第1段 → ... → 第N-1段 → 落款 → 署名 → 结束
// currentPara 含义：
//   0 ~ paragraphs.length-1  正在打第几段正文
//   paragraphs.length        正在打落款
//   paragraphs.length+1      正在打署名
//   paragraphs.length+2      全部完成
const currentPara = ref(0); // 当前段落索引（兼作状态机阶段标记）
const currentChar = ref(0); // 当前段已打到的字符下标
const isTyping = ref(false); // 是否处于打字中（控制光标/进度条/跳过按钮显隐）
let typeTimer = null; // setTimeout 句柄（非响应式，仅用于清除）

// 已打出的文本（模板只渲染这些，逐字增长形成打字效果）
const displayedParas = ref(paragraphs.map(() => "")); // 每段已显示内容
const displayedSign = ref(""); // 落款已显示内容
const displayedName = ref(""); // 署名已显示内容

// ==================== 打字进度计算（驱动底部进度条） ====================
// 总字符数 = 所有正文段落 + 落款 + 署名
const totalChars = computed(() => {
  return (
    paragraphs.reduce((sum, p) => sum + p.length, 0) +
    signText.length +
    nameText.length
  );
});

// 已打字符数：已完成的整段 + 当前段已打的字符 + 落款/署名进度
const typedChars = computed(() => {
  let count = 0;
  for (let i = 0; i < Math.min(currentPara.value, paragraphs.length); i++) {
    count += paragraphs[i].length;
  }
  if (currentPara.value < paragraphs.length) {
    count += currentChar.value;
  } else if (currentPara.value === paragraphs.length) {
    count += displayedSign.value.length;
  } else {
    count += signText.length + displayedName.value.length;
  }
  return count;
});

const progressPercent = computed(() => {
  return Math.min(100, (typedChars.value / totalChars.value) * 100);
});

const getParagraph = (idx) => displayedParas.value[idx];

// ==================== 花瓣样式预计算（掉落速度控制点 ①：时长与延迟） ====================
// 掉落"速度"实际由 animationDuration 决定：路程固定（-10vh → 110vh），
// duration 越大飘得越慢。当前 14~22 秒飘落完整一屏。
// 【调速度就改这里】
//   - duration 基准值 14：越小越快（如改 8 则 8~16 秒落一屏）
//   - delay 0~8s：控制花瓣错峰出现的稀疏程度，越大越稀疏
const petalStyles = Array.from({ length: 15 }, () => {
  const left = Math.random() * 100; // 水平起点：0~100% 随机
  const delay = Math.random() * 8; // 首次掉落延迟：0~8s，让花瓣错开出现
  const duration = 14 + Math.random() * 8; // 单次掉落时长：14~22s（值越小掉得越快）
  const size = 0.8 + Math.random() * 0.8; // 缩放 0.8~1.6 倍（近大远小层次感）
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`, // → 内联到 style，控制每片花瓣何时开始
    animationDuration: `${duration}s`, // → 内联到 style，控制每片花瓣掉落快慢
    "--petal-scale": size, // → CSS 变量，供 @keyframes 内 transform 读取
  };
});

// 计算下一个字符的步长（emoji 代理对占 2 个码元，不能截断）
const charStep = (text, index) => {
  const code = text.charCodeAt(index);
  return code >= 0xd800 && code <= 0xdbff && index + 1 < text.length ? 2 : 1;
};

// 打字时自动滚动到底部，保证光标可见
const contentRef = ref(null);
const scrollToBottom = () => {
  nextTick(() => {
    const el = contentRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
};

// ==================== 打字机核心：递归逐字输出 ====================
// 通过 setTimeout 递归调用自身，每轮打一个字并安排下一轮延时
const typeChar = () => {
  if (currentPara.value < paragraphs.length) {
    // —— 阶段1：正在打正文段落 ——
    const para = paragraphs[currentPara.value];
    if (currentChar.value < para.length) {
      const step = charStep(para, currentChar.value); // emoji 算 1 个字符
      const ch = para.charAt(currentChar.value);
      // 更新该段已显示文本（触发视图更新，多出一个字）
      displayedParas.value[currentPara.value] = para.substring(
        0,
        currentChar.value + step,
      );
      currentChar.value += step;
      scrollToBottom(); // 内容增多后滚动到底部，保证光标可见

      // 标点符号停顿更久，模拟真实打字节奏（带随机抖动更自然）
      const randDelay =
        ch === "，" || ch === "。" || ch === "！" || ch === "？" || ch === "~"
          ? 600 + Math.random() * 200 // 标点：600~800ms
          : 200 + Math.random() * 100; // 普通字：200~300ms
      typeTimer = setTimeout(typeChar, randDelay);
    } else {
      // 当前段打完 → 进入下一段，段落间停顿 1200ms
      currentPara.value++;
      currentChar.value = 0;
      typeTimer = setTimeout(typeChar, 1200);
    }
  } else if (currentPara.value === paragraphs.length) {
    // —— 阶段2：正文全部打完，开始打落款 ——
    if (displayedSign.value.length < signText.length) {
      displayedSign.value = signText.substring(
        0,
        displayedSign.value.length +
          charStep(signText, displayedSign.value.length), // 同样防止 emoji 截断
      );
      scrollToBottom();
      typeTimer = setTimeout(typeChar, 250);
    } else {
      currentPara.value++;
      typeTimer = setTimeout(typeChar, 900); // 落款→署名之间的停顿
    }
  } else if (currentPara.value === paragraphs.length + 1) {
    // —— 阶段3：开始打署名 ——
    if (displayedName.value.length < nameText.length) {
      displayedName.value = nameText.substring(
        0,
        displayedName.value.length +
          charStep(nameText, displayedName.value.length),
      );
      scrollToBottom();
      typeTimer = setTimeout(typeChar, 250);
    } else {
      // 全部打完：推进到完成态，停止打字（光标/进度条/跳过按钮随之隐藏）
      currentPara.value++;
      isTyping.value = false;
    }
  }
};

// 开始/重新开始打字：重置所有状态后延时 500ms 启动（等弹窗动画播完）
const startTyping = () => {
  currentPara.value = 0;
  currentChar.value = 0;
  isTyping.value = true;
  displayedParas.value = paragraphs.map(() => "");
  displayedSign.value = "";
  displayedName.value = "";
  clearTimeout(typeTimer);
  typeTimer = setTimeout(typeChar, 500);
};

// 跳过打字：直接填满全部文本并进入完成态
const skipTyping = () => {
  clearTimeout(typeTimer);
  displayedParas.value = [...paragraphs];
  displayedSign.value = signText;
  displayedName.value = nameText;
  currentPara.value = paragraphs.length + 2; // 完成态，落款/署名区域保持显示
  isTyping.value = false;
};

const close = () => {
  clearTimeout(typeTimer); // 关闭时必须清定时器，避免组件销毁后还在回调
  emit("close");
};

// 监听 visible 启动打字。
// 注意必须 immediate: true —— 组件由 v-if 挂载，创建时 visible 已是 true，
// 没有"变化"过程，不带 immediate 的 watch 永远不会触发。
watch(
  () => props.visible,
  (val) => {
    if (val) {
      startTyping();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  clearTimeout(typeTimer);
});
</script>

<style lang="scss" scoped>
.letter-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 50, 80, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
}

/* ==================== 花瓣掉落动画（速度控制点 ②③：运动曲线与路径） ==================== */
.petal-fall {
  position: absolute;
  top: -30px;
  font-size: 20px;
  /* 控制点②：linear 表示匀速下落；想模拟真实花瓣"先慢后快"的重力感，
     可改成 ease-in；想更轻飘可改 linear 并配合更长的 duration */
  animation: petalFall linear infinite; /* infinite = 落完一片立刻循环再落 */
  animation-fill-mode: both; /* 延迟期间保持 0% 帧（透明），避免花瓣卡在顶部 */
  /* 注意：每片花瓣的 animationDelay / animationDuration 由内联 style 注入（见 JS petalStyles），
     会覆盖此处缩写里的默认值，所以速度差异是逐片独立的 */
  pointer-events: none;
  will-change: transform, opacity;
}

/* 控制点③：掉落路径关键帧 —— 垂直方向从屏幕上方 -10vh 落到 110vh，
   水平方向漂 80px，同时旋转 540°（一圈半），形成"斜飘打转"的效果。
   想让花瓣更"飘"：加大 translateX 和 rotate；想直直落下：把二者改小 */
@keyframes petalFall {
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg)
      scale(var(--petal-scale, 1)); /* 从视口上方 10% 处开始 */
    opacity: 0; /* 淡入起点 */
  }
  10% {
    opacity: 1; /* 前 10% 路程淡入为可见 */
  }
  90% {
    opacity: 1; /* 90% 路程内保持可见 */
  }
  100% {
    transform: translateY(110vh) translateX(80px) rotate(540deg)
      scale(var(--petal-scale, 1)); /* 落到视口下方 10% 处消失 */
    opacity: 0; /* 最后 10% 路程淡出 */
  }
}

/* Modal 过渡 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s ease;
}
.modal-enter-active .letter-modal,
.modal-leave-active .letter-modal {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from,
.modal-leave-to {
  background: rgba(0, 0, 0, 0);
}
.modal-enter-from .letter-modal,
.modal-leave-to .letter-modal {
  opacity: 0;
  transform: translateY(60px) rotate(-3deg) scale(0.85);
}

/* 信纸主容器 */
.letter-modal {
  position: relative;
  width: 92%;
  max-width: 560px;
  max-height: 86vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  border: 3px solid #fff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(238, 90, 90, 0.5);
  transition: all 0.3s ease;
  &:hover {
    transform: rotate(90deg) scale(1.1);
    background: linear-gradient(135deg, #ee5a5a, #d94848);
  }
}

/* 信纸包裹 */
.letter-paper-wrap {
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, #fffef7 0%, #fff9e8 100%);
  border-radius: 6px;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(139, 119, 101, 0.15),
    inset 0 0 60px rgba(222, 184, 135, 0.15);
  padding: 30px 38px 28px;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(205, 175, 140, 0.4);
    border-radius: 3px;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      transparent 0,
      transparent 31px,
      rgba(173, 216, 230, 0.35) 31px,
      rgba(173, 216, 230, 0.35) 32px
    );
    mask-image: linear-gradient(180deg, transparent 75px, black 75px);
    pointer-events: none;
    opacity: 0.6;
  }
}

.paper-top {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 50px;
  z-index: 2;
}
.paper-hole {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #87ceeb;
  box-shadow:
    inset 0 2px 3px rgba(0, 0, 0, 0.2),
    0 1px 1px rgba(255, 255, 255, 0.8);
}

.letter-content {
  position: relative;
  z-index: 2;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 6px;
}

.letter-title {
  font-family: "ZCOOL XiaoWei", serif;
  font-size: 26px;
  color: #8b4513;
  margin-bottom: 8px;
  text-align: center;
  font-weight: normal;
  letter-spacing: 1px;
}

.letter-date {
  text-align: center;
  font-size: 13px;
  color: #a0826d;
  margin-bottom: 26px;
  letter-spacing: 0.5px;
  font-style: italic;
}

.letter-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 24px;
}

.letter-paragraph {
  font-family: "ZCOOL XiaoWei", serif;
  font-size: 16px;
  line-height: 32px;
  color: #5c4033;
  text-indent: 2em;
  text-align: justify;
  letter-spacing: 0.5px;
  margin: 0;
}

/* 打字光标：纯CSS竖线，em单位随文字大小自适应，基线对齐 */
.cursor {
  display: inline-block;
  width: 2px;
  height: 1.05em;
  background: #ff6b6b;
  border-radius: 1px;
  margin-left: 3px;
  vertical-align: -0.15em;
  animation: cursorBlink 0.8s step-end infinite;
}
@keyframes cursorBlink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.letter-sign {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding-top: 18px;
  border-top: 1px dashed rgba(205, 175, 140, 0.5);
}

.sign-line {
  font-size: 13px;
  color: #a0826d;
  letter-spacing: 2px;
}

.sign-name {
  font-family: "Pacifico", cursive;
  font-size: 18px;
  color: #cd5c5c;
  letter-spacing: 1px;
}

/* 打字进度条 */
.typing-progress {
  position: relative;
  z-index: 2;
  height: 4px;
  background: rgba(205, 175, 140, 0.2);
  border-radius: 2px;
  margin: 20px -8px -8px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ffb347, #ff6b9d, #ff6b6b);
  border-radius: 2px;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(255, 107, 157, 0.4);
}

/* 跳过按钮 */
.skip-btn {
  position: relative;
  z-index: 2;
  display: block;
  margin: 16px auto -4px;
  padding: 6px 18px;
  background: transparent;
  border: 1px solid rgba(205, 175, 140, 0.5);
  border-radius: 20px;
  color: #a0826d;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  font-family: inherit;
  &:hover {
    background: rgba(205, 175, 140, 0.15);
    border-color: #cdaf8c;
    color: #8b4513;
    gap: 8px;
  }
}
.skip-arrow {
  transition: transform 0.3s ease;
}
.skip-btn:hover .skip-arrow {
  transform: translateX(3px);
}

.paper-bottom {
  margin-top: 10px;
  opacity: 0.6;
}
.decor-wave {
  width: 100%;
  height: 20px;
}

/* ============ 响应式 ============ */
/* 平板端 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .letter-modal {
    width: 94%;
    max-width: 480px;
    max-height: 88vh;
  }
  .letter-paper-wrap {
    padding: 24px 28px 22px;
  }
  .letter-title {
    font-size: 22px;
  }
  .letter-paragraph {
    font-size: 15px;
    line-height: 30px;
  }
  .letter-content {
    max-height: 64vh;
  }
}

/* 手机端 (<= 480px) */
@media (max-width: 480px) {
  .letter-modal {
    width: 94%;
    max-width: 100%;
    max-height: 90vh;
  }
  .letter-paper-wrap {
    padding: 20px 18px 16px;
  }
  .letter-paper-wrap::before {
    inset: 5px;
  }
  .close-btn {
    top: -12px;
    right: -12px;
    width: 36px;
    height: 36px;
    font-size: 14px;
    border-width: 2px;
  }
  .paper-top {
    top: 8px;
    gap: 36px;
  }
  .paper-hole {
    width: 12px;
    height: 12px;
  }
  .letter-content {
    max-height: 62vh;
    padding-right: 4px;
  }
  .letter-title {
    font-size: 19px;
    letter-spacing: 0.5px;
  }
  .letter-date {
    font-size: 11px;
    margin-bottom: 18px;
  }
  .letter-body {
    gap: 14px;
    margin-bottom: 18px;
  }
  .letter-paragraph {
    font-size: 14px;
    line-height: 26px;
    text-indent: 2em;
    letter-spacing: 0.3px;
  }
  .letter-sign {
    margin-top: 22px;
    padding-top: 14px;
    gap: 10px;
  }
  .sign-line {
    font-size: 11px;
    letter-spacing: 1px;
  }
  .sign-name {
    font-size: 15px;
  }
  .typing-progress {
    margin: 14px -4px -4px;
  }
  .skip-btn {
    padding: 5px 14px;
    font-size: 11px;
    margin: 12px auto -2px;
  }
  .petal-fall {
    font-size: 16px;
  }
}
</style>
