<script setup lang="ts">
import { Hiragana, Romanji } from '~/composables/useHiragana'
import { useSettingStore } from '~/stores/settings'

const setting = useSettingStore()
const letterNum: Ref<number> = ref(51)

const hiraganaTable = computed(() => {
  let table = Hiragana.slice(0, letterNum.value)
  return table
})
const romanjiTable = computed(() => {
  let table = Romanji.slice(0, letterNum.value)
  return table
})

const defaultSetting = setting.settingsIndex.map(id=>romanjiTable.value[id])
const checkedSetting: Ref<Array<any>> = ref(defaultSetting)
const settingArray = computed(() => {
  let settings = []
  for (const el of romanjiTable.value) {
    if (checkedSetting.value.includes(el))
      settings.push(true)
    else
      settings.push(false)
  }
  return settings
})

// onUpdated(()=>{
//   const defaultSetting = setting.settingsIndex.map(id=>romanjiTable.value[id])
//   checkedSetting.value = defaultSetting
// })

watchEffect(()=>{
  setting.setNewSetting(settingArray)
})

const clickAll = ()=> {
  if (checkedSetting.value.length != 46)
    checkedSetting.value = romanjiTable.value.filter(e=>e!='-')
  else
    checkedSetting.value = []
}

const clickRow = (row: string) => {
  const index = romanjiTable.value.indexOf(row)
  const rowContent = romanjiTable.value.slice(index, index+5).filter(el=>el!='-')
  if (checkedSetting.value.includes(row)) {
    checkedSetting.value = checkedSetting.value.filter(el=>!rowContent.includes(el))
  } else {
    checkedSetting.value = [...new Set([...checkedSetting.value, ...rowContent])]
  }
}

const router = useRouter()
const clickQuiz = () => {
  if (checkedSetting.value.length != 0) {
    router.push(`/quiz/`)
  } else {
    alert('select at least 1 hiragana!')
  }
}

</script>

<template>
  <div grid grid-cols-5 gap-y-2>
    <div v-for="index in hiraganaTable.length" :key="index"
      col-span-1 text-left>
      <p v-if="hiraganaTable[index-1] === '-'"> </p>
      <p v-else>
        <input type="checkbox"
          :value="romanjiTable[index-1]"
          v-model="checkedSetting"
          />
        <span px-1>{{ hiraganaTable[index-1] }}</span>
        <span text-xs italic>{{ romanjiTable[index-1] }}</span>
      </p>
    </div>
  </div>

  <div py-2 />
  <button v-for="row in romanjiTable.filter((el, i)=>(i%5==0&&i<50))" :key="row"
    @click="clickRow(row)"
    btn bg-cyan-500 mx-1 my-1 text-sm>
    {{ row }}
  </button>
  <br>
  <div my-4 />
  <button btn @click="clickAll">
    All
  </button>
  <button btn bg-red-500 mx-2 @click="clickQuiz">Quiz</button>
</template>
