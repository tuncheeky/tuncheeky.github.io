var tuncheeky = tuncheeky || {};
tuncheeky.api = tuncheeky.api || {};
tuncheeky.config = tuncheeky.config || {};

//
// Constants
//

tuncheeky.DC_API_UNSUPPORTED = "UNSUPPORTED";
tuncheeky.DC_API_READY = "READY";
tuncheeky.DC_API_FAILED = "FAILED";

tuncheeky.DC_DESKTOP = "DESKTOP";
tuncheeky.DC_MOBILE = "MOBILE";

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
// Bridge API
//

tuncheeky.api = {
    textInputCallback: null,
    textInputUpdated: false,

    // Common API

    initializeCommonApi() {
        const tapi = this;

        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById("text-input-window-overlay").addEventListener("click", (event) => {
                if (event.target.id == "text-input-window-overlay") {
                    if (!tapi.textInputUpdated) {
                        tapi.callTextInputCallback("cancel", null);
                    }
                }
            });
            document.getElementById("text-input-window-text-field").addEventListener("input", (event) => {
                tapi.textInputUpdated = true;
            });
            document.getElementById("text-input-window-button-enter").addEventListener("click", (event) => {
                const textField = document.getElementById("text-input-window-text-field");
                const value = textField.value;
                tapi.callTextInputCallback("enter", value);
            });
            document.getElementById("text-input-window-button-cancel").addEventListener("click", (event) => {
                tapi.callTextInputCallback("cancel", null);
            });
            // tapi.showTextInputWindow("Initial text", (a, v) => alert(`${a}, ${v}`));
        });
    },

    callTextInputCallback(action, data) {
        const overlay = document.getElementById("text-input-window-overlay");
        overlay.style.display = "none";

        this.textInputUpdated = false;

        const callback = this.textInputCallback;
        this.textInputCallback = null;
        if (callback != null) {
            callback(action, data);
        }
    },

    showTextInputWindow(initialValue, callback) {
        const overlay = document.getElementById("text-input-window-overlay");
        const tiWindow = document.getElementById("text-input-window");
        const textField = document.getElementById("text-input-window-text-field");

        overlay.style.display = "block";
        overlay.classList.remove("show-text-input-window-overlay-animation");
        overlay.classList.add("show-text-input-window-overlay-animation");

        textField.value = initialValue;
        textField.focus();

        tiWindow.classList.remove("show-text-input-window-animation");
        tiWindow.classList.add("show-text-input-window-animation");

        this.textInputUpdated = false;
        this.textInputCallback = callback;
    },

    // Actual API

    initialize(callback) {
        callback(tuncheeky.DC_API_UNSUPPORTED);
    },

    getDeviceCategory() {
        return throwUnsupportedOperation("getDeviceCategory");
    },

    isUseNativeTextInputMethod() {
        return throwUnsupportedOperation("isUseNativeTextInputMethod");
    },

    notifyGameLoaded() {
        throwUnsupportedOperation("notifyGameLoaded");
    },

    showFullScreenAd() {
        throwUnsupportedOperation("showFullScreenAd");
    },

    throwUnsupportedOperation(operation) {
        throw new Error(`Unsupported operation: ${operation}`);
    }

}

//
// Bridge API Initializer
//

tuncheeky.api.initializeCommonApi();