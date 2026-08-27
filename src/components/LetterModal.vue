<template>
  <Transition name="modal">
    <div v-if="visible" class="letter-modal-overlay" @click.self="close">
      <!-- 飘落的花瓣装饰 -->
      <div v-for="i in 15" :key="'p'+i" class="petal-fall" :style="getPetalStyle(i)">🌸</div>
      
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
          
          <div class="letter-content">
            <h2 class="letter-title">{{ titleText }}</h2>
            
            <div class="letter-date">{{ dateText }}</div>
            
            <div class="letter-body">
              <p v-for="(para, pIdx) in paragraphs" :key="'p'+pIdx" class="letter-paragraph">
                <span class="typed-text" v-html="getParagraph(pIdx)"></span>
                <span v-if="isTyping && currentPara === pIdx" class="cursor">|</span>
              </p>
            </div>
            
            <div class="letter-sign">
              <div class="sign-line" v-show="currentPara >= paragraphs.length">
                <span class="typed-sign">{{ signText }}</span>
              </div>
              <div class="sign-name" v-show="currentPara >= paragraphs.length + 1">
                <span class="typed-sign-name">{{ nameText }}</span>
              </div>
            </div>
          </div>
          
          <!-- 打字进度条 -->
          <div class="typing-progress" v-if="isTyping">
            <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
          </div>
          
          <!-- 跳过按钮 -->
          <button v-if="isTyping" class="skip-btn" @click="skipTyping">
            <span>跳过打字效果</span>
            <span class="skip-arrow">→</span>
          </button>
          
          <!-- 底部装饰 -->
          <div class="paper-bottom">
            <svg class="decor-wave" viewBox="0 0 400 20" preserveAspectRatio="none">
              <path d="M0,10 Q50,0 100,10 T200,10 T300,10 T400,10" stroke="#E8DCC8" stroke-width="2" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['close'])

// 信件内容
const titleText = '💌 亲爱的 Habibi：'
const dateText = '2026年8月25日 · 阳光明媚的海边小屋'
const paragraphs = [
  '当你看到这封信的时候，窗外的海风正轻拂着白房子的屋顶，路边的小花儿们在阳光里摇曳着，像是在和你招手呢~',
  '记得我们说好要一起去看海的吗？S弯的公路会带我们穿过所有美好的风景，每一栋白色的小房子都藏着一个温暖的故事，每一朵盛开的花儿都为你准备了一个甜蜜的心愿。',
  '此刻的我，正坐在阳光里为你写下这些字。希望这封信能像海风一样，轻轻抱抱你；希望你打开播放器的时候，那首歌能替我说尽所有温柔；希望你知道，不管今天过得怎么样，总有一个人在惦记你呀。',
  '愿你每天都有好心情，像海边的阳光一样灿烂；愿你所有的愿望，都能像路旁的花儿一样慢慢绽放；愿你永远是那个被世界温柔以待的 Habibi。'
]
const signText = '—— 来自海边小屋的问候 ——'
const nameText = '🌊  永远的海边小伙伴  🌊'

// 打字状态
const currentPara = ref(0)
const currentChar = ref(0)
const isTyping = ref(false)
let typeTimer = null

// 各段落已显示文本
const displayedParas = ref(paragraphs.map(() => ''))
const displayedSign = ref('')
const displayedName = ref('')

const totalChars = computed(() => {
  return paragraphs.reduce((sum, p) => sum + p.length, 0) + signText.length + nameText.length
})

const typedChars = computed(() => {
  let count = 0
  for (let i = 0; i < Math.min(currentPara.value, paragraphs.length); i++) {
    count += paragraphs[i].length
  }
  if (currentPara.value < paragraphs.length) {
    count += currentChar.value
  } else if (currentPara.value === paragraphs.length) {
    count += displayedSign.value.length
  } else {
    count += signText.length + displayedName.value.length
  }
  return count
})

const progressPercent = computed(() => {
  return Math.min(100, (typedChars.value / totalChars.value) * 100)
})

const getParagraph = (idx) => displayedParas.value[idx]

const getPetalStyle = (i) => {
  const left = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 4 + Math.random() * 4
  const size = 0.8 + Math.random() * 0.8
  const rot = Math.random() * 360
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    transform: `scale(${size}) rotate(${rot}deg)`
  }
}

