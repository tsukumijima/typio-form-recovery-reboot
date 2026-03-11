<template>
    <div class="keyboard-shortcut-picker" @click="emitResponse('cancel')">
        <p class="big">{{ pressedKeys.join(' + ') || 'Enter keyboard combination on your keyboard' }}</p>

        <div class="actions">
            <button @click="emitResponse('disable') && $event.stopPropagation()">Disable keyboard shortcut</button>
            <button @click="emitResponse('reset') && $event.stopPropagation()">Reset to default</button>
            <button @click="emitResponse('cancel') && $event.stopPropagation()">Cancel</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "KeyboardShortcutPicker",
        data() {
            return {
                pressedKeys: [],
            }
        },
        mounted() {
            document.activeElement.blur();
            document.addEventListener('keydown', this.onKeyDown);
            document.addEventListener('keyup', this.onKeyUp);
        },
        destroyed() {
            document.removeEventListener('keydown', this.onKeyDown);
            document.removeEventListener('keyup', this.onKeyUp);
        },
        methods: {
            onKeyUp(e) {
                if(this.pressedKeys.length > 1) {
                    this.emitResponse('set', this.pressedKeys);
                }
                this.pressedKeys = [];
            },
            onKeyDown(e) {
                e.preventDefault();
                e.stopPropagation();

                // Normalize non-alphabetic key names so they survive the
                // alphabetic-only regex in comoStrToArray (keyboardShortcuts.js)
                const key = e.key === ' ' ? 'Space' : e.key;

                if(this.pressedKeys.includes(key)) {
                    return;
                }

                if(key === 'Escape') {
                    return this.emitResponse('cancel');
                }

                this.pressedKeys.push(key);

            },
            emitResponse(responseType, responseValue) {
                this.$emit('change', {
                    responseType,
                    responseValue,
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .keyboard-shortcut-picker {
        position: fixed;
        z-index: 10;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.8);
        color: #FFF;
        animation: pickerIn .8s;
        animation-timing-function: cubic-bezier(0.075, 0.820, 0.165, 1.000); /* easeOutCirc */

        .big {
            font-size: 40px;
            font-weight: 300;
            margin: 0 0 60px;
        }

        .actions {
            margin-bottom: 100px;
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            margin: 0 10px;
        }

        @keyframes pickerIn {
            from {
                transform: scale(1.2);
                opacity: 0;
            }
        }
    }
</style>