document.getElementById('options-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    browser.storage.local.set({ apiKey: apiKey }, () => {
      console.log('API Key saved');
    });
  });
  