<template>
  <div class="owl-container" :class="{ 'letter-flying': isOpening }">
    <!-- 光晕 -->
    <div class="halo"></div>
    <span class="sparkle sp-1" :class="{ on: !isOpening }">✦</span>
    <span class="sparkle sp-2" :class="{ on: !isOpening }">✧</span>
    <span class="sparkle sp-3" :class="{ on: !isOpening }">✦</span>

    <!-- 猫头鹰 SVG 本体 -->
    <div class="owl-wrap" :class="{ idle: !isOpening }">
      <svg
        class="owl-svg"
        viewBox="0 0 260 340"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- 身体羽毛（褐灰渐变） -->
          <linearGradient id="bodyG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#7A6043" />
            <stop offset="45%" stop-color="#9C7E5A" />
            <stop offset="100%" stop-color="#5E472F" />
          </linearGradient>
          <!-- 胸羽（米白+条纹阴影） -->
          <linearGradient id="bellyG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#F5E6C8" />
            <stop offset="60%" stop-color="#E4CF9F" />
            <stop offset="100%" stop-color="#C9AE79" />
          </linearGradient>
          <!-- 脸盘 -->
          <radialGradient id="faceG" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stop-color="#FFF8E1" />
            <stop offset="55%" stop-color="#F0DFB0" />
            <stop offset="100%" stop-color="#C9AE79" />
          </radialGradient>
          <!-- 翅膀羽（深褐） -->
          <linearGradient id="wingG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6B5032" />
            <stop offset="100%" stop-color="#4A3720" />
          </linearGradient>
          <!-- 耳羽 -->
          <linearGradient id="earG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8A6A46" />
            <stop offset="100%" stop-color="#5E442A" />
          </linearGradient>
          <!-- 喙（下深上浅） -->
          <linearGradient id="beakG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFD580" />
            <stop offset="40%" stop-color="#F2A63A" />
            <stop offset="100%" stop-color="#C76D12" />
          </linearGradient>
          <!-- 虹膜（金绿） -->
          <radialGradient id="irisG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#E8C547" />
            <stop offset="55%" stop-color="#B8951D" />
            <stop offset="100%" stop-color="#6E5408" />
          </radialGradient>
          <!-- 巩膜 -->
          <radialGradient id="scleraG" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#E4D9BD" />
          </radialGradient>
          <!-- 爪 -->
          <linearGradient id="clawG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#F0C570" />
            <stop offset="100%" stop-color="#A66A18" />
          </linearGradient>
          <!-- 蜡封 -->
          <radialGradient id="sealG" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#FF836A" />
            <stop offset="45%" stop-color="#E2403A" />
            <stop offset="100%" stop-color="#870F0F" />
          </radialGradient>
          <!-- 信封纸 -->
          <linearGradient id="envG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FBEFCD" />
            <stop offset="55%" stop-color="#EED9A3" />
            <stop offset="100%" stop-color="#D2B676" />
          </linearGradient>
          <!-- 信封折缝色 -->
          <linearGradient id="envFoldG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#C8A869" />
            <stop offset="100%" stop-color="#9A7C42" />
          </linearGradient>

          <!-- 羽毛软阴影 -->
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow
              dx="2"
              dy="6"
              stdDeviation="5"
              flood-color="#000"
              flood-opacity="0.3"
            />
          </filter>
        </defs>

        <!-- ========== 身体（底层） ========== -->
        <g filter="url(#shadow)">
          <!-- 身体 -->
          <ellipse cx="130" cy="185" rx="88" ry="115" fill="url(#bodyG)" />
          <!-- 身体羽毛层叠：从浅到深弧形纹路 -->
          <g fill="none" stroke="#3E2A14" stroke-width="1" opacity="0.4">
            <path d="M 60,140 Q 130,160 200,140" />
            <path d="M 52,170 Q 130,195 208,170" />
            <path d="M 48,202 Q 130,232 212,202" />
            <path d="M 50,235 Q 130,268 210,235" />
            <path d="M 58,268 Q 130,295 202,268" />
          </g>
          <!-- 腹羽（竖条斑点） -->
          <g opacity="0.55">
            <ellipse
              v-for="n in 8"
              :key="'bp1-' + n"
              :cx="70 + (n % 4) * 30"
              :cy="210 + Math.floor(n / 4) * 22"
              rx="3.2"
              ry="5.5"
              fill="#5E442A"
            />
            <ellipse
              v-for="n in 6"
              :key="'bp2-' + n"
              :cx="85 + (n % 3) * 30"
              :cy="222 + Math.floor(n / 3) * 22"
              rx="3"
              ry="5"
              fill="#5E442A"
            />
          </g>

          <!-- 左翅膀 -->
          <g>
            <path
              d="M 44,150 
                     C 30,175 22,220 40,258
                     C 50,270 66,272 72,262
                     C 62,232 66,195 76,172
                     Z"
              fill="url(#wingG)"
              stroke="#2A1C0A"
              stroke-width="1"
            />
            <!-- 翅膀上的羽片 -->
            <g fill="#6B5032" stroke="#2A1C0A" stroke-width="0.6">
              <path d="M 28,178 Q 35,174 50,186 L 46,192 Q 34,186 28,186 Z" />
              <path d="M 28,200 Q 33,196 52,212 L 47,219 Q 32,209 28,208 Z" />
              <path d="M 30,224 Q 34,220 55,240 L 50,248 Q 34,236 30,234 Z" />
              <path d="M 34,248 Q 37,245 58,268 L 54,274 Q 40,262 34,258 Z" />
            </g>
            <g fill="#8A6A46" opacity="0.7">
              <path d="M 52,164 Q 56,160 68,168 L 66,174 Q 56,172 52,170 Z" />
              <path d="M 48,188 Q 52,184 68,196 L 66,202 Q 54,198 48,196 Z" />
              <path d="M 46,212 Q 50,208 70,226 L 66,232 Q 52,224 46,220 Z" />
              <path d="M 46,236 Q 48,232 72,258 L 68,264 Q 52,250 46,246 Z" />
            </g>
          </g>

          <!-- 右翅膀 -->
          <g>
            <path
              d="M 216,150 
                     C 230,175 238,220 220,258
                     C 210,270 194,272 188,262
                     C 198,232 194,195 184,172
                     Z"
              fill="url(#wingG)"
              stroke="#2A1C0A"
              stroke-width="1"
            />
            <g fill="#6B5032" stroke="#2A1C0A" stroke-width="0.6">
              <path
                d="M 232,178 Q 225,174 210,186 L 214,192 Q 226,186 232,186 Z"
              />
              <path
                d="M 232,200 Q 227,196 208,212 L 213,219 Q 228,209 232,208 Z"
              />
              <path
                d="M 230,224 Q 226,220 205,240 L 210,248 Q 226,236 230,234 Z"
              />
              <path
                d="M 226,248 Q 223,245 202,268 L 206,274 Q 220,262 226,258 Z"
              />
            </g>
            <g fill="#8A6A46" opacity="0.7">
              <path
                d="M 208,164 Q 204,160 192,168 L 194,174 Q 204,172 208,170 Z"
              />
              <path
                d="M 212,188 Q 208,184 192,196 L 194,202 Q 206,198 212,196 Z"
              />
              <path
                d="M 214,212 Q 210,208 190,226 L 194,232 Q 208,224 214,220 Z"
              />
              <path
                d="M 214,236 Q 212,232 188,258 L 192,264 Q 208,250 214,246 Z"
              />
            </g>
          </g>

          <!-- 胸羽盘（米白） -->
          <ellipse cx="130" cy="220" rx="54" ry="74" fill="url(#bellyG)" />
          <!-- 胸羽V纹（逼真斑纹） -->
          <g fill="#7A5A34" opacity="0.5">
            <path
              d="M 110,175 Q 130,186 150,175 L 146,181 Q 130,190 114,181 Z"
            />
            <path
              d="M 102,196 Q 130,210 158,196 L 154,202 Q 130,214 106,202 Z"
            />
            <path
              d="M 98,218 Q 130,234 162,218 L 158,224 Q 130,238 102,224 Z"
            />
            <path
              d="M 96,240 Q 130,258 164,240 L 160,246 Q 130,262 100,246 Z"
            />
            <path
              d="M 98,262 Q 130,282 162,262 L 158,268 Q 130,286 102,268 Z"
            />
          </g>

          <!-- 头 + 脸盘（最上层） -->
          <!-- 耳朵左 -->
          <path
            d="M 66,82 L 54,42 L 86,72 Z"
            fill="url(#earG)"
            stroke="#3E2A14"
            stroke-width="1"
          />
          <path d="M 62,70 L 60,52 L 78,66 Z" fill="#F0DFB0" opacity="0.85" />
          <!-- 耳朵右 -->
          <path
            d="M 194,82 L 206,42 L 174,72 Z"
            fill="url(#earG)"
            stroke="#3E2A14"
            stroke-width="1"
          />
          <path
            d="M 198,70 L 200,52 L 182,66 Z"
            fill="#F0DFB0"
            opacity="0.85"
          />

          <!-- 头部圆 -->
          <ellipse cx="130" cy="108" rx="76" ry="70" fill="url(#bodyG)" />
          <!-- 头顶部羽毛层次 -->
          <g fill="#5E442A" opacity="0.35">
            <path d="M 78,62 Q 130,46 182,62 L 178,68 Q 130,56 82,68 Z" />
            <path d="M 86,48 Q 130,32 174,48 L 170,54 Q 130,42 90,54 Z" />
          </g>

          <!-- 脸盘 -->
          <ellipse
            cx="130"
            cy="118"
            rx="62"
            ry="56"
            fill="url(#faceG)"
            filter="url(#soft)"
          />
          <!-- 脸盘外圈放射羽毛 -->
          <g stroke="#8A6A46" stroke-width="1" opacity="0.4" fill="none">
            <path d="M 74,92 Q 70,104 72,118" />
            <path d="M 70,118 Q 70,130 78,142" />
            <path d="M 78,144 Q 88,156 102,162" />
            <path d="M 186,92 Q 190,104 188,118" />
            <path d="M 190,118 Q 190,130 182,142" />
            <path d="M 182,144 Q 172,156 158,162" />
            <path d="M 110,66 Q 130,58 150,66" />
            <path d="M 94,72 Q 110,64 130,64" />
            <path d="M 166,72 Q 150,64 130,64" />
          </g>

          <!-- 眼眶环（羽毛环绕） -->
          <g stroke="#3E2A14" stroke-width="3" fill="none">
            <circle cx="98" cy="112" r="28" opacity="0.75" />
            <circle cx="162" cy="112" r="28" opacity="0.75" />
          </g>
          <!-- 眼眶内侧浅圈 -->
          <g stroke="#C9AE79" stroke-width="2" fill="none" opacity="0.85">
            <circle cx="98" cy="112" r="25" />
            <circle cx="162" cy="112" r="25" />
          </g>

          <!-- 眼睛：左眼 -->
          <g class="eye left-eye">
            <!-- 巩膜 -->
            <circle cx="98" cy="112" r="22" fill="url(#scleraG)" />
            <!-- 虹膜 -->
            <circle cx="98" cy="112" r="14" fill="url(#irisG)">
              <animate
                attributeName="cx"
                values="98;103;93;98;98"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="112;108;116;112;112"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <!-- 瞳孔 -->
            <circle r="7.5" fill="#0E0904">
              <animate
                attributeName="cx"
                values="98;103;93;98;98"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="112;108;116;112;112"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <!-- 瞳孔高光（双点，像玻璃球） -->
            <circle r="2.2" fill="#FFFFFF" opacity="0.95">
              <animate
                attributeName="cx"
                values="95.5;100.5;90.5;95.5;95.5"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="109.5;105.5;113.5;109.5;109.5"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="0.9" fill="#FFFFFF" opacity="0.8">
              <animate
                attributeName="cx"
                values="100.5;105.5;95.5;100.5;100.5"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="114.5;110.5;118.5;114.5;114.5"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <!-- 虹膜纹理 -->
            <g stroke="#6E5408" stroke-width="0.4" opacity="0.7">
              <line x1="98" y1="99" x2="98" y2="94" />
              <line x1="98" y1="125" x2="98" y2="130" />
              <line x1="86" y1="112" x2="81" y2="112" />
              <line x1="110" y1="112" x2="115" y2="112" />
              <line x1="89" y1="103" x2="85.5" y2="100" />
              <line x1="107" y1="121" x2="110.5" y2="124" />
            </g>
            <!-- 眨眼上眼皮 -->
            <rect
              x="70"
              y="86"
              width="56"
              height="26"
              fill="url(#bodyG)"
              opacity="0"
            >
              <animate
                attributeName="height"
                values="0;26;0"
                keyTimes="0;0.03;0.06"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </rect>
          </g>

          <!-- 眼睛：右眼（对称） -->
          <g class="eye right-eye">
            <circle cx="162" cy="112" r="22" fill="url(#scleraG)" />
            <circle cx="162" cy="112" r="14" fill="url(#irisG)">
              <animate
                attributeName="cx"
                values="162;167;157;162;162"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="112;108;116;112;112"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="7.5" fill="#0E0904">
              <animate
                attributeName="cx"
                values="162;167;157;162;162"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="112;108;116;112;112"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2.2" fill="#FFFFFF" opacity="0.95">
              <animate
                attributeName="cx"
                values="159.5;164.5;154.5;159.5;159.5"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="109.5;105.5;113.5;109.5;109.5"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="0.9" fill="#FFFFFF" opacity="0.8">
              <animate
                attributeName="cx"
                values="164.5;169.5;159.5;164.5;164.5"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="114.5;110.5;118.5;114.5;114.5"
                dur="5.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <g stroke="#6E5408" stroke-width="0.4" opacity="0.7">
              <line x1="162" y1="99" x2="162" y2="94" />
              <line x1="162" y1="125" x2="162" y2="130" />
              <line x1="150" y1="112" x2="145" y2="112" />
              <line x1="174" y1="112" x2="179" y2="112" />
              <line x1="153" y1="103" x2="149.5" y2="100" />
              <line x1="171" y1="121" x2="174.5" y2="124" />
            </g>
            <rect
              x="134"
              y="86"
              width="56"
              height="26"
              fill="url(#bodyG)"
              opacity="0"
            >
              <animate
                attributeName="height"
                values="0;26;0"
                keyTimes="0;0.03;0.06"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </rect>
          </g>

          <!-- 腮红 -->
          <ellipse
            cx="76"
            cy="136"
            rx="10"
            ry="5"
            fill="#FFB6C1"
            opacity="0.55"
            filter="url(#soft)"
          />
          <ellipse
            cx="184"
            cy="136"
            rx="10"
            ry="5"
            fill="#FFB6C1"
            opacity="0.55"
            filter="url(#soft)"
          />

          <!-- 喙（上喙 + 下喙 + 嘴缝） -->
          <!-- 上喙 -->
          <path
            d="M 120,142 Q 130,134 140,142 Q 148,152 142,164 Q 130,176 118,164 Q 112,152 120,142 Z"
            fill="url(#beakG)"
            stroke="#7A3D04"
            stroke-width="1"
          />
          <!-- 上喙中线 -->
          <path
            d="M 130,134 Q 130,152 130,166"
            stroke="#7A3D04"
            stroke-width="0.6"
            fill="none"
            opacity="0.7"
          />
          <!-- 下喙 -->
          <path
            d="M 118,164 Q 130,178 142,164 Q 138,174 130,176 Q 122,174 118,164 Z"
            fill="#C76D12"
            stroke="#5E3102"
            stroke-width="1"
            opacity="0.98"
          />
          <!-- 鼻孔 -->
          <ellipse
            cx="125"
            cy="148"
            rx="1.4"
            ry="0.9"
            fill="#5E3102"
            opacity="0.85"
          />
          <ellipse
            cx="135"
            cy="148"
            rx="1.4"
            ry="0.9"
            fill="#5E3102"
            opacity="0.85"
          />
          <!-- 喙高光 -->
          <path
            d="M 122,140 Q 130,136 130,148 Q 128,148 126,146"
            stroke="#FFE9AB"
            stroke-width="1.4"
            fill="none"
            opacity="0.75"
            stroke-linecap="round"
          />

          <!-- 下颌须羽 -->
          <g fill="#F0DFB0" opacity="0.9">
            <ellipse cx="120" cy="170" rx="3" ry="6" />
            <ellipse cx="130" cy="174" rx="3" ry="7" />
            <ellipse cx="140" cy="170" rx="3" ry="6" />
          </g>
        </g>

        <!-- ========== 爪子 ========== -->
        <!-- 左腿 -->
        <g fill="url(#clawG)" stroke="#5E3102" stroke-width="1">
          <!-- 腿 -->
          <path
            d="M 108,296 L 108,312 Q 108,316 104,318 L 104,330"
            stroke-width="3"
          />
          <!-- 踝关节 -->
          <ellipse cx="108" cy="298" rx="7" ry="4" />
          <!-- 脚掌 -->
          <path
            d="M 88,328 Q 108,322 128,328 Q 124,338 108,340 Q 92,338 88,328 Z"
          />
          <!-- 前中趾 -->
          <path d="M 108,328 Q 108,348 110,356 L 113,354 Q 111,348 112,328 Z" />
          <path
            d="M 108,328 L 107,354 L 104,354 Q 103,346 105,328 Z"
            opacity="0.7"
          />
          <!-- 左趾 -->
          <path d="M 96,328 Q 86,352 84,360 L 87,358 Q 90,350 99,328 Z" />
          <!-- 右趾 -->
          <path d="M 120,328 Q 130,350 134,358 L 131,356 Q 128,348 122,328 Z" />
          <!-- 后趾 -->
          <path d="M 100,330 Q 94,334 88,334 L 90,337 Q 98,337 103,333 Z" />
          <!-- 指甲尖 -->
          <g fill="#3A1F02">
            <path d="M 109,355 L 111,360 L 113,354 Z" />
            <path d="M 84,360 L 83,366 L 88,358 Z" />
            <path d="M 133,359 L 136,365 L 130,356 Z" />
          </g>
          <!-- 腿鳞片 -->
          <line
            x1="108"
            y1="302"
            x2="108"
            y2="310"
            stroke="#7A3D04"
            stroke-width="0.6"
            opacity="0.5"
          />
          <line
            x1="108"
            y1="314"
            x2="108"
            y2="318"
            stroke="#7A3D04"
            stroke-width="0.6"
            opacity="0.5"
          />
        </g>
        <!-- 右腿 -->
        <g fill="url(#clawG)" stroke="#5E3102" stroke-width="1">
          <path
            d="M 152,296 L 152,312 Q 152,316 156,318 L 156,330"
            stroke-width="3"
          />
          <ellipse cx="152" cy="298" rx="7" ry="4" />
          <path
            d="M 132,328 Q 152,322 172,328 Q 168,338 152,340 Q 136,338 132,328 Z"
          />
          <path d="M 152,328 Q 152,348 154,356 L 157,354 Q 155,348 156,328 Z" />
          <path d="M 140,328 Q 130,352 128,360 L 131,358 Q 134,350 143,328 Z" />
          <path d="M 164,328 Q 174,350 178,358 L 175,356 Q 172,348 166,328 Z" />
          <path d="M 160,330 Q 166,334 172,334 L 170,337 Q 162,337 157,333 Z" />
          <g fill="#3A1F02">
            <path d="M 153,355 L 155,360 L 157,354 Z" />
            <path d="M 128,360 L 127,366 L 132,358 Z" />
            <path d="M 177,359 L 180,365 L 174,356 Z" />
          </g>
          <line
            x1="152"
            y1="302"
            x2="152"
            y2="310"
            stroke="#7A3D04"
            stroke-width="0.6"
            opacity="0.5"
          />
          <line
            x1="152"
            y1="314"
            x2="152"
            y2="318"
            stroke="#7A3D04"
            stroke-width="0.6"
            opacity="0.5"
          />
        </g>
      </svg>

      <!-- ========== 信封（覆盖在SVG爪子上方） ========== -->
      <div
        class="envelope-wrapper"
        :class="{ 'envelope-open': isOpening }"
        @click.stop="openEnvelope"
      >
        <svg viewBox="0 0 180 120" class="env-svg">
          <defs>
            <linearGradient id="envBackG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#EFD9A3" />
              <stop offset="100%" stop-color="#C8AA67" />
            </linearGradient>
          </defs>
          <!-- 信封背面 -->
          <rect
            x="6"
            y="14"
            width="168"
            height="98"
            rx="3"
            fill="url(#envBackG)"
            stroke="#9A7C42"
            stroke-width="0.8"
          />
          <!-- 信纸（在翻盖之下） -->
          <g class="letter-sheet" :class="{ out: isOpening }">
            <rect
              x="18"
              y="44"
              width="144"
              height="64"
              rx="1.5"
              fill="#FFFEF2"
              stroke="#D9CA9C"
              stroke-width="0.5"
            />
            <g stroke="#C8B482" stroke-width="0.8" opacity="0.55">
              <line x1="28" y1="58" x2="152" y2="58" />
              <line x1="28" y1="70" x2="140" y2="70" />
              <line x1="28" y1="82" x2="148" y2="82" />
              <line x1="28" y1="94" x2="120" y2="94" />
            </g>
          </g>
          <!-- 信封正面底 + 两侧折 -->
          <polygon
            points="6,112 6,14 90,70 174,14 174,112"
            fill="url(#envG)"
            stroke="#9A7C42"
            stroke-width="0.8"
          />
          <!-- 左侧折痕 -->
          <path
            d="M 6,14 L 90,70 L 6,112"
            fill="none"
            stroke="url(#envFoldG)"
            stroke-width="1"
            opacity="0.7"
          />
          <!-- 右侧折痕 -->
          <path
            d="M 174,14 L 90,70 L 174,112"
            fill="none"
            stroke="url(#envFoldG)"
            stroke-width="1"
            opacity="0.7"
          />
          <!-- 翻盖（动画用3D transform） -->
          <g class="env-flap" :class="{ 'flap-open': isOpening }">
            <polygon
              points="6,14 90,70 174,14"
              fill="url(#envG)"
              stroke="#9A7C42"
              stroke-width="0.8"
            />
            <polygon
              points="10,16 90,66 170,16"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              stroke-width="0.6"
            />
            <!-- 翻盖纸纹 -->
            <path
              d="M 26,22 Q 90,60 154,22"
              fill="none"
              stroke="#B89758"
              stroke-width="0.4"
              opacity="0.5"
            />
          </g>
          <!-- 蜡封 -->
          <g class="seal-group" :class="{ 'seal-drop': isOpening }">
            <!-- 外圈蜡泪 -->
            <circle cx="90" cy="70" r="26" fill="url(#sealG)" />
            <g fill="#870F0F" opacity="0.7">
              <circle cx="70" cy="64" r="2.5" />
              <circle cx="108" cy="60" r="2" />
              <circle cx="112" cy="82" r="3" />
              <circle cx="74" cy="86" r="2.2" />
            </g>
            <!-- 蜡面凹陷 -->
            <ellipse
              cx="90"
              cy="70"
              rx="17"
              ry="17"
              fill="none"
              stroke="#5C0707"
              stroke-width="1.2"
              opacity="0.6"
            />
            <!-- H 字母浮雕 -->
            <text
              x="90"
              y="78"
              text-anchor="middle"
              font-family="Georgia, serif"
              font-size="22"
              font-weight="bold"
              fill="#3D0505"
              opacity="0.92"
              style="text-shadow: 0 1px 0 rgba(255, 220, 180, 0.35)"
            >
              H
            </text>
            <!-- 高光 -->
            <ellipse
              cx="81"
              cy="60"
              rx="5.5"
              ry="3.2"
              fill="#FFFFFF"
              opacity="0.45"
            />
            <ellipse
              cx="80"
              cy="62"
              rx="2.6"
              ry="1.4"
              fill="#FFFFFF"
              opacity="0.8"
            />
          </g>
          <!-- 信封边角阴影 -->
          <polygon points="6,112 6,14 90,70" fill="#000000" opacity="0.04" />
          <rect
            x="6"
            y="110"
            width="168"
            height="4"
            fill="#000000"
            opacity="0.08"
          />
        </svg>
      </div>
    </div>

    <!-- 提示 -->
    <div class="hint" v-if="!hasOpened && !isOpening">
      <span class="ha">👆</span>
      <span>点击信封打开</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["letter-opened"]);
