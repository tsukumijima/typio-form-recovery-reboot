<template>
    <div id="save-indicator"
         title="This is the save indicator for Typio Form Recovery Reboot. Disable or change indicator style in the settings.">
        <div class="animator"></div>
    </div>
</template>

<script>
    import Options from '../../modules/options/options';

    export default {
        name: "saveIndicator",
        data: function() {
            return {
                isVisible: true,
                animator: null
            }
        },
        methods: {
            show: function() {
                this.isVisible = true;
                this.$el.classList.add('visible');
            },
            hide: function() {
                this.isVisible = false;
                this.$el.classList.remove('visible');
            },
            animate: function() {
                if(this.isVisible) {
                    this.animator.style.animation = 'none';
                    this.animator.offsetHeight; // Trigger reflow
                    this.animator.style.animation = null;
                }
            },
        },
        mounted: function() {
            this.animator = this.$el.querySelector('.animator');

            this.$el.classList.add( Options.get('saveIndicator') );

            let hexColor = Options.get('saveIndicatorColor');
            this.$el.style.backgroundColor = hexColor;
            this.$el.style.color = hexColor;
        },
    }
</script>

<style scoped>

</style>