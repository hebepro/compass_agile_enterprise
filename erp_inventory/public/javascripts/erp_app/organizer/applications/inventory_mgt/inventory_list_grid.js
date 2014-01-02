Ext.define("Compass.ErpApp.Organizer.Applications.InventoryMgt.InventoryListGrid",{
    extend:"Ext.grid.Panel",
    alias:'widget.inventory_list_grid',
    frame: false,
    autoScroll: true,
    loadMask: true,

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'invMgtTabPanel',

    /**
     * @cfg {String} detailsUrl
     * Url to retrieve details for these parties.
     */
    detailsUrl: '/erp_inventory/erp_app/organizer/inventory_mgt/inventory_entries/show_summary/',

    /**
     * @cfg {String} addBtnIconCls
     * Icon css class for add button.
     */
    addBtnIconCls: 'icon-add',

    /**
     * @cfg {String} title
     * title of panel.
     */
    title: 'Inventory',

    /**
     * @cfg {String} addBtnDescription
     * Description for add party button.
     */
    addBtnDescription: 'Add Inventory Entry',

    /**
     * @cfg {String} searchDescription
     * Placeholder description for party search box.
     */
    searchDescription: 'Search Inventory',

    inventoryMgtTitle: 'Inventory',

    canAddParty: true,
    /**
     * @cfg {Boolean} canEditParty
     * True to allow party to be edited.
     */
    canEditParty: true,
    /**
     * @cfg {Boolean} canDeleteParty
     * True to allow party to be deleted.
     */
    canDeleteParty: true,

    constructor: function (config) {
        var listeners = {
            activate: function () {
                this.store.load();
            }
        };

        config['listeners'] = Ext.apply(listeners, config['listeners']);

        this.callParent([config]);
    },

    initComponent: function () {
        var me = this;

        me.addEvents(
            /*
             * @event inventoryUpdated
             * Fires when a inventory entry is updated
             */
            'inventoryUpdated'
        );

        // setup toolbar
        var toolBarItems = [];

        // attempt to add Add party button
        if (me.canAddParty) {
            toolBarItems.push({
                text: me.addBtnDescription,
                xtype: 'button',
                iconCls: me.addBtnIconCls,
                handler: function (button) {
                    // open tab with create inventory entry form.
                    var tabPanel = button.up('inventory_list_grid').up('#' + me.applicationContainerId);

                    // check and see if tab already open
                    var tab = tabPanel.down('inventory_entry_form_panel');
                    if (tab) {
                        tabPanel.setActiveTab(tab);
                        return;
                    }

                    var inventoryEntryFormPanel = Ext.create("widget.inventory_entry_form_panel", {
                        title: me.addBtnDescription,
                        applicationContainerId: me.applicationContainerId,
                        closable: true,
                        listeners: {
                            partycreated: function (comp, partyId) {
                                me.fireEvent('partycreated', me, partyId);
                            },
                            usercreated: function (comp, userId) {
                                me.fireEvent('usercreated', me, userId);
                            }
                        }
                    });

                    tabPanel.add(inventoryEntryFormPanel);
                    tabPanel.setActiveTab(inventoryEntryFormPanel);
                }
            }, '|');
        }

        toolBarItems.push('Search',
            {
                xtype: 'textfield',
                emptyText: me.searchDescription,
                width: 200,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var button = field.up('toolbar').down('button');
                            button.fireEvent('click', button);
                        }
                    }
                }
            },
            {
                xtype: 'button',
                itemId: 'searchbutton',
                icon: '/images/erp_app/organizer/applications/crm/toolbar_find.png',
                listeners: {
                    click: function (button, e, eOpts) {
                        var grid = button.up('inventory_list_grid'),
                            value = grid.down('toolbar').down('textfield').getValue();

                        grid.store.getProxy().extraParams.query_filter = value;
                        grid.store.load({
                            page: 1,
                            params:{
                                start: 0,
                                limit: 25
                            }
                        });
                    }
                }
            });

        var store = Ext.create('Ext.data.Store', {
            fields: [
                'id',
                'description',
                'sku',
                'number_available',
                'inventory_storage_facility_description',
                {name: 'createdAt', mapping: 'created_at', type: 'date'},
                {name: 'updatedAt', mapping: 'updated_at', type: 'date'},
                'model'
            ],
            proxy: {
                type: 'ajax',
                url: '/erp_inventory/erp_app/organizer/inventory_mgt/inventory_entries',
                extraParams: {
                    party_role: me.partyRole,
                    to_role: me.toRole,
                    to_party_id: me.toPartyId
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'inventory_entries',
                    totalProperty: 'total'
                }
            }
        });

        me.store = store;

        me.dockedItems = [
            {
                xtype: 'toolbar',
                docked: 'top',
                items: toolBarItems
            },
            {
                xtype: 'pagingtoolbar',
                store: store,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        // setup columns

        columns = [
            {
                header: 'ID',
                width: 50,
                dataIndex: 'id'
            },
            {
                header: 'Location',
                width: 225,
                dataIndex: 'inventory_storage_facility_description'
            },
            {
                header: 'Description',
                width: 225,
                dataIndex: 'description'
            },
            {
                header: 'SKU',
                dataIndex: 'sku'
            },
            {
                header: 'Quantity',
                dataIndex: 'number_available'
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
                                invMgtTabPanel = grid.up('inventory_list_grid').up('#' + me.applicationContainerId),
                                itemId = 'detailsParty-' + record.get('id'),
                                title = record.get('description'),
                                inventoryEntryId = record.get('id');

                            var partyDetailsPanel = invMgtTabPanel.down('#' + itemId);

                            if (!partyDetailsPanel) {
                                partyDetailsPanel = Ext.create('widget.inventory_details_panel', {
                                    title: title,
                                    itemId: itemId,
                                    applicationContainerId: me.applicationContainerId,
                                    detailsUrl: me.detailsUrl,
                                    inventoryEntryId: inventoryEntryId,
                                    partyModel: record.get('model'),
                                    partyRelationships: me.partyRelationships,
                                    closable: true,
                                    listeners:{
//                                        contactcreated:function(comp, contactType, record){
//                                            me.fireEvent('contactcreated', me, contactType, record, partyId);
//                                        },
//                                        contactupdated:function(comp, contactType, record){
//                                            me.fireEvent('contactupdated', me, contactType, record, partyId);
//                                        },
//                                        contactdestroyed:function(comp, contactType, record){
//                                            me.fireEvent('contactdestroyed', me, contactType, record, partyId);
//                                        }
                                    }
                                });
                                invMgtTabPanel.add(partyDetailsPanel);
                            }

                            invMgtTabPanel.setActiveTab(partyDetailsPanel);
                            partyDetailsPanel.loadParty();
                        }
                    }
                ]
            }
        ];

        // attempt to add edit column
        if (me.canEditParty) {
            columns.push({
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
                                invMgtTabPanel = grid.up('inventory_list_grid').up('#' + me.applicationContainerId),
                                itemId = 'editInventoryEntry-' + record.get('id'),
                                title = 'Edit ' + me.inventoryMgtTitle;

                            var editInventoryEntryForm = invMgtTabPanel.down('#' + itemId);

                            if (!editInventoryEntryForm) {
                                editInventoryEntryForm = Ext.create('widget.inventory_entry_form_panel', {
                                    title: title,
                                    itemId: itemId,
                                    applicationContainerId: me.applicationContainerId,
                                    partyType: record.get('model'),
                                    inventoryEntryId: record.get('id'),
                                    listeners: {
                                    },
                                    closable: true
                                });
                                invMgtTabPanel.add(editInventoryEntryForm);
                            }
                            invMgtTabPanel.setActiveTab(editInventoryEntryForm);
                        }
                    }
                ]
            });
        }

        // attempt to add delete column
        if (me.canDeleteParty) {
            columns.push({
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
                                        url: '/erp_inventory/erp_app/organizer/inventory_mgt/inventory_entries/' + record.get('id'),
                                        params: {
                                            inventory_entry_id: record.get('id')
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
            });
        }
        me.columns = columns;
        me.callParent(arguments);
    }
});



