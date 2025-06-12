import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const alarms = [
      { id: 1, name: '鬧鐘1', file: new URL('@/assets/alarm.mp3', import.meta.url).href },
      {
        id: 2,
        name: '鬧鐘2',
        file: new URL('@/assets/alarm-clock-short-6402.mp3', import.meta.url).href,
      },
      { id: 3, name: '歡呼聲', file: new URL('@/assets/yay.mp3', import.meta.url).href },
      {
        id: 4,
        name: '咖啡店氛圍',
        file: new URL('@/assets/coffee-shop-338785.mp3', import.meta.url).href,
      },
      {
        id: 5,
        name: '吉他1',
        file: new URL('@/assets/my-life-main-6670.mp3', import.meta.url).href,
      },
      {
        id: 6,
        name: '吉他2',
        file: new URL('@/assets/simple-happy-life-353819.mp3', import.meta.url).href,
      },
    ]

    const alarm_selected = ref(2)
    const break_selected = ref(4)

    const selectedAlarm = computed(() => {
      const i = alarms.findIndex(alarm => alarm.id === alarm_selected.value)
      return alarms[i]
    })

    const selectedBreak = computed(() => {
      const i = alarms.findIndex(alarm => alarm.id === break_selected.value)
      return alarms[i]
    })

    return {
      alarms,
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
