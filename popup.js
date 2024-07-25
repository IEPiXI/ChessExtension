chrome.storage.local.get(['polling', 'drawMode'], function(result) {
    document.getElementById('runScriptButton').innerText = result.polling ? "Switch Off" : "Switch On";
    document.getElementById('toggleDrawModeButton').innerText = result.drawMode === "circle" ? "Draw Arrows" : "Draw Circles";
});

document.getElementById('runScriptButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({message: "is_polling"}, function(response) {
        const isPolling = response.isPolling;
        if (isPolling) {
            console.log("stop polling...")
            document.getElementById('runScriptButton').innerText = "Switch On"; // Change text to "Switch On"
            chrome.runtime.sendMessage({message: "stop_polling"}, function(response) {
                if(response) console.log(response.message); // Add conditional here
                chrome.runtime.sendMessage({ message: "clear_arrows" });
            });
        } else {
            console.log("start polling...")
            document.getElementById('runScriptButton').innerText = "Switch Off"; // Change text to "Switch Off"
            chrome.runtime.sendMessage({message: "start_polling"}, function(response) {
                if(response) console.log(response.message); // Add conditional here
            });
        }
    });
});

document.getElementById('toggleDrawModeButton').addEventListener('click', function() {
    // Toggle between 'circle' and 'arrow' draw modes
    chrome.storage.local.get(['drawMode'], function(result) {
        const newMode = result.drawMode === "circle" ? "arrow" : "circle";
        chrome.storage.local.set({drawMode: newMode}, function() {
            console.log('Draw mode updated:', newMode);
        });
        chrome.storage.local.set({forceRedraw: true});
        document.getElementById('toggleDrawModeButton').innerText = newMode === "circle" ? "Draw Arrows" : "Draw Circles";        
    });
});