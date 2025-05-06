<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <div
      :class="[
        'header w-full h-[30px] text-[14px]  flex justify-between items-center px-[10px]',
        `text-[${color}]`,
        'border-b-[2px] border-solid border-[#383B45] ',
      ]"
    >
      <div class="w-[calc(48%)] h-full">
        名称
      </div>
      <div class="w-[calc(48%)] h-full">
        图形
      </div>
    </div>
    <div class="content w-full h-[calc(100%_-_40px)] overflow-y-auto">
      <div
        v-for="(item, index) in data"
        :key="index"
        :class="[
          'w-full h-[50px] text-[#DCF0FF] ',
          'flex justify-between items-center px-[10px]',
          'hover:cursor-pointer hover:bg-red-500 duration-300',
          'border-b-[2px] border-solid border-[#383B45] ',
        ]"
        @click="onClick(item)"
      >
        <div
          :class="[
            'w-[calc(48%)] h-full',
            'flex justify-between items-center ',
            'select-none',
          ]"
        >
          {{ item.name }}
        </div>
        <div
          :class="[
            'flex justify-between items-center ',
            'w-[calc(48%)] h-full',
            'select-none',
          ]"
        >
          <img
            :src="item.icon"
            alt="My SVG Icon"
            class="w-5 h-5"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  data: any;
  color: string;
  lightColor: string;
  onClick: (data: any) => void;
}>()
</script>
<style lang="less" scoped></style>
