var store = Ext.create('Ext.data.TreeStore', {
    proxy: {
        type: 'ajax',
        url: '/knitkit/erp_app/desktop/website_host',
        timeout: 90000
    },
    root: {
        text: 'Host Mappings',
        iconCls: 'icon-gear',
        expanded: true
    },
    fields: [
        'text',
        'url',
        'iconCls',
        'websiteHostId',
        'host',
        'leaf'
    ],
    listeners: {
        'load': function (store, node, records) {
            store.getRootNode().expandChildren();
        }
    }
});

Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.HostListPanel", {
    extend: "Ext.tree.Panel",
    id: 'knitkitHostListPanel',
    itemId: 'knitkitHostListPanel',
    alias: 'widget.knitkit_hostspanel',
    header: false,

    viewConfig: {
        markDirty: false
    },

    store: store,

    selectWebsite: function (website) {
        var store = this.getStore();
        store.getProxy().extraParams = {
            website_id: website.id
        };
        store.load();
    },

    listeners: {
        'itemcontextmenu': function (view, record, htmlItem, index, e) {
            e.stopEvent();

            if (record.isRoot()) {
                items = [Compass.ErpApp.Desktop.Applications.Knitkit.newHostMenuItem];
            }
            else{
                items = Compass.ErpApp.Desktop.Applications.Knitkit.addHostOptions(self, items, record);
            }

            if (items.length != 0) {
                var contextMenu = Ext.create("Ext.menu.Menu", {
                    items: items
                });
                contextMenu.showAt(e.xy);
            }
        }
    }

});