Ext.define("Compass.ErpApp.Organizer.Applications.Crm.PartyGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.partygrid',

    constructor: function (config) {
        var fromRoles = config.fromRoles || [],
            toRoles = config.toRoles || [],
            store = Ext.create('Ext.data.Store', {
                fields: [
                    'description',
                    {name: 'createdAt', mapping: 'created_at', type: 'date'},
                    {name: 'updated_at', mapping: 'updated_at', type: 'date'},
                    'model'
                ],
                proxy: {
                    type: 'ajax',
                    url: '/erp_app/organizer/crm/parties',
                    extraParams: {
                        from_roles: fromRoles.join(),
                        to_roles: toRoles.join()
                    },
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        root: 'parties',
                        totalProperty: 'total'
                    }
                }
            });

        config = Ext.apply({
            columns: [
                {
                    header: 'Description',
                    dataIndex: 'description'
                },
                {
                    header: 'Customer Type',
                    dataIndex: 'type'
                },
                {
                    header: 'Created At',
                    dataIndex: 'createdAt',
                    renderer: Ext.util.Format.dateRenderer('m/d/Y')
                },
                {
                    header: 'Updated At',
                    dataIndex: 'updatedAt',
                    renderer: Ext.util.Format.dateRenderer('m/d/Y')
                }
            ],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: store,
                    dock: 'bottom',
                    displayInfo: true
                }
            ],
            frame: false,
            autoScroll: true,
            loadMask: true
        }, config);

        this.callParent([config]);
    }
});


