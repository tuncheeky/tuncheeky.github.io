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

tuncheeky.TIW_ENTER = "ENTER";
tuncheeky.TIW_CANCEL = "CANCEL";

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

class TextInputWindowContext {
    constructor(initialValue, maxLength, multiline, callback) {
        this.initialValue = initialValue;
        this.maxLength = maxLength;
        this.multiline = multiline;
        this.callback = callback;
        this.updated = false;
    }

    static createDefault() {
        return new TextInputWindowContext("", 256, false, null);
    }
}

tuncheeky.api = {
    mobileUserAgent: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    tiwc: TextInputWindowContext.createDefault(),

    // Common API

    initializeCommonApi() {
        const tapi = this;

        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById("text-input-window-overlay").addEventListener("click", (event) => {
                if (event.target.id == "text-input-window-overlay") {
                    if (!tapi.tiwc.updated) {
                        tapi.callTextInputCallback(tuncheeky.TIW_CANCEL, null);
                    }
                }
            });
            document.getElementById("text-input-window-text-field").addEventListener("input", (event) => {
                tapi.tiwc.updated = true;
            });
            document.getElementById("text-input-window-text-field").addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    const value = tapi.getTextInputValue();
                    tapi.callTextInputCallback(tuncheeky.TIW_ENTER, value);
                }
            });
            document.getElementById("text-input-window-text-area").addEventListener("input", (event) => {
                tapi.tiwc.updated = true;
            });
            document.getElementById("text-input-window-button-enter").addEventListener("click", (event) => {
                const value = tapi.getTextInputValue();
                tapi.callTextInputCallback(tuncheeky.TIW_ENTER, value);
            });
            document.getElementById("text-input-window-button-cancel").addEventListener("click", (event) => {
                tapi.callTextInputCallback(tuncheeky.TIW_CANCEL, null);
            });
            // tapi.showTextInputWindow("Initial text", 12, false, (a, v) => alert(`${a}, ${v}`));
        });
    },

    getTextInputValue() {
        if (this.tiwc.multiline) {
            const textArea = document.getElementById("text-input-window-text-area");
            return textArea.value;
        } else {
            const textField = document.getElementById("text-input-window-text-field");
            return textField.value;
        }
    },

    callTextInputCallback(action, data) {
        const overlay = document.getElementById("text-input-window-overlay");
        overlay.style.display = "none";

        const callback = this.tiwc.callback;
        this.tiwc = TextInputWindowContext.createDefault();

        if (callback != null) {
            callback(action, data);
        }
    },

    setUpTextInput(element, initialValue, maxLength, visible) {
        const actualMaxLength = maxLength <= 0 ? 256 : maxLength;

        element.value = initialValue;
        element.maxLength = actualMaxLength;
        if (visible) {
            element.style.display = "block";
            element.focus();
            // Re-focus, the animation has to be finished in 250ms
            setTimeout(function () {
                  element.focus();
            }, 275);
        } else {
            element.style.display = "none";
        }
    },

    showTextInputWindow(initialValue, maxLength, multiline, callback) {
        this.tiwc = new TextInputWindowContext(initialValue, maxLength, multiline, callback);

        const overlay = document.getElementById("text-input-window-overlay");
        const tiWindow = document.getElementById("text-input-window");
        const textField = document.getElementById("text-input-window-text-field");
        const textArea = document.getElementById("text-input-window-text-area");

        this.setUpTextInput(textField, initialValue, maxLength, !multiline);
        this.setUpTextInput(textArea, initialValue, maxLength, multiline);

        overlay.style.display = "block";
        overlay.classList.remove("show-text-input-window-overlay-animation");
        overlay.classList.add("show-text-input-window-overlay-animation");

        tiWindow.classList.remove("show-text-input-window-animation");
        tiWindow.classList.add("show-text-input-window-animation");
    },

    // Actual API

    initialize(callback) {
        callback(tuncheeky.DC_API_READY, null);
    },

    getDeviceCategory() {
        if (this.mobileUserAgent) {
            return tuncheeky.DC_MOBILE;
        } else {
            return tuncheeky.DC_DESKTOP;
        }
    },

    getDistributionChannelName() {
        return "WEB";
    },

    isAllowExplicitAuthentication() {
        return true;
    },

    isUseNativeTextInputMethod() {
        return this.mobileUserAgent;
    },

    isUseOnScreenControls() {
        return this.mobileUserAgent;
    },

    getLanguage() {
        // Use the default language
        return null;
    },

    notifyGameLoaded() {
        // Do nothing
    },

    showFullScreenAd(callback) {
        callback?.(false, null);
    },

    showBannerAd(callback) {
        callback?.(false, null);
    },

    isStorageSupported() {
        return false;
    },

    storeValue(key, value, callback) {
        callback?.(null, new tuncheeky.HtmlBridgeError("Unsupported operation: storeValue"));
    },

    loadValue(key, callback) {
        callback?.(null, new tuncheeky.HtmlBridgeError("Unsupported operation: loadValue"));
    }
}

//
// Bridge API Initializer
//

tuncheeky.api.initializeCommonApi();