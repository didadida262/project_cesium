<template>
  <div
    ref="target"
    :class="[
      'border-[2px] border-solid border-[#383B45] rounded-md bg-[rgb(18,20,22)] ',
      'relative w-[120px] select-none text-textFourthSize',
    ]"
  >
    <div
      class="flex h-[36px] w-full shrink-0 cursor-pointer items-center justify-between whitespace-nowrap rounded-[4px] border-[1px] border-solid border-[#2c3243] bg-bgUlColor pl-4 pr-[10px]"
      @click="setShow(!show)"
    >
      <span class="w-[80px] text-[13px] text-textThirdColor line-clamp-1">
        {{ value ? value.label : "" }}
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.9999 7.99545C16.0004 8.12349 15.9721 8.25 15.9172 8.36568C15.8624 8.48137 15.7823 8.58329 15.6828 8.66395L10.5405 12.8036C10.3871 12.9296 10.1947 12.9985 9.99622 12.9985C9.7977 12.9985 9.60534 12.9296 9.45199 12.8036L4.30962 8.51825C4.13459 8.37278 4.02452 8.16373 4.00363 7.9371C3.98273 7.71047 4.05272 7.48482 4.1982 7.3098C4.34367 7.13477 4.55272 7.0247 4.77935 7.00381C5.00598 6.98291 5.23163 7.0529 5.40665 7.19838L10.0005 11.0294L14.5944 7.32694C14.7202 7.22213 14.8734 7.15556 15.0358 7.13509C15.1983 7.11463 15.3632 7.14113 15.5111 7.21145C15.6589 7.28178 15.7835 7.39299 15.8702 7.53193C15.9568 7.67087 16.0019 7.83172 15.9999 7.99545Z"
          fill="currentColor"
          :class="[
            'origin-center text-textTertiaryColor duration-300',
            show && 'rotate-180',
          ]"
        />
      </svg>
    </div>
    <ul
      :class="[
        'absolute top-[40px] max-h-[144px] w-full flex-col overflow-y-auto rounded-[4px] border-[1px] border-solid border-[#262B33] bg-[#141519] duration-300',
        'chain-select',

        show ? 'z-10 flex opacity-100 shadow-common' : '-z-10 hidden opacity-0',
      ]"
    >
      <li
        v-for="(item, index) in options"
        :key="index"
        :class="[
          `flex h-[36px] cursor-pointer items-center gap-x-[6px] overflow-y-auto pl-4 text-textFifthSize hover:bg-[#1d2024]`,
          item.value === activeValue && 'bg-[#1d2024]',
        ]"
        @click="handleClick(item)"
      >
        <span class="text-textFifthSize text-textSixColor">
          {{ item.label }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  options: any;
  onClick: (item: any) => void;
}>()

const target = ref(null)
onClickOutside(target, (event) => {
  setShow(false)
})
const show = ref(false)
const value = ref(null) as any
const activeValue = ref('')

const setValue = (data: any) => {
  value.value = data
}
const handleClick = (item: any) => {
  setValue(item)
  setShow(false)
}
const setShow = (type: boolean) => {
  show.value = type
}
onMounted(() => {
  console.log('onMounted>>>')
  setValue(props.options[0])
})
watch(value, () => {
  console.log('watch>>>', value.value)
  props.onClick(value.value)
})
</script>
