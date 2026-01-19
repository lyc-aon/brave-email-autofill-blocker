// Default settings
const DEFAULT_SETTINGS = {
  blockEmail: true,
  blockUsername: true,
  blockPassword: true,
  blockPhone: false,
  disabledSites: []
};

let currentHost = '';

// Load settings and initialize UI
async function init() {
  // Get current tab's hostname
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      currentHost = new URL(tab.url).hostname;
    } catch (e) {
      currentHost = '';
    }
  }

  // Load settings from storage
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);

  // Set toggle states
  document.getElementById('blockEmail').checked = settings.blockEmail;
  document.getElementById('blockUsername').checked = settings.blockUsername;
  document.getElementById('blockPassword').checked = settings.blockPassword;
  document.getElementById('blockPhone').checked = settings.blockPhone;

  // Check if current site is disabled
  const isDisabled = settings.disabledSites.includes(currentHost);
  document.getElementById('enabledOnSite').checked = !isDisabled;

  updateStatus(!isDisabled);

  // Add event listeners
  document.getElementById('blockEmail').addEventListener('change', saveSettings);
  document.getElementById('blockUsername').addEventListener('change', saveSettings);
  document.getElementById('blockPassword').addEventListener('change', saveSettings);
  document.getElementById('blockPhone').addEventListener('change', saveSettings);
  document.getElementById('enabledOnSite').addEventListener('change', toggleSite);
}

async function saveSettings() {
  const settings = {
    blockEmail: document.getElementById('blockEmail').checked,
    blockUsername: document.getElementById('blockUsername').checked,
    blockPassword: document.getElementById('blockPassword').checked,
    blockPhone: document.getElementById('blockPhone').checked
  };

  await chrome.storage.sync.set(settings);

  // Notify content script to refresh
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'refresh' }).catch(() => {});
  }
}

async function toggleSite() {
  const enabled = document.getElementById('enabledOnSite').checked;
  const settings = await chrome.storage.sync.get({ disabledSites: [] });

  let disabledSites = settings.disabledSites;

  if (enabled) {
    // Remove from disabled list
    disabledSites = disabledSites.filter(site => site !== currentHost);
  } else {
    // Add to disabled list
    if (!disabledSites.includes(currentHost)) {
      disabledSites.push(currentHost);
    }
  }

  await chrome.storage.sync.set({ disabledSites });
  updateStatus(enabled);

  // Notify content script to refresh
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'refresh' }).catch(() => {});
  }
}

function updateStatus(enabled) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');

  if (enabled) {
    dot.classList.remove('disabled');
    text.textContent = 'Blocking on this page';
  } else {
    dot.classList.add('disabled');
    text.textContent = 'Disabled on this site';
  }
}

document.addEventListener('DOMContentLoaded', init);
