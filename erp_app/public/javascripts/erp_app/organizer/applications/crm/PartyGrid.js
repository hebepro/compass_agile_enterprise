Ext.define("Compass.ErpApp.Organizer.Applications.Crm.PartyGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.partygrid',

    constructor: function (config) {
        var fromRoles = config.fromRoles || [],
            store = Ext.create('Ext.data.Store', {
                fields: [
                    'id',
                    'description',
                    {name: 'createdAt', mapping: 'created_at', type: 'date'},
                    {name: 'updatedAt', mapping: 'updated_at', type: 'date'},
                    'model'
                ],
                proxy: {
                    type: 'ajax',
                    url: '/erp_app/organizer/crm/base/parties',
                    extraParams: {
                        from_roles: fromRoles.join(),
                        to_role: config.toRole
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
            store: store,
            columns: [
                {
                    header: 'Description',
                    dataIndex: 'description'
                },
                {
                    header: 'Customer Type',
                    dataIndex: 'model'
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
                },
                {
                    xtype: 'actioncolumn',
                    header: 'Details',
                    align: 'center',
                    width: 50,
                    items: [
                        {
                            icon: '/images/icons/view/view_16x16.png',
                            tooltip: 'Edit',
                            handler: function (grid, rowIndex, colIndex) {
                                var record = grid.getStore().getAt(rowIndex),
                                    crmTaskTabPanel = grid.up('#crmTaskTabPanel'),
                                    itemId = 'detailsParty-' + record.get('id'),
                                    title = record.get('description');

                                var partyDetailsPanel = crmTaskTabPanel.down('#' + itemId);

                                if (!partyDetailsPanel) {
                                    partyDetailsPanel = Ext.create('widget.party_details_panel', {
                                        title: title,
                                        partyId: record.get('id'),
                                        closable: true
                                    });
                                    crmTaskTabPanel.add(partyDetailsPanel);
                                }

                                crmTaskTabPanel.setActiveTab(partyDetailsPanel);
                                partyDetailsPanel.loadParty();
                            }
                        }
                    ]
                },
                {
                    xtype: 'actioncolumn',
                    header: 'Edit',
                    align: 'center',
                    width: 50,
                    items: [
                        {
                            icon: '/images/icons/edit/edit_16x16.png',
                            tooltip: 'Edit',
                            handler: function (grid, rowIndex, colIndex) {
                                var record = grid.getStore().getAt(rowIndex),
                                    crmTaskTabPanel = grid.up('#crmTaskTabPanel'),
                                    itemId = 'editParty-' + record.get('id'),
                                    title = 'Edit ' + config.partyMgtTitle;

                                var editPartyForm = crmTaskTabPanel.down('#' + itemId);

                                if (!editPartyForm) {
                                    editPartyForm = Ext.create('widget.party_form', {
                                        title: title,
                                        partyId: record.get('id')
                                    });
                                    crmTaskTabPanel.add(editPartyForm);
                                }

                                crmTaskTabPanel.setActiveTab(editPartyForm);
                                editPartyForm.loadParty();
                            }
                        }
                    ]
                },
                {
                    xtype: 'actioncolumn',
                    header: 'Delete',
                    align: 'center',
                    width: 50,
                    items: [
                        {
                            icon: '/images/icons/delete/delete_16x16.png',
                            tooltip: 'Delete',
                            handler: function (grid, rowIndex, colIndex) {
                                var record = grid.getStore().getAt(rowIndex);

                                var myMask = new Ext.LoadMask(grid, {msg: "Please wait..."});
                                myMask.show();

                                Ext.Msg.confirm('Please Confirm', 'Delete record?', function (btn) {
                                    if (btn == 'ok' || btn == 'yes') {
                                        Ext.Ajax.request({
                                            method: 'DELETE',
                                            url: '/erp_app/organizer/crm/base/parties',
                                            params: {
                                                party_id: record.get('id')
                                            },
                                            success: function (response) {
                                                myMask.hide();
                                                responseObj = Ext.JSON.decode(response.responseText);

                                                if (responseObj.success) {
                                                    grid.store.reload();
                                                }
                                            },
                                            failure: function (response) {
                                                myMask.hide();
                                                Ext.Msg.alert("Error", "Error with request.");
                                            }
                                        });
                                    }
                                    else {
                                        myMask.hide();
                                    }
                                });
                            }
                        }
                    ]
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


