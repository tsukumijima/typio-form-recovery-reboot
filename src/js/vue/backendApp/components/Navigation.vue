<template>
    <div class="navigation">
        <p class="title">Typio Form Recovery Reboot</p>

        <navigation-renderer :items="menuItems"></navigation-renderer>
    </div>
</template>

<script>
    import NavigationRenderer from './NavigationRenderer.vue';

    export default {
        name: "Navigation",
        components: {
            NavigationRenderer,
        },
        data() {
            return {
                menuItems: [
                    { label: 'Options', routeName: 'options', icon: 'icon-cog', children: [
                        { label: 'Save & restore', routeName: 'options', routeHash: '#save-options' },
                        { label: 'Restore icon', routeName: 'options', routeHash: '#restore-icon' },
                        { label: 'Save indicator', routeName: 'options', routeHash: '#save-indicator' },
                        { label: 'Domain blacklist', routeName: 'options', routeHash: '#blacklist' },
                        { label: 'Keyboard shortcuts', routeName: 'options', routeHash: '#keyboard-shortcuts' },
                        { label: 'Context menu', routeName: 'options', routeHash: '#context-menu' },
                    ] },
                    { label: 'Feedback', routeName: 'feedback', routeHash: '', icon: 'icon-megaphone' },
                    { label: 'Frequently Asked Questions', routeName: 'faq', routeHash: '', icon: 'icon-help-circled', children: [
                        { label: 'How frequently does Typio save my input?', routeName: 'faq', routeHash: '#save-frequency' },
                        { label: 'Why wasn\'t input wasn\'t saved?', routeName: 'faq', routeHash: '#input-not-saved' },
                        { label: 'Why can some entries not be automatically restored?', routeName: 'faq', routeHash: '#cannot-auto-restore' },
                        { label: 'Why do some input fields break after restoring into them?', routeName: 'faq', routeHash: '#input-broken-after-restoration' },
                        { label: 'Why can\'t the Quick Restore Popup open for some input fields?', routeName: 'faq', routeHash: '#qa-cant-open-for-contenteditable' },
                        { label: 'Error: Cannot find a focused input field', routeName: 'faq', routeHash: '#error-input-not-found' },
                    ] },
                    { label: 'Privacy Information', routeName: 'privacy', routeHash: '', icon: 'icon-lock' },
                ]
            }
        },
        mounted() {
            const rootLis = document.querySelectorAll('.root-level > li');

            for(const li of rootLis) {
                li.addEventListener('mouseenter', this.onRootLiMouseEnter);
                li.addEventListener('mouseleave', this.onRootLiMouseLeave);
            }
        },
        methods: {
            onRootLiMouseEnter(e) {
                e.target.classList.add('hover');
            },
            onRootLiMouseLeave(e) {
                e.target.classList.remove('hover');
            },
        },
    }
</script>

<style lang="scss" scoped>

    .navigation {
        padding: 80px 0 0;
    }

    .title {
        color: #101925;
        margin-bottom: 30px;
        font-size: 20px;
        background: #FFF;
        display: inline-block;
        margin-left: 30px;
        padding: 6px 11px;
        font-weight: 300;
    }

</style>