const typeChar = () => {
  if (currentPara.value < paragraphs.length) {
    const para = paragraphs[currentPara.value]
    if (currentChar.value < para.length) {
      // 处理 HTML 实体和 emoji
      let step = 1
      const ch = para.charAt(currentChar.value)
      const code = para.charCodeAt(currentChar.value)
      // emoji 代理对
      if (code >= 0xD800 && code <= 0xDBFF && currentChar.value + 1 < para.length) {
        step = 2
      }
      displayedParas.value[currentPara.value] = para.substring(0, currentChar.value + step)
      currentChar.value += step
      
      const randDelay = ch === '，' || ch === '。' || ch === '！' || ch === '？' || ch === '~'
        ? 150 + Math.random() * 100
        : 50 + Math.random() * 50
      typeTimer = setTimeout(typeChar, randDelay)
    } else {
      currentPara.value++
      currentChar.value = 0
      typeTimer = setTimeout(typeChar, 400)
    }
  } else if (currentPara.value === paragraphs.length) {
    if (displayedSign.value.length < signText.length) {
      displayedSign.value = signText.substring(0, displayedSign.value.length + 1)
      typeTimer = setTimeout(typeChar, 80)
    } else {
      currentPara.value++
      typeTimer = setTimeout(typeChar, 300)
    }
  } else if (currentPara.value === paragraphs.length + 1) {
    if (displayedName.value.length < nameText.length) {
      displayedName.value = nameText.substring(0, displayedName.value.length + 1)
      typeTimer = setTimeout(typeChar, 80)
    } else {
      currentPara.value++
      isTyping.value = false
    }
  }
}

const startTyping = () => {
  currentPara.value = 0
  currentChar.value = 0
  isTyping.value = true
  displayedParas.value = paragraphs.map(() => '')
  displayedSign.value = ''
  displayedName.value = ''
  clearTimeout(typeTimer)
  typeTimer = setTimeout(typeChar, 500)
}

const skipTyping = () => {
  clearTimeout(typeTimer)
  displayedParas.value = [...paragraphs]
  displayedSign.value = signText
  displayedName.value = nameText
  currentPara.value = paragraphs.length + 2
  isTyping.value = false
}

const close = () => {
  clearTimeout(typeTimer)
  emit('close')
}

watch(() => props.visible, (val) => {
  if (val) {
    startTyping()
  }
})

onUnmounted(() => {
  clearTimeout(typeTimer)
})
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

/* 飘花 */
.petal-fall {
  position: absolute;
  top: -30px;
  font-size: 20px;
  animation: petalFall linear infinite;
  pointer-events: none;
}
@keyframes petalFall {
  0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(110vh) translateX(80px) rotate(540deg); opacity: 0; }
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
  top: -14px; right: -14px;
  width: 42px; height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
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
    background: linear-gradient(135deg, #EE5A5A, #D94848);
  }
}

/* 信纸包裹 */
.letter-paper-wrap {
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, #FFFEF7 0%, #FFF9E8 100%);
  border-radius: 6px;
  box-shadow: 
    0 25px 60px rgba(0,0,0,0.35),
    0 0 0 1px rgba(139, 119, 101, 0.15),
    inset 0 0 60px rgba(222, 184, 135, 0.15);
  padding: 30px 38px 28px;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(205, 175, 140, 0.4);
    border-radius: 3px;
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      repeating-linear-gradient(
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
  top: 10px; left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 50px;
  z-index: 2;
}
.paper-hole {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #87CEEB;
  box-shadow: 
    inset 0 2px 3px rgba(0,0,0,0.2),
    0 1px 1px rgba(255,255,255,0.8);
}

.letter-content {
  position: relative;
  z-index: 2;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 6px;
}

.letter-title {
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 26px;
  color: #8B4513;
  margin-bottom: 8px;
  text-align: center;
  font-weight: normal;
  letter-spacing: 1px;
}

.letter-date {
  text-align: center;
  font-size: 13px;
  color: #A0826D;
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
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 16px;
  line-height: 32px;
  color: #5C4033;
  text-indent: 2em;
  text-align: justify;
  letter-spacing: 0.5px;
  margin: 0;
}

/* 打字光标 */
.cursor {
  display: inline-block;
  color: #FF6B6B;
  font-weight: bold;
  font-size: 18px;
  margin-left: 2px;
  animation: cursorBlink 0.8s step-end infinite;
}
@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
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
  color: #A0826D;
  letter-spacing: 2px;
}

.sign-name {
  font-family: 'Pacifico', cursive;
  font-size: 18px;
  color: #CD5C5C;
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
  background: linear-gradient(90deg, #FFB347, #FF6B9D, #FF6B6B);
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
  color: #A0826D;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  font-family: inherit;
  &:hover {
    background: rgba(205, 175, 140, 0.15);
    border-color: #CDAF8C;
    color: #8B4513;
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
  .cursor {
    font-size: 15px;
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
