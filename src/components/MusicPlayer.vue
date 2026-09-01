<template>
  <div class="player-container" :class="{ 'player-open': isOpen }">
    <!-- 迷你模式按钮 -->
    <button
      class="mini-toggle"
      @click="toggleOpen"
      :class="{ flipped: isOpen }"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path
          d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
        />
      </svg>
    </button>

    <!-- 展开的播放器 -->
    <div class="music-player" :class="{ 'is-playing': isPlaying }">
      <!-- 顶部歌曲信息 + 封面 -->
      <div class="player-header">
        <div class="cover-wrap">
          <div class="cover-outer">
            <div class="cover-inner" :class="{ spinning: isPlaying }">
              <div class="cover-art">
                <svg viewBox="0 0 200 200" class="cover-svg">
                  <defs>
                    <linearGradient
                      id="coverGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #ff9a8b; stop-opacity: 1"
                      />
                      <stop
                        offset="35%"
                        style="stop-color: #ffa8c5; stop-opacity: 1"
                      />
                      <stop
                        offset="70%"
                        style="stop-color: #87ceeb; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #b0e0e6; stop-opacity: 1"
                      />
                    </linearGradient>
                    <linearGradient
                      id="sunGrad"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" style="stop-color: #fff8dc" />
                      <stop offset="100%" style="stop-color: #ffd700" />
                    </linearGradient>
                  </defs>
                  <rect width="200" height="200" fill="url(#coverGrad)" />
                  <!-- 海面 -->
                  <path
                    d="M0 120 Q50 110 100 120 T200 120 L200 200 L0 200 Z"
                    fill="rgba(0,105,148,0.4)"
                  />
                  <path
                    d="M0 135 Q50 128 100 135 T200 135"
                    stroke="rgba(255,255,255,0.4)"
                    stroke-width="2"
                    fill="none"
                  />
                  <path
                    d="M0 150 Q50 143 100 150 T200 150"
                    stroke="rgba(255,255,255,0.3)"
                    stroke-width="1.5"
                    fill="none"
                  />
                  <!-- 太阳 -->
                  <circle
                    cx="140"
                    cy="65"
                    r="28"
                    fill="url(#sunGrad)"
                    opacity="0.95"
                  />
                  <!-- S路 -->
                  <path
                    d="M0 200 C40 195 60 175 80 160 C100 145 90 125 110 110 C130 95 160 90 180 70 L200 50 L200 0 L0 0 Z"
                    fill="rgba(139,111,71,0.3)"
                  />
                  <!-- 房子 -->
                  <g transform="translate(35,140)">
                    <rect
                      x="0"
                      y="10"
                      width="25"
                      height="22"
                      fill="#FFFAF0"
                      stroke="#CD5C5C"
                      stroke-width="1"
                    />
                    <polygon points="-3,10 28,10 12.5,-6" fill="#CD5C5C" />
                    <rect x="5" y="20" width="5" height="7" fill="#87CEEB" />
                    <rect x="15" y="20" width="5" height="7" fill="#87CEEB" />
                  </g>
                  <g transform="translate(95,128) scale(0.85)">
                    <rect
                      x="0"
                      y="10"
                      width="25"
                      height="22"
                      fill="#FFFAF0"
                      stroke="#CD5C5C"
                      stroke-width="1"
                    />
                    <polygon points="-3,10 28,10 12.5,-6" fill="#CD5C5C" />
                  </g>
                  <!-- 小花 -->
                  <g fill="#FF6B9D">
                    <circle cx="20" cy="190" r="2" />
                    <circle cx="55" cy="186" r="1.5" fill="#FFB6C1" />
                    <circle cx="120" cy="193" r="2" fill="#FF69B4" />
                    <circle cx="155" cy="188" r="1.5" fill="#FFA07A" />
                  </g>
                  <!-- 海鸥 -->
                  <path
                    d="M50 45 Q55 40 60 45 Q65 40 70 45"
                    stroke="#5C4033"
                    stroke-width="1.5"
                    fill="none"
                  />
                  <path
                    d="M75 30 Q80 25 85 30 Q90 25 95 30"
                    stroke="#5C4033"
                    stroke-width="1.2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <!-- 中心孔 -->
            <div class="cover-center"></div>
          </div>
          <!-- 唱臂 -->
          <div class="tone-arm" :class="{ 'arm-play': isPlaying }">
            <div class="arm-pivot"></div>
            <div class="arm-bar"></div>
            <div class="arm-head"></div>
          </div>
        </div>

        <!-- 歌曲信息 -->
        <div class="song-info">
          <div class="song-name">{{ currentSong.name }}</div>
          <div class="song-artist">{{ currentSong.artist }}</div>
          <div class="song-tag">
            <span class="tag tag-blue">海边</span>
            <span class="tag tag-pink">温柔</span>
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-wrap" @click="seekTo">
        <div class="progress-bg">
          <div
            class="progress-buffer"
            :style="{ width: bufferPercent + '%' }"
          ></div>
          <div class="progress-bar" :style="{ width: progressPercent + '%' }">
            <div class="progress-dot"></div>
          </div>
        </div>
        <div class="progress-labels">
          <span class="time-current">{{ formatTime(currentTime) }}</span>
          <span class="time-total">{{ formatTime(currentSong.duration) }}</span>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <button class="ctrl-btn btn-mode" @click="toggleMode" :title="modeText">
          <svg
            v-if="playMode === 'loop'"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"
            />
          </svg>
          <svg
            v-else-if="playMode === 'single'"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"
            />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"
            />
          </svg>
        </button>

        <button class="ctrl-btn btn-prev" @click="prevSong" title="上一首">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          class="ctrl-btn btn-play"
          @click="togglePlay"
          :title="isPlaying ? '暂停' : '播放'"
        >
          <div class="play-inner">
            <svg
              v-if="!isPlaying"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="currentColor"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </div>
          <div v-if="isPlaying" class="play-ripple"></div>
        </button>

        <button class="ctrl-btn btn-next" @click="nextSong" title="下一首">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        <button
          class="ctrl-btn btn-list"
          @click="showList = !showList"
          :class="{ active: showList }"
          title="播放列表"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path
              d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"
            />
          </svg>
        </button>
      </div>

      <!-- 音量 -->
      <div class="volume-wrap">
        <button
          class="vol-btn"
          @click="toggleMute"
          :title="isMuted ? '取消静音' : '静音'"
        >
          <svg
            v-if="isMuted || volume === 0"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
          >
            <path
              d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
            />
          </svg>
          <svg
            v-else-if="volume < 0.5"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
          >
            <path d="M7 9v6h4l5 5V4l-5 5H7z" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
          >
            <path
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
            />
          </svg>
        </button>
        <div class="vol-slider" @click="setVolume">
          <div class="vol-track">
            <div
              class="vol-fill"
              :style="{ width: (isMuted ? 0 : volume * 100) + '%' }"
            ></div>
            <div
              class="vol-thumb"
              :style="{ left: (isMuted ? 0 : volume * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 播放列表 -->
      <Transition name="list">
        <div v-if="showList" class="playlist">
          <div class="playlist-header">
            <span class="pl-title">♪ 播放列表</span>
            <span class="pl-count">共 {{ songs.length }} 首</span>
          </div>
          <div class="playlist-body">
            <div
              v-for="(song, idx) in songs"
              :key="idx"
              class="pl-item"
              :class="{
                active: idx === currentIndex,
                playing: idx === currentIndex && isPlaying,
              }"
              @click="playSong(idx)"
            >
              <div class="pl-idx">
                <span v-if="idx !== currentIndex || !isPlaying">{{
                  idx + 1
                }}</span>
                <span v-else class="playing-icon">
                  <i class="bar bar-1"></i>
                  <i class="bar bar-2"></i>
                  <i class="bar bar-3"></i>
                </span>
              </div>
              <div class="pl-info">
                <div class="pl-name">{{ song.name }}</div>
                <div class="pl-artist">{{ song.artist }}</div>
              </div>
              <div class="pl-dur">{{ formatTime(song.duration) }}</div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 播放时的频谱可视化 -->
      <div v-if="isPlaying" class="visualizer">
        <i
          v-for="n in 28"
          :key="n"
          class="viz-bar"
          :style="{
            animationDelay: n * 0.07 + 's',
            height: getBarHeight(n) + '%',
          }"
        ></i>
      </div>
    </div>
  </div>

  <!-- 隐藏的音频元素（用 Web Audio API 合成演示音效） -->
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const isOpen = ref(true);
const isPlaying = ref(false);
const showList = ref(false);
const currentTime = ref(0);
const volume = ref(0.7);
const isMuted = ref(false);
const playMode = ref("loop"); // loop | single | random
const currentIndex = ref(0);
const bufferPercent = ref(0);

