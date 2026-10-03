# Remaining macOS checks

October 3, 2026. Use this Week 8 review branch. Use made-up accounts and notes. The test plan has 33 cases. Instructor approval stays **Not verified** until a record shows which cases were approved.

## Start the app

From the repository root in Terminal:

```sh
cd desktop-electron-app
env -u ELECTRON_RUN_AS_NODE npm start
```

Record the date, macOS version, Electron version, VoiceOver version, source hash file, tester name, and results. Keep a short recording for focus and speech. Do not mark a case passed based on this checklist alone.

## VoiceOver and keyboard

1. Start VoiceOver with Command+F5, or through macOS Accessibility settings. Use the same key to stop it when done.
2. At Log in, verify the heading, Email, Password, and buttons are read with clear names and roles. Submit an empty form. Verify each error and the summary focus. Check SP-09.
3. Go to Sign up. Submit blank fields, then fill some fields and submit again. Check linked errors and retained values. Check SP-11.
4. Enter mismatched passwords. Verify focus goes to confirmation and the error is spoken. Check SP-12.
5. Create a demo account. Verify Account created is read. Return to Log in. Try a wrong password, then the right one. Verify generic errors and dashboard focus. Check HP-15, HP-16, HP-17, and SP-10.
6. Test Forgot password with a registered demo email and an unknown email. Confirm both show the same response. Test both return routes. The app does not send email. Check HP-18, HP-19, and SP-13.
7. In the sample workspace, use only Tab, Shift+Tab, arrows, Home, End, Enter, Space, F6, and Shift+F6. Visit Dashboard, Appointments, Settings, Help, and each toolbar action. Check HP-02, HP-03, HP-04, and HP-06.
8. Search for therapy, then zzzz. Verify the count and empty result are spoken. Clear the search. Check HP-05 and SP-01.
9. Edit and save a note. Confirm speech announces the result without stealing focus. Check HP-07 and HP-12.
10. Test Settings save and Cancel, then the appointment context menu and copy. Verify the speech and focus return. Check HP-08, HP-09, and SP-07.
11. Repeat sign-in, sign-up, and recovery at 200% and 400% zoom. Reach every control and scroll with the keyboard. Check HP-20 and SP-06.

## Native menus and shortcuts

Test every shortcut in `docs/electron/CareConnect_Desktop_Keyboard_Shortcuts_Reference.docx`. For macOS, check Command+1, Command+2, Command+N, Command+S, Command+F, Command+comma, F1, Command+plus, Command+minus, Command+0, and Control+Command+F. Check native Edit commands and close/minimize/restore commands too. Use the macOS keyboard route to the menu bar and move through File, Edit, View, Window, and Help. Note any OS conflict or special function-key setting.

For each command, record the starting state, key used, result, and focus after the action. Automated menu callbacks prove IPC behavior, but they do not prove every physical shortcut works. Check HP-10. For unsaved window close, click both Keep editing and Discard changes in the actual native prompt. Check SP-04; the automated close test stubs the choice.

## Actual macOS contrast and motion

Record current settings first. In System Settings, Accessibility, Display, enable Increase Contrast and Differentiate Without Color. Check text, boundaries, selected visits, errors, focus, menus, and auth pages. Restore your settings when done. Check HP-13.

Enable Reduce Motion. Trigger validation, selection, save/copy feedback, and recovery states. Confirm no flashing or motion-only feedback appears. Restore the prior setting. Check SP-08. The automated run used media emulation; it did not change or verify these OS settings.

## Record the result

Add one row per case with Pass, Fail, or Blocked, plus evidence path and any defect. Keep Not verified if a check was not run. Keep instructor approval separate from the result.
