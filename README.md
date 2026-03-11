# Typio Form Recovery Reboot

This repository is the source code for a modified version of [Typio Form Recovery](https://chrome.google.com/webstore/detail/typio-form-recovery/djkbihbnjhkjahbhjaadbepppbpoedaa).

The original repository is at https://github.com/ctsstc/typio-form-recovery-reboot, but due to the upgrade to Vue 3.x and other reckless changes, some of the code that used to work no longer works.  
Given the number of changes from Vue 2.x -> 3.x, the magnitude of the changes, and my lack of familiarity with this code, it does not seem practical to switch to Vue 3.x.

In this forked repository, my priority was to keep the dependencies updated to minor versions and keep the usability as before.
Since Chrome deprecated Manifest V2 extensions in 2025, this fork has been migrated to Manifest V3 as of version 4.0.0.

Please submit feedback or bugs on the [Issues](https://github.com/tsukumijima/typio-form-recovery-reboot/issues) page.

## Manifest V3

As of version 4.0.0, this fork targets Chrome Extension Manifest V3. Chrome fully removed support for Manifest V2 extensions in 2025, making this migration necessary.

The core Typio behavior remains the same:

- Typio auto-saves form input locally in `chrome.storage.local`
- Typio can recover lost input after reloads, crashes, or accidental navigation
- Most existing UI and workflow behavior is intentionally preserved

Known limitations remain largely the same as before:

- `contentEditable` fields are still best recovered through the Recovery Dialog instead of automatic restore
- Some heavily dynamic SPA and iframe editors may behave slightly differently depending on how the site rewrites the DOM
- Database maintenance timing is now alarm-based in Manifest V3, so cleanup timing may differ slightly from older releases

## Download

An archive of pre-built Chrome extensions can be found on the [Releases](https://github.com/tsukumijima/typio-form-recovery-reboot/releases) page.

## Changelog

### Version 4.0.0 (12th March, 2026)
- Change: Migrated from Manifest V2 to Manifest V3
  - Background page (`persistent: true`) replaced with a service worker
  - `chrome.extension.getURL` replaced with `chrome.runtime.getURL`
  - `browser_action` replaced with `action`
  - `<all_urls>` moved from `permissions` to `host_permissions`
  - `web_accessible_resources` updated to MV3 object format
  - `chrome.idle.onStateChanged` listener replaced with `chrome.alarms` + `chrome.idle.queryState` (service workers cannot use persistent listeners)
  - Context menus are now rebuilt on `onInstalled` and `onStartup` to survive service worker restarts
  - Added `alarms` permission for periodic database maintenance scheduling
- Change: Upgraded build toolchain from Webpack 4 to Webpack 5
  - Removed `NODE_OPTIONS=--openssl-legacy-provider` workaround (no longer needed with Webpack 5)
  - Replaced `strip-loader` with TerserPlugin `pure_funcs` for `console.log` / `console.trace` removal
  - Replaced `minify-html-webpack-plugin` with `copy-webpack-plugin`
  - Removed unused `file-loader` and `to-string-loader`
- Fix: Domain blacklist wildcard matching only escaped the first dot in patterns (e.g. `*.example.com`)
- Fix: Editable element cache failed to remove stale DOM nodes (affected sites like Twitter that replace DOM elements)
- Fix: `SessionList.merge()` failed to merge entries for existing sessions due to incorrect property access
- Fix: `options.set()` crashed with `ReferenceError` when called with a non-existent option name
- Fix: Incorrect comment "Delete entire field if empty" corrected to "Delete entire domain if empty"
- Fix: Missing `.length` in `Object.keys()` comparison for empty domain check in maintenance routine

### Version 3.3.0 (12th March, 2023)
- Fix: Text box style collapse when using dark mode
- Fix: "TypeError: _vm.getEventTarget is not a function"
- Change: Upgrade dependencies

### Version 3.2.5 (16th February, 2023)
- Fix: `Uncaught TypeError: Cannot read properties of undefined (reading '0')`. In Chrome v109 (Jan. 2023 Release) `event.path` was deprecated and replaced with `event.composedPath()`. This fixes that across the codebase by utilizing a new `getEventTarget` helper function to centralize the fix.

### Version 3.2.4 (27th September, 2020)
- Fix: Fix Recovery Window stuck at "loading entries" forever
- Fix: Fix collision with some embedded video players

### Version 3.2.3 (18th September, 2020)
- Important: The Quick Restore popup will no longer show for contentEditable fields. These fields are known to not function as they should after restoring into them. Typio will no longer automatically restore data into these fields because there is no safe way of doing it. Your data can still be accessed from the Recovery Window and can be manually restored by copying and pasting it.
- New: Better support for re-usable input fields (common in chat applications)
- New: Better support for state based applications (React, Vue, Angular etc)
- New: The Quick Restore Icon now re-positions with input fields if they change in size
- New: Focus is now restored to the input after using the Quick Restore Popup to restore
- New: More accurate text preview in the Recovery Window.
- New: Improved copy function with better whitespace handling
- New: Updated FAQ page with more information
- New: The options page has been rewritten from ground up
- New: The entire extension has been refactored to es6 modules and the build process has been updated and improved.
- Fix: Fix edge cases with iframe editors
- Fix: Radio buttons are now saved and restored more reliably
- And as usual, lots of other bug fixes and preparation for future releases

### Version 2.4.1 (1st August, 2020)
- Fix: In the Recovery Window, "Recover session" would not recover entries hidden hidden by the filters.
- Fix: Editable cache is now cleared before opening the Quick Access popup (from icon) and the Recovery Window. This will resolve some edge case issues related to "Cannot be auto-restored" messages. It also fixes a bug where in some cases nothing would happen when hovering entries in the Quick Access popup.
- Fix: "Maximum call stack size exceeded" error from Path Generator.

### Version 2.4.0 (29th July, 2020)
- New: You can now press Shift Delete to delete items in the Quick Access menu (from the icon).
- New: Typio now stores the origin URL for each session (see "View page" next to the timestamp in the recovery window).
- New: The "Restore previous session" keyboard shortcut now tries to restore the previous session for the currently focused input field. If no input is focused Typio will restore the previous session (regardless if the inputs exist or not).
- Fix: The "Restore previous session" keyboard shortcut is now more reliable.
- Fix: The Copy button sometimes didn't work in the recovery window when the entry was of type contenteditable. This is fixed now.

### Version 2.3.4 (16th June, 2019):
- Fix: Remove forgotten console.debug

### Version 2.3.3 (29th May, 2019):
- Fix: Scrollbar bug in Recovery Dialog.

### Version 2.3.2 (9th March, 2019):
- Fix: Performance improvements for frame injection.
- Fix: Bug fixes for blacklist.

### Version 2.3.1 (8th Feb, 2019):
- New: Permissions description page.
- Change: In the last update I accidentally included the "Downloads" permission which will be used in a future feature (database manager) that is being developed. The Downloads permission was not being used and was understandably causing confusion, so I removed it. (https://bitbucket.org/nicklassandell/chrome-form-recovery/issues/75/extension-suddenly-asking-for-mange)

### Version 2.3.0 (8th Feb, 2019):
- New: Changed blacklist to match against full URL path instead of just hostname (useful with regex)
- Change: Disabled Save Indicator by default (can be re-enabled in options)
- Preparation for future release (DB manager).

### Version 2.2.0 (6th Dec, 2018):
- New: Storage statistics in recovery window
- New: Added "loading" text in recovery window for large databases (previously displayed "no entries found" which is misleading)
- Fix: Clarified text for "input found/not found" in recovery window and added tooltip text for explanation.

### Version 2.1.1 (4th Dec, 2018):
- Fix: XSS security fix (report #67)
- Fix: Minor design fixes

### Version 2.1.0 (18th Nov, 2018):
- Fix: Significantly improve loading speed for Typio (quicker initialisation)
- Fix: Icon loading is no longer a blocking event
- Fix: "Site is blacklisted" popup would sometimes pop up multiple times. It was a bit excessive, so I fixed it.

### Version 2.0 (10 Nov, 2018):
- New: Regex support for blacklist
- New: Option to reset all fields between restorations
- New: Option to clone entries upon restoration
- New: Support for multiple concurrent same-domain tabs (previously did not work properly due to storage method restrictions)
- New: Changed storage method, now much more reliable. (Moved from IndexedDB to chrome.local.storage)
- New: UI updates
- Fix: Error messages sometimes thrown by save indicator
- Fix: Icon support for sites with strict CSP
- Fix: Typio now detects subtree changes in contenteditable fields (such as using modifier buttons in rich text fields)

### Version 1.8.6 (23 Mar, 2018):
- Fix: Fix broken scrolling in options page caused by recent Chrome update.
- Fix: Fix selection issues in quick restore popup
- Fix: Save delay shortened
- Fix: Hide Restore Icon on inputs smaller than 80px in width (only with "focus" trigger)
- Fix: Keyboard shortcut window now displays disabled shortcuts better
- New: Added link to open keyboard shortcuts window in toolbar popup

### Version 1.8 (9th Mar, 2018):
- New: Restore icon next to inputs (configurable in options)
- New: Quick Restore now has keyboard support
- New: Added option to hide Typio in context menu (in favor of keyboard shortcuts)
- New: Smarter restoration of entries that contain formatting
- New: "You have disabled Typio on this site" message now gives you the option to enable Typio
- New: Smarter display of entries in Quick Restore (Strips formatting and whitespace)
- Fix: Bug fix for encapsulation injection on certain sites (polymer-project.org)
- Fix: Keyboard shortcuts can now be pressed in any order
- Fix: Fix some positioning issues with Quick Restore popup
- Fix: "Delete all" now actually deletes all entries, including current session.
- Fix: Fix bug that would cause database to be cleared upon refreshing the page multiple times quickly (see [issue #28](https://bitbucket.org/nicklassandell/chrome-form-recovery/issues/28/multiple-repeated-page-reloads-clears)).

### Version 1.7 (16th Feb, 2018):
- New: Added support for websites using XML content types (battle.net)
- New: Added edge detection for positioning right-click popup menu.
- New: Quick restore popup menu no longer excludes current session data.
- New: Added ability to set your own keyboard shortcuts
- Change: Changed default keyboard shortcuts to prevent issues on Mac OS


### Version 1.6.2 (8th Feb, 2018):
- Change: Changed keyboard shortcut hints to reflect changes from last version.

### Version 1.6.1 (7th Feb, 2018):
- Change: Remapped keyboard shortcut for opening recovery dialog from Ctrl+Del to Alt+Del to prevent unwanted behaviour (collision with existing behaviour).

### Version 1.6 (Jan 11th 2018)
Primarily a maintenance release. Improves performance and fixes a couple minor annoyances.

- New: Added navigation to options page
- New: Toolbar popup has been redesigned
- New: Save to database is now delayed to prevent stress on storage and improve performance.
- Fix: Fixed bug that sometimes caused multiple domains to be removed from blacklist when unblocking.
- Fix: Minor improvement to save indicator animation to prevent stutter
- Change: Current session data is now visible in recovery dialog to avoid confusion. It was previously hidden by design, because generally you will never need to recover data that is already present.

### Version 1.5 (Dec 15th 2017)
Fixes some pesky bugs and introduces some new features.

- New: You can now pick your own color for the save indicator (see options)
- New: Moved "hide small entries" option onto top of entry list for better access
- New: Typio now attempts to ignore credit card numbers (see option in settings)
- New: Redesigned options page
- New: Better display of field type in Recovery Dialog (field name and type)
- New: Added subtle bounce animation for switching pages in recovery dialog
- New: Slightly delayed frame script injection to allow more time for DOM to finish loading dynamic content (like dynamically created frames)
- Change: Removed word count in Recovery Dialog in favor of field type
- Fix: Changed behaviour of saveIndicator to animate on focus (previously only animated first time an input was focused due to a bug)
- Fix: Typio now ignores any inputs from within the recovery dialog ("hide small entries" checkbox is now ignored)
- Fix: Fixed Recovery Dialog ghost effect on close and added close animation.
- Fix: Critical bugfix for frame injection script that caused certain editors to believe the text had been changed
	- Issue was due to Typio injecting a script tag into each frame. I found an alternative solution to this that doesn't inject any content but rather executes code directly in the frame. This is a much better approach.



### Version 1.4 (Dec 13th 2017)
This update has been in the works for quite a while and brings lots of exciting changes. Under the hood it has undergone a full re-write to optimize the code base and make it easier to work with, but it brings plenty of visible changes as well:

- New: Save indicator to reassure you your text is being saved as you type. Has various styles to choose from and can be disabled in settings.
- New: Support for chat apps (dynamically cleared inputs)
- New: Keyboard shortcuts! Press Ctrl + Delete once to open recovery dialog, press twice to restore previous session.
- New: Context menu now also shows recent entries from other fields
- New: Added option for showing/hiding small values in recovery dialog
- New: Support for nested iframes/shadow dom (better support for modern sites)
- New: Input field type is now stored and displayed in Recovery Dialog
- Fix: Better performance in context menu when big entries are previewed (added truncation)
- Fix: Code is now concatenated to reduce http requests (both js and css)
- Fix: Improved error messages
- Fix: All Typio injected code is now placed within one parent shadowRoot (used to be separate)
- Change: "Pick recovery target" has been deprecated in favor of Copy button (it had issues with iframes and shadow dom)

### Version 1.3 (Aug 24 2017):
*Important!* This update will cause certain input fields to not display old entries in the context menu, but the old entries can still be found in the recovery dialog (right click > open form recovery) and can be recovered by manually selecting a target. The reason for this is due to a change in how every input field is assigned a unique ID to so that the extension can remember which text belongs to what field. The ID algorithm needed certain improvements, partly to add support for certain text editors (WYSIWYG in iframes).

- New: Delete entry link now asks you to confirm (double click)
- New: Support for WYSIWYG editors using iframes (if same host origin)
- Fixed: Lots of bugfixes

### Version 1.2 (Aug 21 2017):
- New: Added recovery dialog. Allows you to browse all saved data on a site and gives you advanced recovery options (rightclick > open form recovery).
- New: Flashes input fields when recovering (useful for recovering sessions).
- New: Faster storage. Now uses in memory storage with asynchronous flat file offloading.
- New: Delete entry button removed from context menu to decrease clutter. Entries can be deleted in recovery dialog instead.
- New: Added support for "select" dropdowns
- Fixed: Saved passwords even when option was set to disabled in some cases
- Fixed: "Delete all" should delete all entries, including current session
- Fixed: Max storage days is now one year (bug prevented setting higher than 7 days)
- Fixed: Better icon for "recover only this field" option in context menu

### Version 1.1:
- New: Added support for more input types, including check/radio boxes, range sliders, color, date etc.
- Fixed: Bug where empty fields were still saved in some cases.
