var tuncheeky = tuncheeky || {};
tuncheeky.api = tuncheeky.api || {};
tuncheeky.config = tuncheeky.config || {};

//
// Constants
//

tuncheeky.DC_API_UNSUPPORTED = "UNSUPPORTED";
tuncheeky.DC_API_READY = "READY";
tuncheeky.DC_API_FAILED = "FAILED";

tuncheeky.DT_DESKTOP = "desktop";
tuncheeky.DT_MOBILE = "mobile";

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
tuncheeky.api.textInputUpdated = false;

tuncheeky.api.callTextInputCallback = function(action, data) {
    const overlay = document.getElementById("text-input-window-overlay");
    overlay.style.display = "none";

    tuncheeky.api.textInputUpdated = false;

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
    textField.focus();

    tuncheeky.api.textInputUpdated = false;
    tuncheeky.api.textInputCallback = callback;
};

//
// Bridge API
//

// Actual API

tuncheeky.api.initialize = function(callback) {
    callback(tuncheeky.DC_API_UNSUPPORTED);
};

// Distribution Channel API

tuncheeky.api.getDeviceCategory = function() {
    throw new Error("Unsupported operation: getDeviceCategory()");
};

tuncheeky.api.isUseNativeTextInputMethod = function() {
    throw new Error("Unsupported operation: isUseNativeTextInputMethod()");
};

tuncheeky.api.showFullScreenAd = function() {
    throw new Error("Unsupported operation: showFullScreenAd()");
};

//
// Bridge API Initializer
//

(function() {
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("text-input-window-overlay").addEventListener("click", (event) => {
            if (event.target.id == "text-input-window-overlay") {
                if (!tuncheeky.api.textInputUpdated) {
                    tuncheeky.api.callTextInputCallback("cancel", null);
                }
            }
        });
        document.getElementById("text-input-window-text-field").addEventListener("input", (event) => {
            tuncheeky.api.textInputUpdated = true;
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