const songs = [
  { name: "海边的小房子", artist: "Habibi Band", duration: 245 },
  { name: "S公路上的阳光", artist: "海风合唱团", duration: 198 },
  { name: "写给你的信", artist: "猫头鹰邮递员", duration: 312 },
  { name: "花落的声音", artist: "夏日乐团", duration: 226 },
  { name: "浪花朵朵开", artist: "Habibi Band", duration: 278 },
];

const currentSong = computed(() => songs[currentIndex.value]);

const progressPercent = computed(() => {
  return (currentTime.value / currentSong.value.duration) * 100;
});

const modeText = computed(
  () =>
    ({
      loop: "列表循环",
      single: "单曲循环",
      random: "随机播放",
    })[playMode.value],
);

// Web Audio API 合成音效
let audioCtx = null;
let playInterval = null;
let vizInterval = null;
const barHeights = ref(new Array(28).fill(20));

const getBarHeight = (n) => barHeights.value[n - 1] || 20;

const initAudio = () => {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio 不支持，仅演示动画");
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
};

// 播放一个音符
const playNote = (freq, dur = 0.3) => {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      volume.value * 0.35,
      audioCtx.currentTime + 0.02,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {}
};

// C大调简单旋律循环（海边温柔风）
const melody = [
  // 频率(Hz), 时长系数
  [523.25, 1],
  [587.33, 1],
  [659.25, 1.5],
  [587.33, 0.5],
  [523.25, 1],
  [659.25, 1],
  [783.99, 2],
  [698.46, 1],
  [659.25, 1],
  [587.33, 1.5],
  [523.25, 0.5],
  [587.33, 1],
  [523.25, 1],
  [440.0, 2],
];
let noteIdx = 0;
let noteTimeLeft = 0;

