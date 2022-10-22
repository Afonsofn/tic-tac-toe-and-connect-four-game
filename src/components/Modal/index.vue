<template>
    <main ref="contentModal" class="modal">
        <div class="modal-content">
            <h2 v-if="!gameWinner && !matchWinner">We had a draw</h2>
            <template v-else>
                <h2>Congratulations :D</h2>
                <p>
                    {{ 
                        gameWinner
                            ? `${gameWinner === "P1" ? 'Player 1' : 'Player 2'} won the Game`
                            : `${matchWinner === "P1" ? 'Player 1' : 'Player 2'} won the Match`
                    }}
                </p>
            </template>

            <button v-if="gameWinner || gameDraw" @click="$emit('restartGame')">Next Game</button>
            <button v-else @click="$emit('restartMatch')">Next Match</button>
        </div>
    </main>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Modal',
    props: {
        matchWinner: {
            type: String,
        },
        gameWinner: {
            type: String,
        },
        gameDraw: {
            type: Boolean,
        },
    },
    methods: {
        closeModal() {
            this.$refs.contentModal.style.display = "none";
        }
    }
});
</script>

<style lang="scss" scoped src="./style.scss" />