<template>
    <div>
        <h1>Privacy Information</h1>

        <div class="card">
            <h2>Privacy policy</h2>
            <p>The main purpose of Typio is to backup and restore form input data. In order for Typio to do this it needs to save your form input as you enter it. Any user input Typio stores is stored only for the purpose of restoration and is never uploaded to any servers. <strong>Your data stays on your computer.</strong></p>
            <p>You are in control of which sites Typio is enabled on and how long your data is stored. This can be configured in the extension options page.</p>
            <p>The source code for Typio is available to view on <a target="_blank" href="https://github.com/tsukumijima/typio-form-recovery-reboot">GitHub</a>.</p>
        </div>


        <div class="card">
            <h2>Permission Information</h2>
            <p>Typio, like all other extensions, needs access to certain features in your browser in order to function. In order to remain transparent, here is a list of all permissions Typio request and a description of its use case.</p>

            <h3>Tabs</h3>
            <p>Typio needs to access webpages you visit in order to save the input you enter. The tabs permission gives Typio permission to do that.</p>

            <h3>http://*/* and https://*/</h3>
            <p>These permissions specify which webpages Typio has access to. It is used in combination with the tabs permission.</p>

            <h3>storage</h3>
            <p>Because Typio keeps your data securely on your computer (and never uploads it to the cloud), it needs the storage permission to save it.</p>

            <h3>unlimitedStorage</h3>
            <p>The standard storage permission has a limit in how much you can store. The unlimitedStorage permission allows Typio to surpass that limit. Typio doesn't need much space, but if the save duration is long, the database might grow larger with time.</p>

            <h3>contextMenus</h3>
            <p>Needed for Typio to add the "Open Form Recovery" item in the right-click menu.</p>

            <h3>idle</h3>
            <p>Typio needs to do some maintenance of the database sometimes. In order to keep your browsing experience smooth and snappy, it's better to do that when the computer is idle and not in use.</p>

            <h3>alarms</h3>
            <p>Typio uses alarms to periodically schedule database maintenance in Manifest V3. This keeps old entries cleaned up even though the background script is no longer always running.</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PrivacyPolicyPage"
    }
</script>
