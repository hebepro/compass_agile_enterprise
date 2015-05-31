Ext.define("Compass.ErpApp.Shared.AuditLog.TabPanel", {
    alias: 'widget.auditlogtabpanel',
    extend: "Ext.tab.Panel",
    autoScroll: true,

    /**
     * @cfg {String} event_record_type
     * Record type of the event record to limit results by.
     */
    eventRecordType: null,

    /**
     * @cfg {Int} event_record_id
     * Id of the event record to limit results by.
     */
    eventRecordId: null,

    /**
     * @cfg {Boolean} showToolbar
     * True to render toolbar.
     */
    showToolbar: false,

    plugins: Ext.create('Ext.ux.TabCloseMenu', {
        extraItemsTail: [
            '-',
            {
                text: 'Closable',
                checked: true,
                hideOnClick: true,
                handler: function (item) {
                    currentItem.tab.setClosable(item.checked);
                }
            },
            '-',
            {
                text: 'Enabled',
                checked: true,
                hideOnClick: true,
                handler: function (item) {
                    currentItem.tab.setDisabled(!item.checked);
                }
            }
        ],
        listeners: {
            beforemenu: function (menu, item) {
                var enabled = menu.child('[text="Enabled"]');
                menu.child('[text="Closable"]').setChecked(item.closable);
                if (item.tab.active) {
                    enabled.disable();
                } else {
                    enabled.enable();
                    enabled.setChecked(!item.tab.isDisabled());
                }

                currentItem = item;
            }
        }
    }),

    getStore: function () {
        return this.down('auditloggridpanel').store;
    },

    constructor: function (config) {
        var me = this;

        me.addEvents({
            'auditLogEntrySelected': true
        });

        var listeners = {
            render: function () {
                me.getStore().load({
                    params: {
                        start: 0,
                        limit: 25
                    }
                });
            },
            auditLogEntrySelected: function (auditLogEntry) {
                var audit_log_item_grid = Ext.create('widget.auditlogitemgridpanel',
                    {
                        closable: true,
                        listeners: {
                            'afterrender': function (comp) {
                                comp.store.load({params: {audit_log_id: auditLogEntry.get('id')}});
                            }
                        }
                    }
                );
                me.add(audit_log_item_grid);
                me.setActiveTab(audit_log_item_grid);
            }
        };

        config['listeners'] = Ext.apply(listeners, config['listeners']);

        me.callParent([config]);
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'auditloggridpanel',
                showToolbar: me.showToolbar,
                eventRecordType: me.eventRecordType,
                eventRecordId: me.eventRecordId
            }
        ];

        me.callParent();
    }
});