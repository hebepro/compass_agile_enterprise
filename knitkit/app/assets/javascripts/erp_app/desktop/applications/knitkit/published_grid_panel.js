Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.PublishedGridPanel", {
    extend: "Ext.grid.Panel",
    alias: 'widget.knitkit_publishedgridpanel',
    initComponent: function () {
        this.callParent(arguments);
        this.getStore().load();
    },

    activate: function (rec) {
        var self = this;
        Ext.Ajax.request({
            url: '/knitkit/erp_app/desktop/site/activate_publication',
            timeout: 90000,
            method: 'POST',
            params: {
                website_id: self.initialConfig.siteId,
                version: rec.get('version')
            },
            success: function (response) {
                var obj = Ext.decode(response.responseText);
                var msg = "";
                if (obj.msg) {
                    msg = obj.msg;
                } else {
                    msg = 'Error activating publication';
                }
                if (obj.success) {
                    self.getStore().load();
                }
                else {
                    Ext.Msg.alert('Error', msg);
                }
            },
            failure: function (response) {
                Ext.Msg.alert('Error', 'Error activating publication');
            }
        });
    },

    setViewingVersion: function (rec) {
        var self = this;
        Ext.Ajax.request({
            url: '/knitkit/erp_app/desktop/site/set_viewing_version',
            method: 'POST',
            params: {
                website_id: self.initialConfig.siteId,
                version: rec.get('version')
            },
            success: function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    self.getStore().load();
                }
                else {
                    Ext.Msg.alert('Error', 'Error setting viewing version');
                }
            },
            failure: function (response) {
                Ext.Msg.alert('Error', 'Error setting viewing version');
            }
        });
    },

    constructor: function (config) {
        var store = Ext.create("Ext.data.Store", {
            proxy: {
                type: 'ajax',
                url: '/knitkit/erp_app/desktop/site/website_publications',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                extraParams: {
                    website_id: config['siteId']
                }
            },
            idProperty: 'id',
            remoteSort: true,
            fields: [
                {
                    name: 'id'
                },
                {
                    name: 'version',
                    type: 'float'
                },
                {
                    name: 'created_at',
                    type: 'date'
                },
                {
                    name: 'published_by_username'
                },
                {
                    name: 'comment'
                },
                {
                    name: 'active',
                    type: 'boolean'
                },
                {
                    name: 'viewing',
                    type: 'boolean'
                }
            ],
            listeners: {
                'exception': function (proxy, type, action, options, response, arg) {
                    Ext.Msg.alert('Error', arg);
                }
            }
        });

        config = Ext.apply({
            store: store,
            columns: [
                {
                    header: "Version",
                    sortable: true,
                    flex: 0.5,
                    dataIndex: 'version'
                },
                {
                    header: "Published",
                    flex: 1,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('m/d/Y H:i:s'),
                    dataIndex: 'created_at'
                },
                {
                    header: "Published By",
                    flex: 1,
                    sortable: true,
                    dataIndex: 'published_by_username'
                },
                {
                    menuDisabled: true,
                    resizable: false,
                    xtype: 'actioncolumn',
                    header: 'Actions',
                    align: 'center',
                    width: 100,
                    items: [
                        {
                            getTip: function(value, meta, record){
                                if (record.get('viewing')) {
                                    return 'Already viewing this version';
                                }
                                else {
                                    return 'View this version';
                                }
                            },
                            getClass: function (v, meta, rec) {  // Or return a class from a function
                                if (rec.get('viewing')) {
                                    return 'viewing-col x-action-col-icon';
                                } else {
                                    return 'view-col x-action-col-icon';
                                }
                            },
                            handler: function (grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                if (rec.get('viewing')) {
                                    return false;
                                }
                                else {
                                    grid.ownerCt.setViewingVersion(rec);
                                }
                            }
                        },
                        {
                            getTip: function(value, meta, record){
                                if (record.get('active')) {
                                    return 'Version is already active';
                                } else {
                                    return 'Set this version as the active version';
                                }
                            },
                            getClass: function (v, meta, rec) {  // Or return a class from a function
                                if (rec.get('active')) {
                                    return 'active-col x-action-col-icon';
                                } else {
                                    return 'activate-col x-action-col-icon';
                                }
                            },
                            handler: function (grid, rowIndex, colIndex) {
                                if (currentUser.hasCapability('activate', 'Website')) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    if (rec.get('active')) {
                                        return false;
                                    }
                                    else {
                                        grid.ownerCt.activate(rec);
                                    }
                                }
                                else {
                                    compassUser.showInvalidAccess();
                                }
                            }
                        },
                        {
                            icon: '/assets/icons/document/document_16x16.png',
                            tooltip: 'Comments',
                            handler: function (grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);

                                Ext.create("Ext.window.Window", {
                                    width: 325,
                                    height: 400,
                                    buttonAlign: 'center',
                                    bodyPadding: 5,
                                    title: 'Comments',
                                    autoScroll: true,
                                    layout: 'fit',
                                    items: {
                                        xtype: 'panel',
                                        html: rec.get('comment')
                                    },
                                    buttons: [
                                        {
                                            text: 'Close',
                                            handler: function (btn) {
                                                btn.up('window').close();
                                            }
                                        }
                                    ]
                                }).show();
                            }
                        }
                    ]
                }
            ],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    pageSize: 10,
                    store: store,
                    displayInfo: true,
                    displayMsg: '{0} - {1} of {2}',
                    emptyMsg: "Empty"

                }
            ]
        }, config);

        this.callParent([config]);
    }
});