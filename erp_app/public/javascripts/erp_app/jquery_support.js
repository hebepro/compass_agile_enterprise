if (jQuery) {
    Compass.ErpApp.Utility.createNamespace("Compass.ErpApp.JQuerySupport");

    jQuery(document).ready(function () {
        Compass.ErpApp.JQuerySupport.setupHtmlReplace();
    });

    Compass.ErpApp.JQuerySupport.setupHtmlReplace = function () {
        jQuery(document).bind('ajaxSuccess', Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse);
    };

    Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse = function (e, xhr, options, data) {
        var utility = Compass.ErpApp.Utility;

        //reset SessionTimeout
        if (utility.SessionTimeout.enabled) {
            utility.SessionTimeout.reset();
        }
        if (!utility.isBlank(data) && !utility.isBlank(data.htmlId)) {
            var updateDiv = $('#' + data.htmlId);
            try {
                updateDiv.closest('div.compass_ae-widget').unmask();
            }
            catch (ex) {
                //messy catch for no update div
            }
            updateDiv.get(0).innerHTML = data.html;
            utility.evaluateScriptTags(updateDiv.get(0));
        }
    };
}