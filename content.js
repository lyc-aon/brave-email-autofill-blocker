// Selectors for login/credential fields we want to block autofill on
const LOGIN_SELECTORS = [
  'input[type="email"]',
  'input[type="password"]',
  'input[name*="email" i]',
  'input[name*="user" i]',
  'input[name*="login" i]',
  'input[id*="email" i]',
  'input[id*="user" i]',
  'input[id*="login" i]',
  'input[autocomplete*="email" i]',
  'input[autocomplete*="username" i]',
  'input[autocomplete*="current-password" i]',
  'input[autocomplete*="new-password" i]',
];

const COMBINED_SELECTOR = LOGIN_SELECTORS.join(', ');

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

function processInputs() {
  const inputs = document.querySelectorAll(COMBINED_SELECTOR);
  inputs.forEach(blockAutofill);
}

// Run immediately on any existing elements
processInputs();

// Watch for dynamically added inputs (SPAs, lazy-loaded forms, etc.)
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      processInputs();
    }
  }
});

// Start observing once DOM is ready
if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    processInputs();
    observer.observe(document.body, { childList: true, subtree: true });
  });
}
