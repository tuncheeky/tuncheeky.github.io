// https://dev.vk.com/ru/bridge/overview
tuncheeky.config.useExtendedTitle = true;
tuncheeky.config.showDonateButton = false;
tuncheeky.config.showWebsiteButton = false;
tuncheeky.config.showTelegramButton = false;
tuncheeky.config.showDiscordButton = false;
tuncheeky.config.showVkButton = true;
tuncheeky.config.unsupportedClipboard = true;

tuncheeky.api.vkInitialized = false;
tuncheeky.api.distributionChannelName = null;

tuncheeky.api.initialize = function(callback) {
    if (!tuncheeky.api.vkInitialized) {
        vkBridge.send('VKWebAppInit')
            .then((data) => {
                if (data.result) {
                    tuncheeky.api.vkInitialized = true;
                    tuncheeky.api.setUpEnvironment(callback);
                } else {
                    callback(tuncheeky.DC_API_FAILED, new tuncheeky.HtmlBridgeError('Unable to initialize the VK bridge'));
                }
            })
            .catch((error) => {
                callback(tuncheeky.DC_API_FAILED, tuncheeky.api.toHtmlBridgeError(error));
            });
    } else {
        tuncheeky.api.setUpEnvironment(callback);
    }
};

tuncheeky.api.setUpEnvironment = function(callback) {
    const params = new URLSearchParams(window.location.search);
    const vkPlatform = params.get("vk_platform");

    const okPlatforms = new Set([
        "desktop_web_ok",
        "mobile_android_ok",
        "mobile_iphone_ok",
        "mobile_web_ok"
    ]);

    tuncheeky.api.distributionChannelName = okPlatforms.has(vkPlatform) ? "OK" : "VK";

    callback(tuncheeky.DC_API_READY, null);
}

tuncheeky.api.getDistributionChannelName = function() {
    return tuncheeky.api.distributionChannelName;
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

tuncheeky.api.showBannerAd = function(location, callback) {
    let bl = "bottom";
    if (location === "TOP") {
        bl = "top";
    }
    vkBridge.send('VKWebAppShowBannerAd', {
            banner_location: bl
        })
        .then((data) => {
            callback?.(data.result, null);
        })
        .catch((error) => {
            callback?.(null, tuncheeky.api.toHtmlBridgeError(error))
        });
};

tuncheeky.api.hideBannerAd = function(callback) {
    vkBridge.send('VKWebAppHideBannerAd')
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