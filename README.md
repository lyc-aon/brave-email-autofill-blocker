# Email/Password Autofill Blocker

<p align="center">
  <img src="icons/icon128.png" alt="Lycaon Solutions" width="128">
</p>

<p align="center">
  <strong>A 5-minute fix for a 5-year-old Brave issue.</strong>
</p>

<p align="center">
  <a href="https://github.com/werewolfbiologics/brave-email-autofill-blocker/issues">Report Bug</a>
  ·
  <a href="https://github.com/werewolfbiologics/brave-email-autofill-blocker/issues">Request Feature</a>
</p>

---

## The Problem

Brave bundles email autofill with address autofill in a single toggle. If you use a third-party password manager like **Proton Pass**, **Bitwarden**, or **1Password**, Brave's built-in autofill competes with it and causes conflicts.

**This has been an [open issue since 2021](https://github.com/AXeL-dev/brave-browser/issues/XXX).** We fixed it in ~50 lines of code.

## Installation

### Chrome / Brave / Edge (Manual)

1. Download or clone this repo
2. Go to `brave://extensions` (or `chrome://extensions` / `edge://extensions`)
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the folder containing this extension

### Firefox (Manual)

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the `manifest.json` file

## What It Does

**Blocks browser autofill on:**
- Email fields (`type="email"`, `name="email"`, etc.)
- Username fields (`name="user"`, `name="login"`, etc.)
- Password fields (`type="password"`)

**Leaves alone:**
- Address fields
- Phone number fields
- Credit card fields

## How It Works

The extension sets `autocomplete="off"` and related attributes on login-related input fields, preventing the browser's built-in autofill from activating. Your password manager extension can then fill these fields without interference.

## Technical Details

- **Zero permissions required** - no access to your data
- **Lightweight** - single content script, no background processes
- **Fast** - runs at `document_start` and uses MutationObserver for dynamic content
- **Universal** - works on all websites

## Contributing

Found a site where it doesn't work? Open an issue with the URL and we'll fix it.

## License

MIT - Do whatever you want with it.

---

<p align="center">
  Built with frustration by <a href="https://github.com/werewolfbiologics">Lycaon Solutions</a>
</p>
