Ext.define("Compass.ErpApp.Desktop.Applications.AuditLogViewer", {
    extend: "Ext.ux.desktop.Module",
    id: 'audit_log_viewer-win',
    init: function () {
        this.launcher = {
            text: 'Audit Log Viewer',
            iconCls: 'icon-history',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('audit_log_viewer');
        if (!win) {

            var container = Ext.create('widget.auditlogtabpanel', {
                showToolbar: true
            });

            win = desktop.createWindow({
                id: 'audit_log_viewer',
                title: 'Audit Log Viewer',
                layout: 'fit',
                autoScroll: true,
                width: 1000,
                height: 540,
                iconCls: 'icon-history-light',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                items: [container]
            });
        }
        win.show();
    }
});
