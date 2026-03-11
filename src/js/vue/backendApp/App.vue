<template>
    <div class="app">

        <div class="sidebar">
            <navigation class="navigation"></navigation>
        </div>

        <div class="main">
            <router-view class="page-container"></router-view>
        </div>

        <!-- <donate-hint></donate-hint> -->

    </div>
</template>

<script>
    import Navigation from './components/Navigation.vue';
    import DonateHint from './components/DonateHint.vue';

    export default {
        name: "App",
        components: {
            Navigation,
            DonateHint,
        },
        mounted() {
            this.$store.dispatch('options/loadOptionsFromStorage');

            // Vue router doesn't scroll to anchors on page load
            if(this.$route.hash) {
                const el = document.querySelector(this.$route.hash);
                if(el) {
                    el.scrollIntoView(true);
                }
            }
        }
    }
</script>

<style lang="scss">

    body {
        font-family: 'Helvetica', sans-serif;
        font-size: 16px;
        margin: 0;
        overflow-y: scroll;
        background: #f9f9f9;
        color: #444;
        line-height: 1.45;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    a {
        color: #486da7;
        text-decoration: none;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .app {
        display: flex;

        .sidebar {
            position: relative;
            z-index: 1;
            flex: 0 1 auto;
            background: #486da7;
            color: #FFF;
            min-height: 100vh;

            .navigation {
                position: sticky;
                top: 0;
            }

            a {
                color: #FFF;
                text-decoration: none;
                white-space: nowrap;
            }
        }

        .main {
            position: relative;
            flex: 1 1 auto;
            background: #f5f5f5;
            padding: 80px 60px 80vh;

            .top-bar {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                padding: 15px 20px;
                font-size: 14px;
                border-bottom: 1px solid #e2e2e2;
                color: #4a4a4a;
                background: #FFF;

                a {
                    color: #486ca7;
                    text-decoration: none;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }

            .page-container {
                max-width: 800px;
                margin: 0 auto;
            }
        }
    }



    h1, h2, h3 {
        line-height: 1.3;
    }
    h1 {
        font-weight: 300;
        font-size: 42px;
        margin: 0 0 40px;
    }
    h2 {
        font-weight: 400;
        font-size: 23px;
        margin: 0 0 10px 0;
        padding: 0;
        color: #333;
        position: relative;
    }
    h3 {
        font-weight: 400;
        font-size: 20px;
        margin: 30px 0 10px;
    }

    p {
        margin: 0 0 10px 0;
    }


    .card {
        padding: 30px;
        margin-bottom: 20px;
        background: white;
        position: relative;
        border: 1px solid #e4e4e4;

        /*
        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: #00000008;
            border-radius: inherit;
            transform-origin: bottom left;
            transition-duration: .3s;
            pointer-events: none;
            transform: scaleX(1.01) rotate(2deg);
        }
        */

    }




    select, select:hover, select:focus {
        border-radius: 2px;
        background: #FFF;
        padding: 8px 10px;
        font-size: 15px;

        // !important to override default chrome styling
        appearance: none !important;
        background-size: 10px 10px !important;
        background-position: right center !important;
        background-origin: content-box !important;
        background-repeat: no-repeat !important;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzA2IiBoZWlnaHQ9IjE5MCIgdmlld0JveD0iMCAwIDMwNiAxOTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zMDYgMzYuMzVMMjcwLjMgMC42NDk5OTJMMTUzIDExNy45NUwzNS43IDAuNjQ5OTgyTDIuMjU0MmUtMDYgMzYuMzVMMTUzIDE4OS4zNUwzMDYgMzYuMzVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K") !important;
    }

    button {
        border: 1px solid #adadad;
        border-radius: 3px;
        padding: 5px 20px;
        cursor: pointer;

        &:hover {
            background: #e2e2e2;
        }
    }

    input[type=text]{
        border: 1px solid #adadad;
        border-radius: 3px;
    }

    input[type=color] {
        height: 37px;
        position: relative;
        top: 7px;
        margin-top: -7px;
    }

</style>