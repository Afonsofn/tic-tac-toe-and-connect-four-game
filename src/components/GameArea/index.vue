<template>
    <main>
        <h2>Tic tac toe games</h2>
        <p>Welcome to the best game in the world.</p>

        <div class="toggle">
            <div>Tic tac toe</div>
            <div>Connect four</div>
        </div>

        <section class="board-wrapper">
            <div class="player-one desktop">
                <p :class="currentPlayer === 'P1' ? 'currentPlayer1' : ''">Player 1</p>
                <p>{{ playerOneMatchWins }}</p>
            </div>
            
            <div class="board">
                <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex" class="row">
                    <div
                        v-for="(cell, cellIndex) in row"
                        :key="cellIndex"
                        @click="chooseCell(rowIndex, cellIndex)"
                        class="cell"
                    >
                        <img v-if="cell" :ref="setCellId(rowIndex, cellIndex)" :src="getImageUrl(cell)">
                    </div>
                </div>
            </div>

            <div class="player-two desktop">
                <p :class="currentPlayer === 'P2' ? 'currentPlayer2' : ''">Player 2</p>
                <p>{{ playerTwoMatchWins }}</p>
            </div>
        </section>

        <section class="timer-wrapper">
            <div class="player-one mobile">
                <p :class="currentPlayer === 'P1' ? 'currentPlayer1' : ''">Player 1</p>
                <p>{{ playerOneMatchWins }}</p>
            </div>
            
            <div class="timer">
                {{ formatedTimer }}
            </div>

            <div class="player-two mobile">
                <p :class="currentPlayer === 'P2' ? 'currentPlayer2' : ''">Player 2</p>
                <p>{{ playerTwoMatchWins }}</p>
            </div>
        </section>

        <ModalMatch
            :matchWinner="haveAWinner"
            :gameWinner="gameWinner"
            :gameDraw="hadAGameDraw"
            @restartGame="restartGame"
            @restartMatch="restartMatch"
            ref="contentModal"
        />
    </main>
</template>

<script>
import { defineComponent } from 'vue';
import ModalMatch from '../Modal/index.vue';
import mixins from '@/mixins/index.vue';

