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
    vkBridge.send('VKWebAppInit')
        .then((data) => {
            if (data.result) {
                // Приложение инициализировано
            } else {
                // TODO Show an error
                console.log("Unable to initialize VK Bridge");
            }
        })
        .catch((error) => {
            // TODO Show an error
            console.log(error);
        });
};

tuncheeky.api.showFullScreenAd = function() {
    // Do nothing
};