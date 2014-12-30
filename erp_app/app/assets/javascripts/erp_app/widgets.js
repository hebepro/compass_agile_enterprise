// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require_self

Compass.ErpApp.Utility.createNamespace("Compass.ErpApp.Widgets");

Compass.ErpApp.Widgets = {
    setup: function (uuid, name, action, params, addToLoaded) {
        var widgetParams = {
            widget_params: $.param(params),
            authenticity_token: Compass.ErpApp.AuthentictyToken
        };

        jQuery.ajax({
            url: '/erp_app/widgets/' + name + '/' + action + '/' + uuid,
            type: 'GET',
            data: widgetParams,
            success:function(data, textStatus, xhr){
                var widgetDiv = jQuery('#' + uuid);

                widgetDiv.innerHTML = data.html;
                Compass.ErpApp.Utility.evaluateScriptTags(widgetDiv[0]);
                Compass.ErpApp.JQuerySupport.setupHtmlReplace();
                if (addToLoaded)
                    Compass.ErpApp.Widgets.LoadedWidgets.push({
                        id: uuid,
                        name: name,
                        action: action,
                        params: params
                    });
            },
            error: function(){
                //ALERT?
            }
        });
    },

    refreshWidgets: function () {
        jQuery.each(Compass.ErpApp.Widgets.LoadedWidgets, function(index, widget){
            Compass.ErpApp.Widgets.setup(widget.id, widget.name, widget.action, widget.params, false);
        });
    },

    refreshWidget: function (name, action) {
        jQuery.each(Compass.ErpApp.Widgets.LoadedWidgets, function(index, widget){
            if (widget.name == name && widget.action == action) {
                Compass.ErpApp.Widgets.setup(widget.id, widget.name, widget.action, widget.params, false);
            }
        });
    },

    setupAjaxNavigation: function (css_class, home_url) {
        jQuery.address.value('nav?url=' + home_url);

        var bindCss = 'a.' + css_class;
        var anchor = null;
        jQuery(bindCss).bind('click', function () {
            anchor = $(this);
            var href = anchor.attr('href');
            jQuery.address.value('nav?url=' + href + '&key=' + Compass.ErpApp.Utility.randomString(10));
            anchor.closest('div.compass_ae-widget').mask("Loading....");

            return false;
        });

        jQuery.address.change(function (event) {
            try {
                if (!Ext.isEmpty(event.parameters.url)) {
                    jQuery.ajax({
                        url: event.parameters.url,
                        success: Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse
                    });
                }
            }
            catch (exception) {
                if (console) {
                    console.log(exception);
                }
            }
        });
    },

    LoadedWidgets: [],

    AvailableWidgets: []
};

