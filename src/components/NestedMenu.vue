<template>
    <div class="grid">
      <button class="cancel" :disabled="!hasParent" @click="$emit('traverse', -1)">Cancel</button>
      <template v-for="(child, index) in (config.children ?? [])" :key="index">
          <button class="option secondary" @click="$emit('traverse', index)">{{ child.name }}</button>
          <!-- <div><NestedMenu :config="child" /></div> -->
      </template>
    </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { NestableMenu } from '@/types/NestableMenu';

export default {
  emits: ['traverse'],
  props: {
    hasParent: {
      type: Boolean,
      default: true,
      required: false,
    },
    config: {
      type: Object as PropType<NestableMenu>,
      required: true,
    },
  },
}
</script>

<style lang="sass" scoped>
.grid {
  grid-template-columns: repeat(2, 50%);
}

.cancel {
  grid-column-start: 1;
  grid-column-end: 3;
}
</style>