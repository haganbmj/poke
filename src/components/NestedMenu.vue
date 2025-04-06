<template>
    <div class="grid">
      <button class="cancel" :disabled="!hasParent" @click="$emit('traverse', -1)">Cancel</button>
      <template v-for="(child, index) in (config.children ?? [])" :key="index">
          <button class="option secondary" v-show="shouldShowChild(index)" @click="$emit('traverse', index)">{{ child.name }}</button>
      </template>
      <template v-for="index in dummyElementsToRender" :key="index">
        <button class="option secondary hidden" disabled>Dummy</button>
      </template>
      <button class="nav prev outline" v-show="showPagination" :disabled="!hasPrevious" @click="pageIndex -= 1">Previous Page</button>
      <button class="nav next outline" v-show="showPagination" :disabled="!hasNext" @click="pageIndex += 1">Next Page</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { NestableMenu } from '@/types/NestableMenu';

const PAGE_SIZE = 6;
const OVERFLOW_SIZE = 8;

export default defineComponent({
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
  data() {
    return {
      pageIndex: 0 as number,
    }
  },
  computed: {
    showPagination(): boolean {
      return (this.config.children?.length ?? 0) > OVERFLOW_SIZE;
    },
    hasNext(): boolean {
      return this.pageIndex < Math.floor((this.config.children?.length ?? 0) / PAGE_SIZE);
    },
    hasPrevious(): boolean {
      return this.pageIndex > 0;
    },
    dummyElementsToRender(): number {
      if (this.hasNext === true) {
        return 0;
      } else if (this.hasNext === false && this.showPagination) {
        return PAGE_SIZE - ((this.config.children?.length ?? 0) % PAGE_SIZE);
      } else {
        return OVERFLOW_SIZE - ((this.config.children?.length ?? 0) % OVERFLOW_SIZE);
      }
    },
  },
  methods: {
    shouldShowChild(index: number): boolean {
      if ((this.config.children?.length ?? 0) <= OVERFLOW_SIZE) {
        return true as boolean;
      }
      return index >= (PAGE_SIZE * this.pageIndex) && index < (PAGE_SIZE * (this.pageIndex + 1));
    },
  },
});
</script>

<style lang="sass" scoped>
.grid {
  --pico-form-element-spacing-vertical: 0.25rem;
  --pico-form-element-spacing-horizontal: 0.5rem;

  --pico-grid-column-gap: 0.25rem;
  --pico-grid-row-gap: 0.25rem;
}

.grid {
  grid-template-columns: repeat(2, 50%);
  margin: 0 auto;
}

.grid button {
  --pico-line-height: 1.2;
}

.cancel {
  grid-column-start: 1;
  grid-column-end: 3;
}

.hidden {
  opacity: 0;
}
</style>