export default defineComponent({
    name: 'GameArea',
    components: { ModalMatch },
    mixins: [mixins],
    props: {
        stats: {
        type: Object,
        required: true
        }
    },
    data: function() {
        return {
            startPlayer: '',
            currentPlayer: '',
            lastFirstPlayer: '',
            playerOneMatchWins: 0,
            playerTwoMatchWins: 0,
            gameWinner: '',
            numOfMatches: 0,
            hadAMatchDraw: false,
            hadAGameDraw: false,
            gameBoard: [['', '', ''], ['', '', ''], ['', '', '']],
            hours: 0,
            minutes: 0,
            seconds: 0,
            timer: null,
            timerOn: false
        }
    },
    watch: {
        numOfMatches: function() {
            if (this.numOfMatches === 5) {
                this.openModal()
                if (this.playerOneMatchWins !== this.playerTwoMatchWins) {
                    this.gameWinner = this.playerOneMatchWins > this.playerTwoMatchWins ? 'P1' : 'P2';
                    this.gameWinner === 'P1' ? this.stats.playerOneGameWins++ : this.stats.playerTwoGameWins++;
                    this.stats.gameHistory.unshift(this.gameWinner)
                    
                    return
                }

                this.openModal()
                this.hadAGameDraw = true;
                this.stats.gameHistory.unshift('DW')
            }
        },
        playerOneMatchWins: function() {
            if (this.playerOneMatchWins === 3 && this.numOfMatches !== 5) {
                this.openModal()

                this.gameWinner = 'P1'
                this.stats.gameHistory.unshift(this.gameWinner)
                this.stats.playerOneGameWins++
            }
        },
        playerTwoMatchWins: function() {
            if (this.playerTwoMatchWins === 3 && this.numOfMatches !== 5) {
                this.openModal()

                this.gameWinner = 'P2'
                this.stats.gameHistory.unshift(this.gameWinner)
                this.stats.playerTwoGameWins++
            }
        }
    },
    computed: {
        haveAWinner() {
            const result = this.gameResult(this.gameBoard.flat())

            if (result) {
                this.openModal()
                return result
            }

            return
        },
        formatedTimer() {
            return `${this.formatNumber(this.hours)}:${this.formatNumber(this.minutes)}:${this.formatNumber(this.seconds)}`
        }
    },
    methods: {
        gameResult(boardValue) {
            const winResults = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

            for (const result of winResults) {
                const [firstCell, secondCell, thirdCell] = result;

                if (
                    boardValue[firstCell] &&
                    boardValue[firstCell] ===
                    boardValue[secondCell] &&
                    boardValue[firstCell] ===
                    boardValue[thirdCell]
                ) {
                    boardValue[firstCell] === 'P1' ? this.playerOneMatchWins++ : this.playerTwoMatchWins++;

                    this.changeColorOfWinner(firstCell, secondCell, thirdCell)
                    
                    this.pauseTimer()

                    this.numOfMatches++;
                    this.stats.numOfMatchesTotal.unshift(boardValue[firstCell]);
                    
                    return boardValue[firstCell];
                }
            }

            if(boardValue.find(cell => cell === '') === undefined) {
                this.openModal()

                this.numOfMatches++;
                this.stats.numOfMatchesTotal.unshift('DW');

                this.hadAMatchDraw = true;

                this.pauseTimer();
            }
        
            return null;
        },
        chooseCell(line, cell) {
            if (this.gameBoard[line][cell] || this.haveAWinner) return

            if(!this.timerOn) this.startTimer()

            this.gameBoard[line][cell] = this.currentPlayer

            this.currentPlayer = this.currentPlayer === 'P1' ? 'P2' : 'P1'
        },
        restartMatch() {
            this.$refs.contentModal.closeModal()
            this.gameBoard = [['', '', ''], ['', '', ''], ['', '', '']]
            this.hadAMatchDraw = false
        },
        restartGame() {
            this.restartMatch()
            this.gameWinner = '';
            this.hadAGameDraw = false
            this.numOfMatches = 0;
            this.playerOneMatchWins = 0;
            this.playerTwoMatchWins = 0;
            this.lastFirstPlayer = this.lastFirstPlayer === 'P1' ? 'P2' : 'P1';
            this.clearTimer()
        },
        startTimer() {
            this.timer = setInterval(() => {
                this.seconds++

                if (this.seconds === 60) {
                    this.seconds = 0
                    this.minutes++
                }

                if (this.minutes === 60) {
                    this.minutes = 0
                    this.hours++
                }
            }, 1000)

            this.timerOn = true
        },
        pauseTimer() {
            clearInterval(this.timer)

            this.timerOn = false
        },
        clearTimer() {
            this.stats.totalSeconds = this.stats.totalSeconds + this.seconds
            if (this.stats.totalSeconds >= 60) {
                this.stats.totalSeconds = this.stats.totalSeconds - 60
                this.stats.totalMinutes++
            }

            this.stats.totalMinutes = this.stats.totalMinutes + this.minutes
            if (this.stats.totalMinutes >= 60) {
                this.stats.totalMinutes = this.stats.totalMinutes - 60
                this.stats.totalHours++
            }

            this.stats.totalHours = this.stats.totalHours + this.hours

            this.hours = 0
            this.minutes = 0
            this.seconds = 0
            this.timer = null
            this.timerOn = false
        },
        setFirstPlayerRamdomly() {
            Math.floor(Math.random() * 2) === 0
                ? this.currentPlayer = 'P1'
                : this.currentPlayer = 'P2'
            
            this.lastFirstPlayer = this.currentPlayer
            this.startPlayer = this.currentPlayer
        },
        getImageUrl(player) {
            const url = this.startPlayer === player ? 'X' : 'O'

            return new URL(`../../assets/images/${url}_dark.svg`, import.meta.url).href
        },
        changeColorOfWinner(firstCell, secondCell, thirdCell) {
            setTimeout(() => {
                const C1 = this.$refs[`cell-id-${firstCell}`][0].src.replace('dark', 'bright');
                const C2 = this.$refs[`cell-id-${secondCell}`][0].src.replace('dark', 'bright');
                const C3 = this.$refs[`cell-id-${thirdCell}`][0].src.replace('dark', 'bright');

                this.$refs[`cell-id-${firstCell}`][0].src = new URL(C1, import.meta.url).href
                this.$refs[`cell-id-${secondCell}`][0].src = new URL(C2, import.meta.url).href
                this.$refs[`cell-id-${thirdCell}`][0].src = new URL(C3, import.meta.url).href
            }, 150);
        },
        setCellId(rowIndex, cellIndex) {
            if(rowIndex === 1) {
                return `cell-id-${cellIndex + 3}`
            }

            if(rowIndex === 2) {
                return `cell-id-${cellIndex + 6}`
            }

            return `cell-id-${cellIndex}`
        },
        openModal() {
            const modal = this.$refs.contentModal.$el;

            modal.style.display = "block";

            window.onclick = (event) => {
                if (event.target == modal) {
                    modal.style.display = "none";

                    if(this.gameWinner || this.gameDraw) return this.restartGame()

                    this.restartMatch()
                }
            }
        },
    },
    mounted() {
        this.setFirstPlayerRamdomly()
    }
});
</script>

<style lang="scss" scoped src="./style.scss" />