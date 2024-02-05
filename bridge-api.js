// Reference implementation

tuncheeky.api.mobile = false;

tuncheeky.api.initialize = function(callback) {
    this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    callback(tuncheeky.DC_API_READY, null);
};

tuncheeky.api.getDeviceCategory = function() {
    if (this.mobile) {
        return tuncheeky.DC_MOBILE;
    } else {
        return tuncheeky.DC_DESKTOP;
    }
};

tuncheeky.api.isUseNativeTextInputMethod = function() {
    return this.mobile;
};

tuncheeky.api.getLanguage = function() {
    // Use the default language
    return null;
};

tuncheeky.api.isUseOnScreenControls = function() {
    return this.mobile;
}

tuncheeky.api.notifyGameLoaded = function() {
    // Do nothing
};

tuncheeky.api.showFullScreenAd = function() {
    // Do nothing
};