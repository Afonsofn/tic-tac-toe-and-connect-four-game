<template>
    <main>
        <section class="resume">
            <img src="@/assets/images/raul-photo.jpeg" alt="Raul Photo">
            
            <div>
                <h1>Raul Afonso</h1>
                <p>Age: 24</p>
                <p>Location: Recife</p>
                <p>Occupatin: Frontend Developer</p>
            </div>
        </section>

        <section class="about-me">
            <p>About me:</p>
            <p>
                Heyy, I'm Raul Afonso, from Recife, Pernambuco, Frontend/Mobile developer,
                lover of technology and everything that orbits in this incredibly fascinating universe,
                I'm getting deeper and deeper in knowledge so that I can be part of great projects that
                have an impact real in people's lives.
            </p>
        </section>
    </main>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Profile',
});
</script>

<style lang="scss" scoped src="./style.scss" />