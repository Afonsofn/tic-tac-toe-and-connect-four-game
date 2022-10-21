<template>
    <main>
        <section>
            <h3>About page</h3>
            <h4>Play tic tac toe or 4-in-a-row anytime!</h4>
            <h4>Created by @RaulAfonso</h4>
        </section>

        <section>
            <h3>Contacts</h3>
            <h4>(81) 98188-8778</h4>
            <h4>Rua Av. Dr. Dirceu Velloso Tocascano de Brito, N 71, Recife, PE.</h4>
        </section>

        <section>
            <h3>Stay in touch</h3>

            <div class="social-medias">
                <img src="@/assets/images/facebook.svg" alt="Facebook Logo">
                <img src="@/assets/images/instagram.svg" alt="Instagram Logo">
                <img src="@/assets/images/twitter.svg" alt="Twitter Logo">
            </div>

            <div class="input-wrapper">
                <input type="text" placeholder="Subscribe our games" v-model="email">
                <button><img src="@/assets/images/send.svg" alt="Facebook Logo"></button>
            </div>
        </section>
    </main>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  data: function() {
    return {
        email: '',
    }
  }
});
</script>

<style lang="scss" scoped src="./style.scss" />