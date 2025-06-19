<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <DigitNumber
          v-for="(data, i) in timeLeftText"
          :key="i"
          :color="digitColor"
          :data="data"
          style="width: 15%; height: 100%"
        />
      </v-col>
      <v-col cols="12">
        <!--
          開始按鈕停用條件:
          1. 倒數中
          2. 目前沒有事項或沒有未完成事項
        -->
        <v-btn
          class="bg-purple-darken-2"
          :disabled="
            status === STATUS.COUNTING || (list.currentItem.length === 0 && list.items.length === 0)
          "
          icon="mdi-play"
          @click="startTimer"
        />
        <!-- 只有倒數中才能按暫停 -->
        <v-btn
          class="bg-purple-darken-2"
          :disabled="status !== STATUS.COUNTING"
          icon="mdi-pause"
          @click="pause"
        />
        <!-- 目前有事項才能跳過 -->
        <v-btn
          class="bg-purple-darken-2"
          :disabled="list.currentItem.length === 0"
          icon="mdi-skip-next"
          @click="finish"
        />
      </v-col>
      <v-col cols="12">
        <v-row id="item-list" class="">
          <v-col id="current-color" cols="6">
            <div id="current-title">目前事項：</div>
            <div>{{ list.currentItem }}</div>
            <div v-if="list.items.length > 0" id="current-left">
              尚餘項目：{{ list.items.length }}
            </div>
          </v-col>
          <v-col
            v-for="(item, i) in list.items"
            :key="i"
            class="item-color"
            cols="3"
            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
          >
            {{ item.text }}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useWebNotification } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import DigitNumber from '@/components/DigitNumber.vue'
import { useListStore } from '@/stores/list'
import { useSettingsStore } from '@/stores/settings'

const list = useListStore()
const settings = useSettingsStore()

// 倒數狀態
const STATUS = {
  STOP: 0,
  COUNTING: 1,
  PAUSE: 2,
}
const status = ref(STATUS.STOP)

// 進行中音樂
const tick_audio = new Audio(new URL('@/assets/clock-24340.mp3', import.meta.url).href)
tick_audio.loop = true // 讓音樂循環

// 休息音樂
let break_audio = null

//
const theme = useTheme()
const digitColor = computed(() => {
  return theme.global.current.value.dark ? 'white' : 'black'
})

// 計時器
let timer = 0
// 開始計時器
// 暫停繼續 + 停止開始
const startTimer = () => {
  if (list.isBreak) {
    // 休息階段，播放休息音樂
    if (!break_audio) {
      break_audio = new Audio(settings.selectedBreak.file)
      break_audio.loop = true // 讓音樂循環
      break_audio.play().catch(error => {
        console.warn('無法自動播放休息音樂：', error)
      })
    }
  } else {
    // 事項階段，播放tick
    tick_audio.play().catch(error => {
      console.warn('無法播放tick音樂：', error)
    })
  }

  // 如果是停止開始，更新目前事項
  if (status.value === STATUS.STOP && list.items.length > 0) {
    list.setCurrentItem()
  }

  // 狀態變成倒數中
  status.value = STATUS.COUNTING

  // 開始倒數
  timer = setInterval(() => {
    list.countdown()

    if (list.timeleft < 0) {
      finish(timer)
    }
  }, 1000)
}

const pause = () => {
  clearInterval(timer)
  status.value = STATUS.PAUSE

  tick_audio.pause()
}

const finish = () => {
  clearInterval(timer)

  status.value = STATUS.STOP

  //
  if (tick_audio) {
    console.log('停止 tick 音樂')
    tick_audio.pause()
    tick_audio.currentTime = 0
  }

  // 停止休息音樂
  if (break_audio) {
    console.log('停止 通知 音樂')
    break_audio.pause()
    break_audio.currentTime = 0
    break_audio = null
  }

  // 事項完成
  if (!list.isBreak) {
    // 播放通知音樂
    console.log('播放 通知 音樂')
    const audio = new Audio(settings.selectedAlarm.file)
    audio.play().catch(error => {
      console.warn('無法自動播放通知音樂：', error)
    })
  }

  const { show, isSupported } = useWebNotification({
    title: '事項完成',
    body: list.currentItem,
    icon: new URL('@/assets/tomato.png', import.meta.url).href,
  })
  if (isSupported.value) {
    show()
  }

  list.setFinishItem()

  if (list.items.length > 0) {
    startTimer()
  }
}

const timeLeftText = computed(() => {
  const m = Math.floor(list.timeleft / 60)
    .toString()
    .padStart(2, '0')
  const s = (list.timeleft % 60).toString().padStart(2, '0')
  return m + ':' + s
})
</script>

<style scoped>
.v-container,
.v-col,
body {
  color: #222;
}

#current-color {
  background: #f18973;
  color: #fefbd8;

  position: relative;
}

#current-title {
  position: absolute;
  top: -3px;
  left: -6px;
  /* background: #fff; */
  padding: 2px 6px;
  font-size: 0.7rem;
  border-radius: 4px;
  z-index: 1;
}

#current-left {
  position: absolute;
  top: -3px;
  right: -3px;
  /* background: #fff; */
  padding: 2px 6px;
  font-size: 0.7rem;
  border-radius: 4px;
  z-index: 1;
}

.item-color:nth-of-type(4n) {
  background: #d5f4e6;
}

.item-color:nth-of-type(4n + 1) {
  background: #80ced6;
}

.item-color:nth-of-type(4n + 2) {
  background: #fefbd8;
}

.item-color:nth-of-type(4n + 3) {
  background: #618685;
}
</style>
