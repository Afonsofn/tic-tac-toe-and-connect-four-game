<template>
  <main class="main-wrapper">
    <Header />
    <Profile />
    <GameArea />
    <Statistics />
    <Footer />
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import Header from './components/Header/index.vue'
import Profile from './components/Profile/index.vue'
import GameArea from './components/GameArea/index.vue'
import Statistics from './components/Statistics/index.vue'
import Footer from './components/Footer/index.vue'

export default defineComponent({
  name: 'App',
  components: { Header, Profile, GameArea, Statistics, Footer },
});
</script>