const togglePlay = () => {
  initAudio();
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

const play = () => {
  isPlaying.value = true;
  bufferPercent.value = 85 + Math.random() * 15;
  // 主播放循环 - 推进时间 + 播放音符
  let last = performance.now();
  noteTimeLeft = 0;
  noteIdx = 0;

  playInterval = setInterval(() => {
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;

    currentTime.value += dt;
    if (currentTime.value >= currentSong.value.duration) {
      handleEnded();
      return;
    }

    // 音符调度
    noteTimeLeft -= dt;
    if (noteTimeLeft <= 0) {
      const [freq, beats] = melody[noteIdx % melody.length];
      const dur = beats * 0.35;
      if (!isMuted.value) playNote(freq, dur);
      noteTimeLeft = dur;
      noteIdx++;
    }
  }, 50);

  // 频谱动画
  vizInterval = setInterval(() => {
    barHeights.value = barHeights.value.map(() => {
      const base = isMuted.value ? 5 : volume.value * 60;
      return Math.max(8, base + Math.random() * 35);
    });
  }, 90);
};

const pause = () => {
  isPlaying.value = false;
  clearInterval(playInterval);
  clearInterval(vizInterval);
  playInterval = null;
  vizInterval = null;
  barHeights.value = new Array(28).fill(15);
};

const handleEnded = () => {
  if (playMode.value === "single") {
    currentTime.value = 0;
    play();
    return;
  }
  if (playMode.value === "random") {
    let idx;
    do {
      idx = Math.floor(Math.random() * songs.length);
    } while (songs.length > 1 && idx === currentIndex.value);
    playSong(idx);
    return;
  }
  // loop
  if (currentIndex.value === songs.length - 1) {
    playSong(0);
  } else {
    nextSong();
  }
};

const playSong = (idx) => {
  pause();
  currentIndex.value = idx;
  currentTime.value = 0;
  setTimeout(() => play(), 50);
};

const prevSong = () => {
  const idx =
    currentIndex.value <= 0 ? songs.length - 1 : currentIndex.value - 1;
  playSong(idx);
};
const nextSong = () => {
  const idx =
    currentIndex.value >= songs.length - 1 ? 0 : currentIndex.value + 1;
  playSong(idx);
};

const toggleMode = () => {
  playMode.value = { loop: "single", single: "random", random: "loop" }[
    playMode.value
  ];
};

const seekTo = (e) => {
  const rect = e.currentTarget
    .querySelector(".progress-bg")
    .getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  currentTime.value = ratio * currentSong.value.duration;
};

const setVolume = (e) => {
  const rect = e.currentTarget
    .querySelector(".vol-track")
    .getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  volume.value = ratio;
  isMuted.value = ratio === 0;
};
const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

const formatTime = (sec) => {
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
};

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

watch(isMuted, (val) => {
  if (val) barHeights.value = new Array(28).fill(8);
});

onUnmounted(() => {
  pause();
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch (e) {}
  }
});
</script>

