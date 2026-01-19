# Email/Password Autofill Blocker

A simple browser extension that blocks Brave's (or Chrome's) built-in autofill on username, email, and password fields - so your actual password manager can do its job without the browser fighting it.

## Why?

Brave bundles email autofill with address autofill in a single toggle. If you use a third-party password manager like Proton Pass, Bitwarden, or 1Password, Brave's autofill competes with it and causes annoying conflicts.

[This has been an open issue since 2021.](https://github.com/AXeL-dev/brave-browser/issues/XXX) This extension is a 5-minute fix for a problem Brave hasn't addressed in 5 years.

## Installation

1. Download or clone this repo
2. Go to `brave://extensions` (or `chrome://extensions`)
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the folder containing this extension

## What it does

Blocks browser autofill on:
- Email fields (`type="email"`, `name="email"`, etc.)
- Username fields (`name="user"`, `name="login"`, etc.)
- Password fields (`type="password"`)

Leaves alone:
- Address fields
- Phone number fields
- Credit card fields (handled by separate browser settings anyway)

## License

MIT - Do whatever you want with it.
