<template>
    <div id="help-modal" class="modal active" v-show="visible">
    <a href="#" class="modal-overlay" aria-label="Close" @click="close()" />
    <div class="modal-container">
      <div class="modal-header">
        <a href="#" class="btn btn-clear float-right" aria-label="Close" @click="close()" />
        <div class="modal-title h4">
          Help, Tips & Tricks, FAQ
        </div>
      </div>
      <div class="modal-body">
        <div class="content">
            <h5>Deck Input</h5>
            <textarea id="deck-pokemon"></textarea>
            <textarea id="deck-trainers"></textarea>
            <textarea id="deck-energy"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <a href="#" class="btn btn-link" aria-label="Close" @click="close()">Close</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {},
    data() {
        return {
            visible: false,
        }
    },
    methods: {
        // show() {
        //     this.visible = true;
        //     this.$emit('show');
        // },
        // close() {
        //     this.visible = false;
        //     this.$emit('close');
        // },
    }
}
</script>