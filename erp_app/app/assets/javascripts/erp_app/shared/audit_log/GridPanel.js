Ext.define('Compass.ErpApp.Shared.AuditLog.Type', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'description', type: 'string'},
        {name: 'internal_identifier', type: 'string'}
    ]
});

Ext.create('Ext.data.Store', {
    storeId: 'audit-log-view-audit-log-type-store',
    model: 'Compass.ErpApp.Shared.AuditLog.Type',
    proxy: {
        type: 'ajax',
        url: '/erp_app/shared/audit_log/audit_log_types',
        reader: {
            type: 'json',
            root: 'audit_log_types'
        }
    }
});

Ext.define('Compass.ErpApp.Shared.AuditLog.AuditLogEntry', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'party_description',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date'
        },
        {
            name: 'audit_log_type',
            type: 'string'
        }

    ]
});

Ext.define('Compass.ErpApp.Shared.AuditLog.GridPanel', {
    alias: 'widget.auditloggridpanel',
    extend: 'Ext.grid.Panel',
    title: 'Audit Log Records',
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

    columns: [
        {
            header: 'Log Id',
            dataIndex: 'id',
            flex: 0.5
        },
        {
            header: 'Logged By',
            dataIndex: 'party_description',
            sortable: false,
            flex: 1
        },
        {
            header: 'Description',
            dataIndex: 'description',
            sortable: false,
            flex: 2
        },
        {
            header: 'Created At',
            dataIndex: 'created_at',
            renderer: function (value) {
                return Ext.Date.format(value, 'm-d-Y');
            },
            flex: 2
        },
        {
            header: 'Audit Log Type',
            dataIndex: 'audit_log_type',
            sortable: false,
            flex: 2
        }

    ],

    viewConfig: {
        stripeRows: true
    },

    listeners: {
        'itemdblclick': function (view, record, item, index, e, eOpts) {
            view.up('auditlogtabpanel').fireEvent('auditLogEntrySelected', record);
        }
    },

    initComponent: function () {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'Compass.ErpApp.Shared.AuditLog.AuditLogEntry',
            pageSize: 15,
            start: 0,
            remoteSort: true,
            proxy: {
                type: 'ajax',
                url: '/erp_app/shared/audit_log/index',
                extraParams: {
                    start_date: null,
                    end_date: null,
                    audit_log_type_id: null,
                    event_record_type: me.eventRecordType,
                    event_record_id: me.eventRecordId
                },
                reader: {
                    type: 'json',
                    root: 'audit_log_entries',
                    totalProperty: 'total_count'

                }
            }
        });

        var dockedItems = [];

        if (me.showToolbar) {
            dockedItems.push({
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    'Start Date:',
                    {
                        xtype: 'datefield',
                        itemId: 'startDate',
                        value: new Date()

                    },
                    'End Date:',
                    {
                        xtype: 'datefield',
                        itemId: 'endDate',
                        value: new Date()
                    },
                    'Audit Log Type',
                    {
                        xtype: 'combo',
                        itemId: 'auditLogTypeId',
                        store: Ext.getStore('audit-log-view-audit-log-type-store'),
                        queryMode: 'remote',
                        displayField: 'description',
                        valueField: 'id'
                    },
                    {
                        xtype: 'button',
                        text: 'Search',
                        iconCls: 'icon-search',
                        handler: function (btn) {
                            var startDate = btn.up('toolbar').down('#startDate').getValue();
                            var endDate = btn.up('toolbar').down('#endDate').getValue();
                            var auditLogTypeId = btn.up('toolbar').down('#auditLogTypeId').getValue();

                            var store = btn.up('toolbar').up('auditloggridpanel').getStore();
                            store.currentPage = 1;
                            store.load({params: {start: 0, start_date: startDate, end_date: endDate, audit_log_type_id: auditLogTypeId}});
                        }
                    },
                    {
                        xtype: 'button',
                        text: 'All',
                        iconCls: 'icon-eye',
                        handler: function (btn) {
                            var store = btn.up('toolbar').up('auditloggridpanel').getStore();
                            store.currentPage = 1;
                            store.load({params: {start: 0, start_date: null, end_date: null, audit_log_type_id: null}});
                        }
                    }
                ]
            });
        }

        dockedItems.push({
            xtype: 'pagingtoolbar',
            store: this.store,
            dock: 'bottom',
            displayInfo: true
        });

        me.dockedItems = dockedItems;

        me.callParent();
    }
});
