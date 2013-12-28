if (jQuery) {
    Compass.ErpApp.Utility.createNamespace("Compass.ErpApp.JQuerySupport");

    jQuery(document).ready(function () {
        Compass.ErpApp.JQuerySupport.setupHtmlReplace();
    });

    Compass.ErpApp.JQuerySupport.setupHtmlReplace = function () {
        jQuery('body').unbind('ajaxSuccess').bind('ajaxSuccess', Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse);
    };

    Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse = function (e, xhr, settings) {
        var utility = Compass.ErpApp.Utility;

        //reset SessionTimeout
        if(utility.SessionTimeout.enabled){
            utility.SessionTimeout.reset();
        }

        if(Compass.ErpApp.JQuerySupport.IsJsonString(xhr.responseText)){
            var responseData = jQuery.parseJSON(xhr.responseText);
            if (!utility.isBlank(responseData) && !utility.isBlank(responseData.htmlId)) {
                var updateDiv = $('#' + responseData.htmlId);
                try {
                    updateDiv.closest('div.compass_ae-widget').unmask();
                }
                catch (ex) {
                    //messy catch for no update div
                }
                updateDiv.get(0).innerHTML = responseData.html;
                utility.evaluateScriptTags(updateDiv.get(0));
            }
        }
    };

    Compass.ErpApp.JQuerySupport.IsJsonString = function (str) {
        try {
            jQuery.parseJSON(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}