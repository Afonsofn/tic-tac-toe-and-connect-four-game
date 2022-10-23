<script>
export default {
    methods: {
        formatNumber(num) {
            return num < 10 ? `0${num}` : num;
        },
    }
};
</script>