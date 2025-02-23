const CONFIG = {
    CHECK_INTERVAL: 10000, // 10 seconds
    INITIAL_DELAY: 10000,  // 10 seconds
    XPATHS: {
        CONNECTION_STATUS: '/html/body/div[3]/div[2]/main/main/div[2]/div/div/div[1]/div[2]/div/div/p',
        CONNECT_BUTTON: '/html/body/div[3]/div[2]/main/main/div[2]/div/div/div[1]/div[1]/div/div/div/div/div[2]'
    },
    CONNECT_TEXT: 'CONNECT TO NEXUS'
};

/**
 * Retrieves an element using XPath
 * @param {string} xpath - The XPath to locate the element
 * @returns {Element|null} - The found element or null if not found
 */
function getElementByXPath(xpath) {
    try {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        return result.singleNodeValue;
    } catch (error) {
        console.error('XPath evaluation error:', error);
        return null;
    }
}

/**
 * Attempts to reconnect to Nexus if disconnected
 * @returns {void}
 */
function attemptReconnect() {
    try {
        // Check connection status
        const statusElement = getElementByXPath(CONFIG.XPATHS.CONNECTION_STATUS);
        if (!statusElement) {
            console.warn('Status element not found');
            return;
        }

        const statusText = statusElement.textContent;
        console.log('Current status:', statusText);

        // If disconnected, attempt to reconnect
        if (statusText === CONFIG.CONNECT_TEXT) {
            const connectButton = getElementByXPath(CONFIG.XPATHS.CONNECT_BUTTON);
            if (!connectButton) {
                console.error('Connect button not found');
                return;
            }

            console.log('Attempting to reconnect...');
            connectButton.click();
        }
    } catch (error) {
        console.error('Reconnection attempt failed:', error);
    }
}

/**
 * Initialize the auto-reconnect functionality
 */
function initializeAutoReconnect() {
    // Initial check after delay
    setTimeout(attemptReconnect, CONFIG.INITIAL_DELAY);

    // Regular interval checks
    setInterval(attemptReconnect, CONFIG.CHECK_INTERVAL);

    console.log('Auto-reconnect initialized');
}

// Start 
initializeAutoReconnect();