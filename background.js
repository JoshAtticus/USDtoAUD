// Update the exchange rate every 6 hours
const UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

function scheduleNextUpdate() {
  setTimeout(() => {
    browser.storage.local.get('apiKey', items => {
      if (items.apiKey) {
        fetchExchangeRate(items.apiKey);
      }
    });
  }, UPDATE_INTERVAL);
}

function fetchExchangeRate(apiKey) {
  const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&currencies=AUD`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const exchangeRate = data.data.AUD;
      // Save the exchange rate in storage
      browser.storage.local.set({ exchangeRate: exchangeRate });
      // Schedule the next update
      scheduleNextUpdate();
    })
    .catch(error => {
      console.error('Error fetching exchange rate:', error);
      // Schedule the next update even if there's an error,
      // but you might want to use a longer delay
      scheduleNextUpdate();
    });
}

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get('apiKey', items => {
    if (items.apiKey) {
      fetchExchangeRate(items.apiKey);
    }
  });
});

// Schedule an update when the browser starts up
browser.runtime.onStartup.addListener(() => {
  scheduleNextUpdate();
});
