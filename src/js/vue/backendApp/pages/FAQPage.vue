<template>
    <div>
        <h1>Frequently Asked Questions</h1>

        <div style="margin-top: -30px; padding-top: 30px" id="save-frequency">
            <div class="card">
                <h2>How frequently does Typio save my input?</h2>
                <p>Typio does not save your data in a fixed interval, but rather saves it as you are typing with a one second throttle (meaning it will trigger a save maximum once every second, regardless of your typing speed). It also saves before navigating away from every page.</p>
                <p>If your form input is lost it is likely due to something else.</p>
            </div>
        </div>

        <div style="padding-top: 30px" id="input-not-saved">
            <div class="card">
                <h2>Why wasn't input wasn't saved?</h2>
                <p>Typio does its best to save all of your form data, and in most cases it does a great job. There are however a few edge cases Typio is unable to deal with due to browser restrictions.</p>

                <h3>Cross domain iframes</h3>
                <p>Sometimes websites embed content from other sources. This is common with certain comment/contact solutions (Disqus, for example). Due to browser restrictions Typio cannot access anything from within the embedded frame. If the source of the frame is on the same domain, Typio has no problems accessing and saving your data. Form elements within Shadow DOM are also supported.</p>

                <h3>Sub domains</h3>
                <p>Typio separates the data for each domain into individual storage buckets. That means that if you type something on foo.example.com you will not be able to view the data on bar.example.com. If you cannot find your data, make sure to double check you are on the same domain as where you typed it. This is easy to miss on sites like tumblr.com where each profile has its own subdomain, or craigslist, where each advertisement gets its own subdomain.</p>

                <h3>Still lost?</h3>
                <p>If you still can't find the data, try to reproduce the steps and <a target="_blank" href="https://github.com/tsukumijima/typio-form-recovery-reboot/issues/new">file a bug report</a>.</p>
            </div>
        </div>

        <div style="padding-top: 30px" id="cannot-auto-restore">
            <div class="card">
                <h2>Why can some entries not be automatically restored?</h2>
                <p>There are a few cases when Typio is unable to restore your data automatically. You can always access your data through the recovery window, and you can restore it manually by copying and pasting it.</p>

                <p>Typio is unable to automatically restore an entry in the following cases:</p>

                <h3>The original input field cannot be found</h3>
                <p>In order for Typio to automatically restore an entry, it needs to find the original input field on the page. If the input field does not exist on the current page, or if it cannot be found in the same place (path has changed), Typio won't be able to auto-restore the entry.</p>

                <h3>The input field is of type contentEditable</h3>
                <p>Input fields of the type contentEditable are known to not function correctly after being manipulated programmatically. Typio has no way of knowing whether the input field can be manipulated programmatically or not, and because they more often than not cause problems, Typio will not automatically restore into this input field type.</p>
            </div>
        </div>

        <div style="padding-top: 30px" id="input-broken-after-restoration">
            <div class="card">
                <h2>Why do some input fields break after restoring into them?</h2>
                <p>In order for Typio to restore input, it needs to change the value of the input field programatically. Unfortunately, some input fields are not built to understand changes that happen programatically, and they might not function as normal after being manipulated</p>
                <p>If an input field doesn't work like it should after restoring into it, please restore the value manually by copying it from the recovery window (right click anywhere -> Open recovery). You might need to refresh the page in order for the broken input field to function as it should again.</p>
            </div>
        </div>

        <div style="padding-top: 30px" id="qa-cant-open-for-contenteditable">
            <div class="card">
                <h2>Why can't the Quick Restore Popup open for some input fields?</h2>
                <p>Input fields of the type contentEditable have a tendency to not function as expected after restoring into them. When trying to open Quick Restore for a contentEditable field, the Recovery Window will open instead. From there, you can manually restore the data by copying and pasting it.</p>
            </div>
        </div>

        <div style="padding-top: 30px" id="error-input-not-found">
            <div class="card">
                <h2>Error: Cannot find a focused input field</h2>
                <p>You might encounter this error when attempting to open Quick Restore with the icon or with the keyboard shortcut. This problem occurs when the input field is of type contentEditable and the website manipulates the field. Typio is still active and working, but the Quick Restore popup cannot show. You can access your data through the recovery dialog (right click anywhere &gt; Open form recovery).</p>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "FAQPage"
    }
</script>