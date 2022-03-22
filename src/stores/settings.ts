import { acceptHMRUpdate, defineStore } from 'pinia'
import { ComputedRef } from 'vue'

interface SettingType {
  alphabets: Array<boolean>
  toEnglish: boolean
}

export const useSettingStore = defineStore('setting', () => {

  let settings: SettingType = reactive({
    alphabets: Array(51).fill(false),
    toEnglish: true
  })

  function setNewSetting(newSetting: Array<boolean>) {
    settings.alphabets = newSetting
  }

  const settingsIndex: ComputedRef<Array<number>> = computed(() => {
    let arr = settings.alphabets.map((el, id)=>{
      return (el ? id : null)
    })
    return arr.filter(el => el!=null) as Array<number>
  })

  return {
    settings,
    settingsIndex,
    setNewSetting
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))

