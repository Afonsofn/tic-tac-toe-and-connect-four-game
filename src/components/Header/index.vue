<template>
    <header>
        <img src="@/assets/images/SWORD_Health_logo.svg" alt="Sword Logo">
        
        <section>
            <h3>Frontend developer</h3>
            <h4>Challenge</h4>
        </section>
    </header>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Header',
    methods: {
        addTransparencyToHeader() {
            const { classList } = document.querySelector("header")

            window.addEventListener('scroll', function() { 
                if (window.scrollY >= 150) return classList.add("transparent")

                classList.remove("transparent")
            })
        }
    },
    mounted() {
        this.addTransparencyToHeader();
    }
});
</script>





<style lang="scss" scoped src="./style.scss" />