<style lang="scss" scoped>
.player-container {
  --player-h: var(--music-player-h, 25vh);
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.player-container:not(.player-open) {
  transform: translate(calc(100% + 20px), -50%);
  & .mini-toggle {
    transform: translateX(-70px) rotate(180deg);
  }
  & .mini-toggle.flipped {
    transform: translateX(-70px) rotate(0deg);
  }
}

.mini-toggle {
  position: absolute;
  left: -10px;
  top: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  color: #ff6b9d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 5;
  &:hover {
    background: #ff6b9d;
    color: #fff;
    transform: translateX(-70px) scale(1.1);
  }
}

/* ============ 播放器主体 ============ */
.music-player {
  position: relative;
  width: min(calc(var(--player-h) * 1.8), 360px);
  min-width: 260px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 22px;
  padding: 20px 20px 18px;
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset,
    0 0 60px rgba(255, 182, 193, 0.2);
  overflow: hidden;
}

.is-playing {
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset,
    0 0 80px rgba(255, 107, 157, 0.35);
}

/* ===== 顶部 ===== */
.player-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

/* 封面 */
.cover-wrap {
  position: relative;
  width: calc(var(--player-h) * 0.42);
  height: calc(var(--player-h) * 0.42);
  flex-shrink: 0;
}
.cover-outer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    #1a1a1a 0%,
    #2a2a2a 55%,
    #3a3a3a 100%
  );
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.35),
    inset 0 0 0 6px rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.cover-inner {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.6);
}
.cover-inner.spinning {
  animation: spin 18s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.cover-art {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}
.cover-svg {
  width: 100%;
  height: 100%;
  display: block;
}
.cover-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  background: radial-gradient(circle, #fff 30%, #e8e8e8 60%, #888 100%);
  border-radius: 50%;
  box-shadow:
    0 0 0 3px #1a1a1a,
    0 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 3;
}

/* 唱臂 */
.tone-arm {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 60px;
  height: 60px;
  transform-origin: 90% 10%;
  transform: rotate(-35deg);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 5;
  pointer-events: none;
}
.tone-arm.arm-play {
  transform: rotate(-5deg);
}
.arm-pivot {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background: radial-gradient(circle, #c0c0c0, #808080);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
.arm-bar {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 50px;
  height: 4px;
  background: linear-gradient(90deg, #a0a0a0, #d0d0d0);
  border-radius: 2px;
  transform-origin: right center;
  transform: rotate(35deg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.arm-head {
  position: absolute;
  top: 40px;
  left: 2px;
  width: 10px;
  height: 16px;
  background: linear-gradient(180deg, #555, #333);
  border-radius: 2px;
  transform: rotate(-20deg);
}

/* 歌曲信息 */
.song-info {
  flex: 1;
  min-width: 0;
}
.song-name {
  font-size: 17px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-artist {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-tag {
  display: flex;
  gap: 6px;
}
.tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}
.tag-blue {
  background: rgba(135, 206, 235, 0.25);
  color: #4a90b8;
}
.tag-pink {
  background: rgba(255, 182, 193, 0.3);
  color: #d85887;
}

/* ===== 进度条 ===== */
.progress-wrap {
  cursor: pointer;
  margin-bottom: 14px;
  user-select: none;
}
.progress-bg {
  position: relative;
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  overflow: visible;
}
.progress-buffer {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  transition: width 0.3s ease;
}
.progress-bar {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, #ff9a8b, #ff6b9d);
  border-radius: 2px;
  transition: width 0.1s linear;
}
.progress-dot {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 0 0 2px #ff6b9d,
    0 2px 6px rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.progress-wrap:hover .progress-dot {
  opacity: 1;
}
.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #999;
  margin-top: 5px;
  font-family: "Helvetica Neue", monospace;
}

/* ===== 控制按钮 ===== */
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 0 4px;
}
.ctrl-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #555;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  position: relative;
  &:hover {
    color: #ff6b9d;
    background: rgba(255, 107, 157, 0.1);
    transform: scale(1.12);
  }
}
.ctrl-btn.active {
  color: #ff6b9d;
}

.btn-play {
  width: 58px;
  height: 58px;
  background: linear-gradient(135deg, #ff9a8b 0%, #ff6b9d 50%, #ff6b6b 100%);
  color: #fff !important;
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.45);
  &:hover {
    background: linear-gradient(135deg, #ff8b7c, #ff5c8e, #ff5c5c);
    box-shadow: 0 8px 25px rgba(255, 107, 157, 0.6);
    transform: scale(1.08);
  }
}
.play-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid #ff6b9d;
  opacity: 0;
  animation: ripple 1.5s ease-out infinite;
}
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}

/* ===== 音量 ===== */
.volume-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 4px 4px;
}
.vol-btn {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  display: flex;
  transition: all 0.2s ease;
  &:hover {
    color: #ff6b9d;
  }
}
.vol-slider {
  flex: 1;
  cursor: pointer;
  padding: 6px 0;
}
.vol-track {
  position: relative;
  height: 3px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 2px;
}
.vol-fill {
  height: 100%;
  background: linear-gradient(90deg, #87ceeb, #ff6b9d);
  border-radius: 2px;
  transition: width 0.15s ease;
}
.vol-thumb {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow:
    0 0 0 2px #ff6b9d,
    0 1px 4px rgba(0, 0, 0, 0.2);
  transition: left 0.15s ease;
}

/* ===== 播放列表 ===== */
.playlist {
  margin-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 12px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.35s ease;
  overflow: hidden;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}
.list-enter-to,
.list-leave-from {
  max-height: 260px;
}
.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 8px;
}
.pl-title {
  font-size: 13px;
  font-weight: bold;
  color: #555;
}
.pl-count {
  font-size: 11px;
  color: #999;
}
.playlist-body {
  max-height: 210px;
  overflow-y: auto;
}
.pl-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(255, 107, 157, 0.08);
  }
  &.active {
    background: linear-gradient(
      90deg,
      rgba(255, 154, 139, 0.18),
      rgba(255, 107, 157, 0.12)
    );
  }
}
.pl-idx {
  width: 20px;
  text-align: center;
  font-size: 12px;
  color: #999;
  font-family: monospace;
}
.pl-item.active .pl-idx {
  color: #ff6b9d;
}
.playing-icon {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}
.playing-icon .bar {
  width: 3px;
  background: #ff6b9d;
  border-radius: 2px;
  animation: playBars 0.9s ease-in-out infinite;
}
.bar-1 {
  height: 30%;
  animation-delay: -0.3s;
}
.bar-2 {
  height: 70%;
  animation-delay: -0.15s;
}
.bar-3 {
  height: 50%;
}
@keyframes playBars {
  0%,
  100% {
    transform: scaleY(0.4);
  }
  50% {
    transform: scaleY(1);
  }
}
.pl-info {
  flex: 1;
  min-width: 0;
}
.pl-name {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pl-item.active .pl-name {
  color: #ff6b9d;
  font-weight: 500;
}
.pl-artist {
  font-size: 10px;
  color: #999;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pl-dur {
  font-size: 10px;
  color: #bbb;
  font-family: monospace;
}

/* ===== 频谱 ===== */
.visualizer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  padding: 0 20px;
  pointer-events: none;
  opacity: 0.4;
}
.viz-bar {
  width: 3px;
  background: linear-gradient(180deg, #ff6b9d, #ff9a8b, #87ceeb);
  border-radius: 2px 2px 0 0;
  animation: vizAnim 0.8s ease-in-out infinite alternate;
  transition: height 0.08s ease;
}
@keyframes vizAnim {
  from {
    transform: scaleY(0.4);
  }
  to {
    transform: scaleY(1);
  }
}

/* ============ 响应式 ============ */
/* 平板端 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .player-container {
    right: 16px;
    top: auto;
    bottom: 20px;
    transform: none;
  }
  .player-container:not(.player-open) {
    transform: translateX(calc(100% + 10px));
  }
  .music-player {
    width: 280px;
    padding: 16px 16px 14px;
    border-radius: 18px;
  }
  .player-header {
    gap: 12px;
    margin-bottom: 14px;
  }
  .cover-wrap {
    width: 90px;
    height: 90px;
  }
  .song-name {
    font-size: 15px;
  }
  .btn-play {
    width: 50px;
    height: 50px;
  }
}

/* 手机端 (<= 480px) */
@media (max-width: 480px) {
  .player-container {
    right: 0;
    left: 0;
    top: auto;
    bottom: 0;
    transform: none;
    align-items: center;
    padding: 0 12px calc(12px + env(safe-area-inset-bottom));
  }
  .player-container:not(.player-open) {
    transform: translateY(calc(100% + 20px));
  }
  .player-container:not(.player-open) .mini-toggle {
    transform: translateY(-60px) rotate(180deg);
  }
  .player-container:not(.player-open) .mini-toggle.flipped {
    transform: translateY(-60px) rotate(0deg);
  }
  .mini-toggle {
    left: 50%;
    top: -50px;
    transform: translateX(-50%);
  }
  .mini-toggle:hover {
    transform: translateX(-50%) scale(1.1);
  }
  .music-player {
    width: 100%;
    max-width: 360px;
    padding: 14px 16px 12px;
    border-radius: 18px;
  }
  .player-header {
    gap: 12px;
    margin-bottom: 12px;
  }
  .cover-wrap {
    width: 72px;
    height: 72px;
  }
  .tone-arm {
    width: 44px;
    height: 44px;
    top: -6px;
    right: -6px;
  }
  .arm-bar {
    width: 38px;
    top: 5px;
    right: 5px;
  }
  .arm-head {
    top: 30px;
    left: 1px;
  }
  .song-name {
    font-size: 14px;
  }
  .song-artist {
    font-size: 12px;
    margin-bottom: 6px;
  }
  .tag {
    font-size: 9px;
    padding: 1px 6px;
  }
  .progress-wrap {
    margin-bottom: 10px;
  }
  .controls {
    margin-bottom: 10px;
  }
  .btn-play {
    width: 46px;
    height: 46px;
  }
  .btn-play svg {
    width: 26px;
    height: 26px;
  }
  .btn-prev svg,
  .btn-next svg {
    width: 22px;
    height: 22px;
  }
  .btn-mode svg,
  .btn-list svg {
    width: 17px;
    height: 17px;
  }
  .volume-wrap {
    gap: 8px;
    padding-bottom: 2px;
  }
  .visualizer {
    height: 20px;
    padding: 0 16px;
  }
}
</style>
