document.getElementById('translateBtn').addEventListener('click', () => {
  const selectedLanguage = document.getElementById('selectedLanguage').value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'translateComments', language: selectedLanguage });
  });
})