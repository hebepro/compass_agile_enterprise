Ext.define("Compass.ErpApp.Desktop.Applications.CompassAeConsole", {
    extend: "Ext.ux.desktop.Module",
    id: 'compass_console-win',
    init: function () {
        this.launcher = {
            text: 'Compass Console',
            iconCls: 'icon-console',
            handler: this.createWindow,
            scope: this
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('console');
        if (!win) {
            win = desktop.createWindow({
                id: 'console',
                title: 'Compass Console',
                width: 800,
                height: 600,
                iconCls: 'icon-console',
                shim: false,
                animCollapse: false,
                resizable: true,
                constrainHeader: true,
                layout: 'fit',
                items: [
                    {
                      xtype: 'compass_ae_console_console_panel',
                      header: false
                    }
                ]
            });
        }
        win.show();
        sendCommand('console_text_area', '"Ruby version: #{RUBY_VERSION}, Rails version: #{Rails.version}, CompassAeConsole version: #{CompassAeConsole.version}"', false);
    }
});
