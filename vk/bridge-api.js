// https://dev.vk.com/ru/bridge/overview
tuncheeky.config.useExtendedTitle = true;
tuncheeky.config.showDonateButton = false;
tuncheeky.config.showWebsiteButton = false;
tuncheeky.config.showTelegramButton = false;
tuncheeky.config.showDiscordButton = false;
tuncheeky.config.showVkButton = true;
tuncheeky.config.unsupportedClipboard = true;

tuncheeky.api.initialize = function(callback) {
    vkBridge.send('VKWebAppInit')
        .then((data) => {
            if (data.result) {
                callback(tuncheeky.DC_API_READY, null);
            } else {
                callback(tuncheeky.DC_API_FAILED, "Unknown failure during initialization of the VK bridge");
            }
        })
        .catch((error) => {
            callback(tuncheeky.DC_API_FAILED, error.toString());
        });
};

tuncheeky.api.getDistributionChannelName = function() {
    return "VK";
};

tuncheeky.api.isAllowExplicitAuthentication = function() {
    return false;
};

tuncheeky.api.showFullScreenAd = function(callback) {
    vkBridge.send('VKWebAppShowNativeAds', {
            ad_format: 'interstitial'
        })
        .then((data) => {
            callback?.(data.result, null);
        })
        .catch((error) => {
            callback?.(null, tuncheeky.api.toHtmlBridgeError(error))
        });
};

tuncheeky.api.showBannerAd = function(callback) {
    vkBridge.send('VKWebAppShowBannerAd', {
            banner_location: 'bottom'
        })
        .then((data) => {
            callback?.(data.result, null);
        })
        .catch((error) => {
            callback?.(null, tuncheeky.api.toHtmlBridgeError(error))
        });
};

tuncheeky.api.isStorageSupported = function() {
    return true;
};

tuncheeky.api.storeValue = function(key, value, callback) {
    vkBridge.send('VKWebAppStorageSet', {
            key: key,
            value: value
        })
        .then((data) => {
            callback?.(data.result, null);
        })
        .catch((error) => {
            callback?.(null, tuncheeky.api.toHtmlBridgeError(error))
        });
};

tuncheeky.api.loadValue = function(key, callback) {
    vkBridge.send('VKWebAppStorageGet', {
            keys: [key]
        })
        .then((data) => {
            if (data.keys.length === 1 && data.keys[0].value != null && data.keys[0].value !== "") {
                callback?.(new tuncheeky.HtmlBridgePair(
                    data.keys[0].key,
                    data.keys[0].value
                ), null)
            } else {
                callback?.(null, null);
            }
        })
        .catch((error) => {
            callback?.(null, tuncheeky.api.toHtmlBridgeError(error))
        });
};

/*
Example:
{
   "error_type": "client_error",
   "error_data": {
       "error_code": 20,
       "error_reason": "No ads"
   }
}
*/
tuncheeky.api.toHtmlBridgeError = function(error) {
    return new tuncheeky.HtmlBridgeError(`${error.error_type}/${error.error_data.error_code}/${error.error_data.error_reason}`)
}