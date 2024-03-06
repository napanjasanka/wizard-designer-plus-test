// Function to select the option with value "23"
function selectOptionByValue(selectElement, value) {
    const option = Array.from(selectElement.options).find(option => option.value === value);
    if (option) {
      selectElement.value = value;
    }
  }
  
  // Function to observe when the select element is fully loaded
  function observeSelectElement(selectElement) {
    // Create a new MutationObserver instance
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Assuming that when options are added, the select is fully loaded
          selectOptionByValue(selectElement, "23");
          observer.disconnect(); // Stop observing after the value is set
        }
      }
    });
  
    // Start observing the select element for configuration changes
    observer.observe(selectElement, { childList: true });
  }
  
  // Wait for the DOM to fully load
  document.addEventListener('DOMContentLoaded', (event) => {
    // Get the select element
    const selectElement = document.querySelector('select');
  
    // Start observing the select element
    if (selectElement) {
      observeSelectElement(selectElement);
    }
  });