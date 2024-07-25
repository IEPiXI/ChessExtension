let pollingIntervalId = null;


chrome.storage.local.set({polling: false});

function startPolling() {
    if (pollingIntervalId === null) {
        pollingIntervalId = setInterval(function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                let tab = tabs[0]; // Get the active tab
                if (tab) {
                    let url = tab.url;
                    // Check if the URL is appropriate
                    if (url.startsWith('http://') || url.startsWith('https://')) {
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['myscript.js']
                        });
                    }
                }
                
            });
        }, 200);
        chrome.storage.local.set({polling: true});
        chrome.storage.local.set({forceRedraw: true});
    }
}
function stopPolling() {
    if (pollingIntervalId !== null) {
        clearInterval(pollingIntervalId);
        pollingIntervalId = null;
        clearDrawnElements();
        chrome.storage.local.set({polling: false});
    }
}


function clearDrawnElements() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0]; // Get the active tab
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: clearArrows
        });
    });
}

function clearArrows() {
    const svg = document.querySelector('svg.arrows');

    console.log(svg);
    if (svg) {
        const existingElements = svg.querySelectorAll('line, circle');
        console.log(existingElements);
        if (existingElements) {
            existingElements.forEach(element => element.remove());
        }
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.message === "start_polling") {
        startPolling();
        sendResponse({message: "Started polling"});
    } else if (request.message === "stop_polling") {
        stopPolling();
        sendResponse({message: "Stopped polling"});
    } else if (request.message === "is_polling") {
        sendResponse({isPolling: pollingIntervalId !== null});
    }  else if (request.message === "clear_arrows") {
        clearDrawnElements();
        sendResponse({ message: "Cleared arrows" });
    }
});