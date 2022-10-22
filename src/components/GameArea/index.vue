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
                <p :class="currentPlayer === 'X' ? 'currentPlayer' : ''">Player 1</p>
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
                        <img v-if="cell" :id="`${rowIndex}${cellIndex}`" :src="getImageUrl(cell)">
                    </div>
                </div>
            </div>

            <div class="player-two desktop">
                <p :class="currentPlayer === 'O' ? 'currentPlayer' : ''">Player 2</p>
                <p>{{ playerTwoMatchWins }}</p>
            </div>
        </section>

        <div v-if="!hadAGameDraw && !gameWinner && haveAWinner"><!-- Modal match -->
            <h2>{{ haveAWinner === 'X' ? 'Player 1' : 'Player 2' }} won, Congratulations!</h2>

            <button @click="restartMatch">Next Match</button>
        </div>

        <div v-if="!hadAGameDraw && !gameWinner && hadAMatchDraw"><!-- Modal Match Draw -->
            <h2>Had a Draw!</h2>

            <button @click="restartMatch">Next Match</button>
        </div>

        <div v-if="gameWinner"><!-- Modal gameWinner -->
            <h2>Congratulations {{ gameWinner === 'X' ? 'Player 1' : 'Player 2' }}, won the Game!</h2>

            <button @click="restartGame">Next Game</button>
        </div>

        <div v-if="hadAGameDraw"><!-- Modal Game Draw -->
            <h2>Had a Game Draw!</h2>

            <button @click="restartGame">Next Game</button>
        </div>

        <section class="timer-wrapper">
            <div class="player-one mobile">
                <p :class="currentPlayer === 'X' ? 'currentPlayer' : ''">Player 1</p>
                <p>{{ playerOneMatchWins }}</p>
            </div>
            <div class="timer">
                {{ formatedTimer }}
            </div>
            <div class="player-two mobile">
                <p :class="currentPlayer === 'O' ? 'currentPlayer' : ''">Player 2</p>
                <p>{{ playerTwoMatchWins }}</p>
            </div>
        </section>

        {{ numOfMatches }}

        <div>
            {{ formatedTotalTimer }}
        </div>

    </main>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameArea',
  data: function() {
    return {
        currentPlayer: '',
        lastFirstPlayer: '',
        playerOneMatchWins: 0,
        playerTwoMatchWins: 0,
        playerOneGameWins: 0,
        playerTwoGameWins: 0,
        gameWinner: '',
        numOfMatches: 0,
        hadAMatchDraw: false,
        hadAGameDraw: false,
        gameBoard: [['', '', ''], ['', '', ''], ['', '', '']],
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalHours: 0,
        totalMinutes: 0,
        totalSeconds: 0,
        timer: null,
        timerOn: false
    }
  },
  watch: {
    numOfMatches: function() {
        if (this.numOfMatches === 5) {
            // Open modal winner of game
            if (this.playerOneMatchWins !== this.playerTwoMatchWins) {
                this.gameWinner = this.playerOneMatchWins > this.playerTwoMatchWins ? 'X' : 'O';
                this.gameWinner === 'X' ? this.playerOneGameWins++ : this.playerTwoGameWins++;       
                
                return
            }

            // Open modal game draw
            this.hadAGameDraw = true;
        }
    },
    playerOneMatchWins: function() {
        if (this.playerOneMatchWins === 3 && this.numOfMatches !== 5) {
            // Open modal winner of game
            this.gameWinner = 'X'
            this.playerOneGameWins++
        }
    },
    playerTwoMatchWins: function() {
        if (this.playerTwoMatchWins === 3 && this.numOfMatches !== 5) {
            // Open modal winner of game
            this.gameWinner = 'O'
            this.playerTwoGameWins++
        }
    }
  },
  computed: {
    haveAWinner() {
        return this.gameResult(this.gameBoard.flat())
    },
    formatedTimer() {
        return `${this.formatNumber(this.hours)}:${this.formatNumber(this.minutes)}:${this.formatNumber(this.seconds)}`
    },
    formatedTotalTimer() {
        return `${this.formatNumber(this.totalHours)}:${this.formatNumber(this.totalMinutes)}:${this.formatNumber(this.totalSeconds)}`
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
                // Open modal
                boardValue[firstCell] === 'X' ? this.playerOneMatchWins++ : this.playerTwoMatchWins++;
                
                this.pauseTimer()

                this.numOfMatches++;
                
                return boardValue[firstCell];
            }
        }

        if(boardValue.find(cell => cell === '') === undefined) {
            // Open modal
            this.numOfMatches++;

            this.hadAMatchDraw = true;

            this.pauseTimer();
        }
       
        return null;
    },
    chooseCell(line, cell) {
        if (this.gameBoard[line][cell] || this.haveAWinner) return

        if(!this.timerOn) this.startTimer()

        this.gameBoard[line][cell] = this.currentPlayer

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
    },
    restartMatch() {
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
        this.lastFirstPlayer = this.lastFirstPlayer === 'X' ? 'O' : 'X';
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
        this.totalHours = this.totalHours + this.hours,
        this.totalMinutes = this.totalMinutes + this.minutes,
        this.totalSeconds = this.totalSeconds + this.seconds,
        this.hours = 0,
        this.minutes = 0,
        this.seconds = 0,
        this.timer = null,
        this.timerOn = false
    },
    formatNumber(num) {
        return num < 10 ? `0${num}` : num;
    },
    setFirstPlayerRamdomly() {
        Math.floor(Math.random() * 2) === 0
            ? this.currentPlayer = 'X'
            : this.currentPlayer = 'O'
        
        this.lastFirstPlayer = this.currentPlayer
    },
    getImageUrl(player) {
        return new URL(`../../assets/images/${player}_dark.svg`, import.meta.url).href
    }
  },
  mounted() {
    this.setFirstPlayerRamdomly()
  }
});
</script>

<style lang="scss" scoped src="./style.scss" />