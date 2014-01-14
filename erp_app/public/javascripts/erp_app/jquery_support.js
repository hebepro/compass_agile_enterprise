if (jQuery) {
    Compass.ErpApp.Utility.createNamespace("Compass.ErpApp.JQuerySupport");

    jQuery(document).ready(function () {
        Compass.ErpApp.JQuerySupport.setupHtmlReplace();
    });

    Compass.ErpApp.JQuerySupport.setupHtmlReplace = function () {
        jQuery('body').unbind('ajax:success').bind('ajax:success', Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse);
    };

    Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse = function (e, response) {
        var utility = Compass.ErpApp.Utility;

        //reset SessionTimeout
        if (utility.SessionTimeout.enabled) {
            utility.SessionTimeout.reset();
        }
        if (!utility.isBlank(response) && !utility.isBlank(response.htmlId)) {
            var updateDiv = $('#' + response.htmlId);
            try {
                updateDiv.closest('div.compass_ae-widget').unmask();
            }
            catch (ex) {
                //messy catch for no update div
            }
            updateDiv.get(0).innerHTML = response.html;
            utility.evaluateScriptTags(updateDiv.get(0));
        }
    };
}