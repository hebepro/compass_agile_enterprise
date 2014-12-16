Ext.define('Compass.ErpApp.Shared.AuditLog.AuditLogItem', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'audit_log_id',
            type: 'int'
        },
        {
            name: 'old_value',
            type: 'string'
        },
        {
            name: 'new_value',
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
            name: 'audit_log_item_type',
            type: 'string'
        }

    ]
});

Ext.define('Compass.ErpApp.Shared.AuditLog.ItemGridPanel', {
    alias: 'widget.auditlogitemgridpanel',
    extend: 'Ext.grid.Panel',
    title: 'Audit Log Items',
    autoScroll: true,
    columns: [
        {
            header: 'Audit Log Id',
            dataIndex: 'audit_log_id',
            sortable: false,
            flex: 0.5
        },
        {
            header: 'Log Item Id',
            dataIndex: 'id',
            flex: 0.5
        },
        {
            header: 'Audit Log Item Type',
            dataIndex: 'audit_log_item_type',
            flex: 1
        },
        {
            header: 'Description',
            dataIndex: 'description',
            sortable: false,
            flex: 2
        },
        {
            header: 'Old Value',
            dataIndex: 'old_value',
            sortable: false,
            flex: 1
        },
        {
            header: 'New Value',
            dataIndex: 'new_value',
            sortable: false,
            flex: 1
        }

    ],

    viewConfig: {
        stripeRows: true
    },

    initComponent: function () {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'Compass.ErpApp.Shared.AuditLog.AuditLogItem',
            proxy: {
                type: 'ajax',
                url: '/erp_app/shared/audit_log/items',
                extraParams: {
                    audit_log_id: null
                },
                reader: {
                    type: 'json',
                    root: 'audit_log_items'
                }
            }
        });

        me.callParent();
    }
});
