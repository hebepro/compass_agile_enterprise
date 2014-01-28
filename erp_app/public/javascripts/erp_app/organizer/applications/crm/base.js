Ext.ns("Compass.ErpApp.Organizer.Applications.Crm");
/**
 * Method to setup organizer application
 * @param {config} Object containing (organizerLayout : reference to main layout container)
 */
Compass.ErpApp.Organizer.Applications.Crm.Base = function (config) {
    this.setup = function () {
        config.organizerLayout.addApplication({
            title: 'CRM',
            id: 'crmTaskTabPanel',
            tabs: [
                {
                    xtype: 'crmpartygrid',
                    applicationContainerId: 'crmTaskTabPanel',
                    itemId: 'customersPanel',
                    partyRelationships: [
                        {
                            title: 'Employees',
                            relationshipType: 'employee_customer',
                            toRoleType: 'customer',
                            fromRoleType: 'employee'
                        }
                    ]
                }
            ],
            menuItems: [
                {
                    title: 'Customers',
                    tabItemId: 'customersPanel',
                    imgSrc: '/images/erp_app/organizer/applications/crm/customer_360_64x64.png',
                    filterPanel: {
                        xtype: 'form',
                        items: [
                            {
                                xtype: 'container',
                                layout: {
                                    type: "hbox",
                                    pack: 'center'
                                },
                                style: {
                                    marginBottom: '5px'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        text: 'Reset',
                                        width: 50,
                                        style: {
                                            marginRight: '5px'
                                        },
                                        handler:function(btn){
                                            btn.up('form').getForm().reset();
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Go!',
                                        width: 50,
                                        handler:function(btn){
                                            Ext.getCmp('crmTaskTabPanel').down('#customersPanel').getStore().load();
                                        }
                                    }
                                ]
                            },
                            {
                                labelWidth: 50,
                                width: 170,
                                fieldLabel: 'Before',
                                xtype: 'datefield',
                                value: new Date()
                            },
                            {
                                labelWidth: 50,
                                width: 170,
                                fieldLabel: 'After',
                                xtype: 'datefield',
                                value: new Date()
                            },
                            {
                                xtype: 'combo',
                                width: 170,
                                emptyText: 'Has A Receipt',
                                store: new Ext.data.ArrayStore({
                                    fields: ['sample'],
                                    data: [
                                    ]
                                }),
                                queryMode: 'local',
                                displayField: 'sample',
                                valueField: 'sample'
                            },
                            {
                                xtype: 'combo',
                                width: 170,
                                emptyText: 'Unreported Expenses',
                                store: new Ext.data.ArrayStore({
                                    fields: ['sample'],
                                    data: [
                                    ]
                                }),
                                queryMode: 'local',
                                displayField: 'sample',
                                valueField: 'sample'
                            },
                            {
                                xtype: 'combo',
                                width: 170,
                                emptyText: 'All Categories',
                                store: new Ext.data.ArrayStore({
                                    fields: ['sample'],
                                    data: [
                                    ]
                                }),
                                queryMode: 'local',
                                displayField: 'sample',
                                valueField: 'sample'
                            },
                            {
                                xtype: 'combo',
                                width: 170,
                                emptyText: 'All Tags',
                                store: new Ext.data.ArrayStore({
                                    fields: ['sample'],
                                    data: [
                                    ]
                                }),
                                queryMode: 'local',
                                displayField: 'sample',
                                valueField: 'sample'
                            }
                        ]
                    }
                }
            ]

        });
    };
};

