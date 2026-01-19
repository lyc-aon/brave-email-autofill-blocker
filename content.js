// Default settings
const DEFAULT_SETTINGS = {
  blockEmail: true,
  blockUsername: true,
  blockPassword: true,
  blockPhone: false,
  disabledSites: []
};

let settings = { ...DEFAULT_SETTINGS };
let currentHost = window.location.hostname;

// Build selectors based on settings
function getSelectors() {
  const selectors = [];

  if (settings.blockEmail) {
    selectors.push(
      'input[type="email"]',
      'input[name*="email" i]',
      'input[id*="email" i]',
      'input[autocomplete*="email" i]'
    );
  }

  if (settings.blockUsername) {
    selectors.push(
      'input[name*="user" i]',
      'input[name*="login" i]',
      'input[id*="user" i]',
      'input[id*="login" i]',
      'input[autocomplete*="username" i]'
    );
  }

  if (settings.blockPassword) {
    selectors.push(
      'input[type="password"]',
      'input[autocomplete*="current-password" i]',
      'input[autocomplete*="new-password" i]'
    );
  }

  if (settings.blockPhone) {
    selectors.push(
      'input[type="tel"]',
      'input[name*="phone" i]',
      'input[name*="mobile" i]',
      'input[id*="phone" i]',
      'input[id*="mobile" i]',
      'input[autocomplete*="tel" i]'
    );
  }

  return selectors;
}

function blockAutofill(input) {
  // Skip if already processed
  if (input.dataset.autofillBlocked) return;

  // Set attributes that tell browsers not to autofill
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('data-lpignore', 'true'); // LastPass
  input.setAttribute('data-form-type', 'other'); // Various browsers

  // Mark as processed
  input.dataset.autofillBlocked = 'true';
}

function unblockAutofill(input) {
  if (!input.dataset.autofillBlocked) return;

  input.removeAttribute('data-lpignore');
  input.removeAttribute('data-form-type');
  delete input.dataset.autofillBlocked;
  // Note: We don't restore autocomplete as we don't know the original value
}

function processInputs() {
  // Check if disabled on this site
  if (settings.disabledSites.includes(currentHost)) {
    // Unblock any previously blocked inputs
    document.querySelectorAll('input[data-autofill-blocked]').forEach(unblockAutofill);
    return;
  }

  const selectors = getSelectors();
  if (selectors.length === 0) return;

  const inputs = document.querySelectorAll(selectors.join(', '));
  inputs.forEach(blockAutofill);
}

// Load settings and start
async function init() {
  try {
    settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  } catch (e) {
    // Use defaults if storage fails
    settings = { ...DEFAULT_SETTINGS };
  }

  processInputs();

  // Watch for dynamically added inputs
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        processInputs();
      }
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      processInputs();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'refresh') {
    // Reload settings and reprocess
    chrome.storage.sync.get(DEFAULT_SETTINGS).then((newSettings) => {
      settings = newSettings;
      // Clear all blocked flags to reprocess
      document.querySelectorAll('input[data-autofill-blocked]').forEach(input => {
        delete input.dataset.autofillBlocked;
      });
      processInputs();
    });
  }
});

init();
