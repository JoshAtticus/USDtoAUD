// This function will use the stored exchange rate
function convertPricesToAUD(text, exchangeRate) {
    const regex = /\$\s?(\d+(\.\d+)?)/g;
    return text.replace(regex, (match, amount) => {
      const convertedAmount = (parseFloat(amount) * exchangeRate).toFixed(2);
      return `A$${convertedAmount}`;
    });
  }
  
  function convertAllPricesOnPage(exchangeRate) {
    const nodes = document.querySelectorAll('body, body *');
    nodes.forEach(node => {
      if (node.hasChildNodes() && node.childNodes[0].nodeType === Node.TEXT_NODE) {
        node.childNodes[0].textContent = convertPricesToAUD(node.childNodes[0].textContent, exchangeRate);
      }
    });
  }
  
  // Retrieve the exchange rate from storage and run the conversion
  browser.storage.local.get('exchangeRate', items => {
    if (items.exchangeRate) {
      convertAllPricesOnPage(items.exchangeRate);
    }
  });
  