const isOpening = ref(false);
const hasOpened = ref(false);
const openEnvelope = () => {
  if (isOpening.value || hasOpened.value) return;
  isOpening.value = true;
  hasOpened.value = true;
  setTimeout(() => emit("letter-opened"), 1200);
  setTimeout(() => {
    isOpening.value = false;
  }, 3600);
};
</script>

<style lang="scss" scoped>
.owl-container {
  position: absolute;
  left: 4%;
  bottom: 16%;
  z-index: 30;
  width: 280px;
  height: 420px;
  transform-origin: bottom center;
  cursor: pointer;
}
.owl-container.letter-flying {
  animation: owlFloat 1.6s ease-in-out;
}
@keyframes owlFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }
  30% {
    transform: translateY(-18px) rotate(-3deg);
  }
  70% {
    transform: translateY(-8px) rotate(2deg);
  }
}

.owl-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.owl-wrap.idle {
  animation: owlIdle 3.4s ease-in-out infinite;
}
@keyframes owlIdle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}
.owl-svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

/* ========= 信封 ========= */
.envelope-wrapper {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  width: 180px;
  height: 120px;
  z-index: 40;
  perspective: 1200px;
  transition: transform 0.35s ease;
  &:hover {
    transform: translateX(-50%) scale(1.06) translateY(-5px);
  }
}
.env-svg {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.35));
}

