<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">通知音樂設定</h1>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="4" order="1" sm="2">名稱</v-col>
          <v-col cols="4" order="2" sm="8">試聽</v-col>
          <v-col cols="4" order="3" sm="2">選取</v-col>
        </v-row>
        <v-row v-for="music in settings.alarm_musics" :key="music.id">
          <v-col class="d-flex align-center" cols="4" order="1" sm="2">{{ music.name }}</v-col>
          <v-col v-show="!isWide" cols="4" order="2" sm="8">
            <v-btn
              :icon="music.showCtrl ? 'mdi-unfold-less-horizontal' : 'mdi-unfold-more-horizontal'"
              @click="toggleCtrl(music)"
            />
          </v-col>
          <v-col v-show="isWide || music.showCtrl" cols="12" :order="audioOrder" sm="8">
            <audio class="w-100" controls :src="music.file" />
          </v-col>
          <v-col class="d-flex align-center" cols="4" order="3" sm="2">
            <v-radio-group v-model="settings.alarm_selected" hide-details>
              <v-radio :value="music.id" />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">休息音樂設定</h1>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="4" order="1" sm="2">名稱</v-col>
          <v-col cols="4" order="2" sm="8">試聽</v-col>
          <v-col cols="4" order="3" sm="2">選取</v-col>
        </v-row>
        <v-row v-for="music in settings.break_musics" :key="music.id">
          <v-col class="d-flex align-center" cols="4" order="1" sm="2">{{ music.name }}</v-col>
          <v-col v-show="!isWide" cols="4" order="2" sm="8">
            <v-btn
              :icon="music.showCtrl ? 'mdi-unfold-less-horizontal' : 'mdi-unfold-more-horizontal'"
              @click="toggleCtrl(music)"
            />
          </v-col>
          <v-col v-show="isWide || music.showCtrl" cols="12" :order="audioOrder" sm="8">
            <audio class="w-100" controls :src="music.file" />
          </v-col>
          <v-col class="d-flex align-center" cols="4" order="3" sm="2">
            <v-radio-group v-model="settings.break_selected" hide-details>
              <v-radio :value="music.id" />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const width = ref(window.innerWidth)
const isWide = computed(() => width.value >= 600)
const audioOrder = computed(() => (width.value < 600 ? 4 : 2))

const toggleCtrl = music => {
  music.showCtrl = !music.showCtrl
}

const handleResize = () => {
  width.value = window.innerWidth
}

onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>
