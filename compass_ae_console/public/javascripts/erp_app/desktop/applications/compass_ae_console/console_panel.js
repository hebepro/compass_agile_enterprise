//**************************************************
// Compass Desktop Console
//**************************************************
var desktop_console_history = [];
var desktop_console_history_index = 0;
//----------------------------------
// add startsWith method to string
String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};
//---------------------------------
var startup_heading = "<div class='compassConsoleHistory'><span style='color:goldenrod;'><b>Compass Console</b>&nbsp;(<span style='color:white;'>-help</span> for Help)</span></div>";
//---------------------------------
function sendCommand(destination, command, includeOriginalCommand) {
    if (Ext.isEmpty(includeOriginalCommand)) {
        includeOriginalCommand = true;
    }

    if (includeOriginalCommand)
        update_history_panel("<span style='color:white'>" + command + "</span>");

    if (command.startsWith("-clear")) {
        clear_history_panel(startup_heading);
    } else {

        Ext.Ajax.request({
            url: '/compass_ae_console/erp_app/desktop/command',
            params: {

                command_message: command
            },
            success: function (response) {
                var text = response.responseText;
                var result = Ext.JSON.decode(text);
                update_history_panel("<div style='color:yellow;'>" + result.success + "</div>");
            }
        });
    }
}
//---------------------------------
function clear_history_panel(text) {
    var panel = Ext.getCmp('console_history_panel'),
        historyDiv = panel.el.query('div.compassConsoleHistory').first();

    historyDiv.innerHTML = text;

    var d = panel.body.dom;
    d.scrollTop = d.scrollHeight - d.offsetHeight + 10;
    panel.doLayout();

    sendCommand('console_text_area', '"Ruby version: #{RUBY_VERSION}, Rails version: #{Rails.version}, CompassAeConsole version: #{CompassAeConsole.version}"', false);
}
//---------------------------------
function update_history_panel(text) {
    var panel = Ext.getCmp('console_history_panel'),
        historyDiv = panel.el.query('div.compassConsoleHistory').first();

    historyDiv.innerHTML = historyDiv.innerHTML + text + "<br>";

    var d = panel.body.dom;
    d.scrollTop = d.scrollHeight - d.offsetHeight + 10;
    panel.doLayout();
}

//---------------------------------
var console_history_panel = {
    xtype: 'panel',
    id: 'console_history_panel',
    region: 'center',
    bodyStyle: "background-color:#000;padding:5px;",
    autoScroll: true,
    html: startup_heading
};

//---------------------------------

var console_text_area = {
    xtype: 'textarea',
    region: 'south',
    autoscroll: true,
    id: "console_text_area",
    enableKeyEvents: true,
    listeners: {
        afterrender: function (field) {
            field.focus();
        },
        // use key-up for textarea since ENTER does not affect focus traversal
        keyup: function (field, e) {
            //console.log("textarea keyup:"+e);
            if (e.getKey() == e.ENTER) {

                sendCommand('console_text_area', field.getValue());
                // add to history
                desktop_console_history[desktop_console_history.length] = field.getValue().substring(0, field.getValue().length - 1);
                //update index
                desktop_console_history_index = desktop_console_history.length;
                field.setValue("");
            } else if (e.getKey() == e.UP) {

                if (desktop_console_history.length === 0) {
                    // no history to display
                } else {
                    desktop_console_history_index--;
                    if (desktop_console_history_index >= 0) {

                    }
                    else {
                        desktop_console_history_index = desktop_console_history.length - 1;
                    }
                    field.setValue(desktop_console_history[desktop_console_history_index]);
                }

            } else if (e.getKey() == e.DOWN) {

                if (desktop_console_history.length === 0) {
                    // no history to display
                } else {
                    desktop_console_history_index++;
                    if (desktop_console_history_index >= (desktop_console_history.length)) {
                        desktop_console_history_index = 0;
                    }
                    else {
                        //desktop_console_history_index=desktop_console_history.length-1
                    }
                    field.setValue(desktop_console_history[desktop_console_history_index]);
                }
            }
        }

    }
};


Ext.define("Compass.ErpApp.Desktop.Applications.CompassAeConsole.ConsolePanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.compass_ae_console_console_panel',
    title: 'CompassAE Console',
    closable: true,
    layout: 'border',
    items: [ console_history_panel, console_text_area]

});