<template>
  <dialog id="help-modal" class="modal active" :open="visible" @click="clickOverlay">
    <article>
      <h2>Configuration</h2>
      <form>
        <fieldset>
          <label>Deck</label>
          <textarea id="deck" v-model="input.deck" placeholder="Pokemon&#10;1 Farfetch'd&#10;3 Hitmonchan (BS2-008)&#10;&#10;Trainers&#10;4 Bill&#10;4 Professor Oak&#10;&#10;Energy&#10;9 Fighting Energy" autofocus></textarea>
          <small id="email-helper">
            <p>Input as sections divided by an empty line. The first line of each section will be used for menus.</p>
          </small>
        </fieldset>
      </form>
      <footer>
        <button class="secondary" aria-label="Cancel" @click="close()">Cancel</button>
        <button class="primary" aria-label="Save" @click="save()">Save</button>
      </footer>
    </article>
  </dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: [ 'show', 'close', 'config-change' ],
  props: {},
  data() {
    return {
      visible: false as boolean,
      input: {
        deck: "" as string,
      }
    }
  },
  mounted() {
    this.loadFromStorage();
  },
  methods: {
    clickOverlay(event: Event): void {
      if (event.target === event.currentTarget) {
        this.close();
      }
    },
    show(): void {
      this.visible = true;
      this.$emit('show');
    },
    close(): void {
      this.visible = false;
      this.$emit('close');
    },
    save(): void {
      this.close();
      this.persistToStorage();
      this.emitState();
    },
    emitState(): void {
      this.$emit('config-change', this.input);
    },
    loadFromStorage(): void {
      this.input.deck = localStorage.getItem('deck-config') ?? '';
      this.emitState();
    },
    persistToStorage(): void {
      localStorage.setItem('deck-config', this.input.deck);
    },
  }
});
</script>

<style lang="scss" scoped>
#deck {
  height: 10rem;
}
</style>