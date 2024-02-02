var tuncheeky = tuncheeky || {};
tuncheeky.api = tuncheeky.api || {};
tuncheeky.config = tuncheeky.config || {};

//
// Config
//

tuncheeky.config = {
    useExtendedTitle: false,
    showDonateButton: true,
    showWebsiteButton: true,
    showTelegramButton: true,
    showDiscordButton: true,
    showVkButton: true,
    unsupportedClipboard: false
};

//
// Common API
//

tuncheeky.api.textInputCallback = null;

tuncheeky.api.callTextInputCallback = function(action, data) {
    const overlay = document.getElementById("text-input-window-overlay");
    overlay.style.display = "none";

    const callback = tuncheeky.api.textInputCallback;
    tuncheeky.api.textInputCallback = null;
    if (callback != null) {
        callback(action, data);
    }
};

tuncheeky.api.showTextInputWindow = function(initialValue, callback) {
    const overlay = document.getElementById("text-input-window-overlay");
    const textField = document.getElementById("text-input-window-text-field");

    overlay.style.display = "block";
    textField.value = initialValue;

    tuncheeky.api.textInputCallback = callback;
};

//
// Bridge API
//

tuncheeky.api.onGameLoaded = function() {};

//
// Bridge API Initializer
//

(function() {
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("text-input-window-overlay").addEventListener("click", (event) => {
            if (event.target.id == "text-input-window-overlay") {
                tuncheeky.api.callTextInputCallback("cancel", null);
            }
        });
        document.getElementById("text-input-window-button-enter").addEventListener("click", (event) => {
            const textField = document.getElementById("text-input-window-text-field");
            const value = textField.value;
            tuncheeky.api.callTextInputCallback("enter", value);
        });
        document.getElementById("text-input-window-button-cancel").addEventListener("click", (event) => {
            tuncheeky.api.callTextInputCallback("cancel", null);
        });
    });
})();

