import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const alarm_musics = [
      {
        id: 1,
        name: '鬧鐘1',
        file: new URL('@/assets/alarm.mp3', import.meta.url).href,
        showCtrl: false,
      },
      {
        id: 2,
        name: '鬧鐘2',
        file: new URL('@/assets/alarm-clock-short-6402.mp3', import.meta.url).href,
        showCtrl: false,
      },
      {
        id: 3,
        name: '歡呼聲',
        file: new URL('@/assets/yay.mp3', import.meta.url).href,
        showCtrl: false,
      },
    ]

    const break_musics = [
      {
        id: 1,
        name: '咖啡店氛圍',
        file: new URL('@/assets/coffee-shop-338785.mp3', import.meta.url).href,
        showCtrl: false,
      },
      {
        id: 2,
        name: '吉他1',
        file: new URL('@/assets/my-life-main-6670.mp3', import.meta.url).href,
        showCtrl: false,
      },
      {
        id: 3,
        name: '吉他2',
        file: new URL('@/assets/simple-happy-life-353819.mp3', import.meta.url).href,
        showCtrl: false,
      },
    ]

    const alarm_selected = ref(1)
    const break_selected = ref(1)

    const selectedAlarm = computed(() => {
      const i = alarm_musics.findIndex(music => music.id === alarm_selected.value)
      return alarm_musics[i]
    })

    const selectedBreak = computed(() => {
      const i = break_musics.findIndex(music => music.id === break_selected.value)
      return break_musics[i]
    })

    return {
      alarm_musics,
      break_musics,
      alarm_selected,
      break_selected,
      selectedAlarm,
      selectedBreak,
    }
  },
  {
    persist: {
      key: 'pomodoro-settings',
      pick: ['alarm_selected', 'break_selected'],
    },
  }
)