/* 翻盖3D翻转 */
.env-flap {
  transform-origin: 90px 14px;
  transform-style: preserve-3d;
  transition: transform 0.85s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.env-flap.flap-open {
  transform: rotateX(-182deg);
}

/* 信纸弹出 */
.letter-sheet {
  transform-origin: center;
  transition:
    transform 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.25s,
    opacity 0.5s 0.25s;
}
.letter-sheet.out {
  transform: translateY(-74px);
}

/* 蜡封掉落 */
.seal-group {
  transform-origin: 90px 70px;
  transition:
    transform 0.6s cubic-bezier(0.55, 0.05, 0.68, 0.53) 0.1s,
    opacity 0.55s ease 0.1s;
}
.seal-group.seal-drop {
  transform: translateY(130px) translateX(26px) rotate(190deg);
  opacity: 0;
}

/* ========= 光晕 + 闪光 ========= */
.halo {
  position: absolute;
  top: 26%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  height: 260px;
  background: radial-gradient(
    circle,
    rgba(255, 224, 120, 0.42) 0%,
    rgba(255, 180, 90, 0.15) 50%,
    transparent 75%
  );
  border-radius: 50%;
  animation: halo 3.2s ease-in-out infinite;
  z-index: -1;
  pointer-events: none;
}
@keyframes halo {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.75;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.18);
    opacity: 1;
  }
}
.sparkle {
  position: absolute;
  color: #ffd866;
  text-shadow: 0 0 6px rgba(255, 216, 102, 0.8);
  pointer-events: none;
  opacity: 0;
  font-size: 14px;
}
.sparkle.on {
  animation: sp 2.4s ease-in-out infinite;
}
.sp-1 {
  top: 14%;
  left: 18%;
  animation-delay: 0s;
}
.sp-2 {
  top: 10%;
  right: 14%;
  font-size: 10px;
  animation-delay: 0.8s;
}
.sp-3 {
  top: 42%;
  right: 8%;
  animation-delay: 1.6s;
}
@keyframes sp {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.4) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.25) rotate(180deg);
  }
}

/* ========= 提示 ========= */
.hint {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  font-size: 12.5px;
  color: #8b4513;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
  white-space: nowrap;
  animation: hBob 2.2s ease-in-out infinite;
  z-index: 50;
}
@keyframes hBob {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-6px);
  }
}
.ha {
  display: inline-block;
  animation: pu 1.6s ease-in-out infinite;
}
@keyframes pu {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
