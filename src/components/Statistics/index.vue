<template>
    <main>
        <h2>Awesome statistics</h2>
        <p>All statistics in one place!</p>

        <section class="stats-wrapper">
            <div class="stats-item">
                <h2>Game victories %</h2>

                <div class="game-victories-container">
                    <div v-for="(item, index) in statsArray" :key="index" class="game-victories-item">
                        <p>{{ item.name }}</p>

                        <div class="circles-wrapper">
                            <div class="circles">
                                <div class="circle">{{ this[item.wins] }}%</div>
                                <div class="circle">{{ this[item.loses] }}%</div>
                            </div>

                            <div class="victory-lose-wrapper">
                                <div class="victory-lose">V</div>
                                <div class="victory-lose">L</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-item">
                <div class="played-matchs">
                    <h2>Played matchs</h2>
    
                    <div class="played-wrapper">
                        <div v-for="(item, index) in playedMatchs" :key="index" class="played-item" :class="item" />
                    </div>
                </div>

                <div class="game-history">
                    <h2>Game history</h2>
    
                    <div class="history-wrapper">
                        <div v-for="(item, index) in gameHistory" :key="index" class="history-item">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="timer-wrapper">
            <h2>Total time</h2>
          
            <div class="timer">
                {{ formatedTotalTimer }}
            </div>
        </section>
    </main>
</template>

<script>
import { defineComponent } from 'vue';
import mixins from '@/mixins/index.vue';

export default defineComponent({
    name: 'Statistics',
    mixins: [mixins],
    props: {
        stats: {
            type: Object,
            required: true
        }
    },
    data: function() {
        return {
            statsArray: [
                {
                    name: 'Player 1',
                    wins: 'percentageOfPlayerOneWins',
                    loses: 'percentageOfPlayerTwoWins',
                },
                {
                    name: 'Player 2',
                    wins: 'percentageOfPlayerTwoWins',
                    loses: 'percentageOfPlayerOneWins',
                }
            ],
        }
    },
    computed: {
        formatedTotalTimer() {
            const { totalSeconds, totalMinutes, totalHours } = this.stats

            return `${this.formatNumber(totalHours)}:${this.formatNumber(totalMinutes)}:${this.formatNumber(totalSeconds)}`
        },
        percentageOfPlayerOneWins() {
            const { playerOneGameWins, playerTwoGameWins } = this.stats

            const result = (playerOneGameWins / (playerOneGameWins + playerTwoGameWins) * 100).toFixed(0)

            return result === 'NaN' ? 0 : result
        },
        percentageOfPlayerTwoWins() {
            const { playerOneGameWins, playerTwoGameWins } = this.stats

            const result = (playerTwoGameWins / (playerOneGameWins + playerTwoGameWins) * 100).toFixed(0)

            return result === 'NaN' ? 0 : result
        },
        gameHistory() {
            const gameHistory = this.stats.gameHistory
            const gameHistoryClone = [...gameHistory]

            return [
                ...gameHistoryClone.splice(0,10),
                ...gameHistory.length < 10
                    ? new Array(10 - gameHistory.length)
                    : []
            ]
        },
        playedMatchs() {
            const playedMatchs = this.stats.numOfMatchesTotal
            const playedMatchsClone = [...playedMatchs]

            return [
                ...playedMatchsClone.splice(0,10),
                ...playedMatchs.length < 10
                    ? new Array(10 - playedMatchs.length)
                    : []
            ]
        }
    }
});
</script>

<style lang="scss" scoped src="./style.scss" />