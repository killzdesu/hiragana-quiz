<script setup lang="ts">
import { Hiragana, Romanji } from '~/composables/useHiragana'
import { useSettingStore } from '~/stores/settings'
import { Ref } from 'vue'

const setting = useSettingStore()
const router = useRouter()

if (setting.settingsIndex.length == 0) router.push('/')


const quizNumber: Ref<number> = ref(0)
const answer = ref('')

const quiz = computed(() => {
  return {
    hiragana: Hiragana[quizNumber.value],
    romanji: Romanji[quizNumber.value]
  }
})

const checkedAnswer: Ref<string> = ref('')
const checkAnswer = () => {
  if (answer.value == '') answer.value = ' '

  if (answer.value.toUpperCase() === quiz.value.romanji)
    checkedAnswer.value = 'true'
  else
    checkedAnswer.value = 'false'
}
const inputref = ref(null)
const newQuiz = () => {
  const oldQuiz = quizNumber.value
  let arr = setting.settingsIndex.filter(el=>el!=oldQuiz)
  if (setting.settingsIndex.length == 1) arr = [setting.settingsIndex[0]]
  // Reset all values
  checkedAnswer.value = ''
  answer.value = ''
  quizNumber.value = arr[Math.floor(Math.random()*arr.length)] ?? 0
}

// Not working -> Focus text input after new quiz
// watch(quiz, async (new, old) => {
//   await nextTick()
//   inputref.value.focus()
// })

const inputClass = computed(()=>{
  return {
    correct: checkedAnswer.value=='true',
    wrong: checkedAnswer.value=='false'
  }
})

onMounted(()=>{
  newQuiz()
})

</script>

<template>
  <div text-5xl>
    {{ quiz.hiragana }}
    <span v-if="checkedAnswer!=''" text-3xl mx-2>{{ quiz.romanji }}</span>
  </div>
  <input type="text" v-model="answer"
    :readonly="checkedAnswer!=''"
    :class="inputClass"
    ref="inputref"
    placeholder="Answer"
    autocomplete="false"
    p="x4 y2" my-6
    w="1/3 md:1/5 lg:1/8"
    border="~ rounded gray-200"
    text="center dark-900"
    @keydown.enter="checkAnswer"/>
  <button btn bg-pink-500 mx-2 @click="checkAnswer">check</button>
  <div v-if="checkedAnswer!=''">
    <button btn bg-pink-500 @click="newQuiz">Next</button>
  </div>

  <div my-12 />
  <button btn bg-blue-500 @click="router.push('/')">Back</button>
</template>

<style>
.correct {
  @apply bg-green-500 text-light-100;
}
.wrong {
  @apply bg-red-600 text-light-100;
}

</style>
