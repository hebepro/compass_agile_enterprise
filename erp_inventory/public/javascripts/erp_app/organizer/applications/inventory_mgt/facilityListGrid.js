Ext.define("Compass.ErpApp.Organizer.Applications.InventoryMgt.FacilityListGrid",{
    extend:"Ext.grid.Panel",
    alias:'widget.facility_list_grid',
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
    detailsUrl: '/erp_app/organizer/asset_management/facilities/show_summary/',

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
    addBtnDescription: 'Add Inventory Storage Facility',

    /**
     * @cfg {String} searchDescription
     * Placeholder description for party search box.
     */
    searchDescription: 'Search Facilities',

    facilityMgtTitle: 'Facility',

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
            'facilityUpdated'
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
                    var tabPanel = button.up('facility_list_grid').up('#' + me.applicationContainerId);

                    // check and see if tab already open
                    var tab = tabPanel.down('facility_form_panel');
                    if (tab) {
                        tabPanel.setActiveTab(tab);
                        return;
                    }

                    var facilityFormPanel = Ext.create("widget.facility_form_panel", {
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
                    tabPanel.add(facilityFormPanel);
                    tabPanel.setActiveTab(facilityFormPanel);
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
                        var grid = button.up('facility_list_grid'),
                            value = grid.down('toolbar').down('textfield').getValue();

                        grid.store.load({
                            params: {
                                query_filter: value,
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
                {name: 'createdAt', mapping: 'created_at', type: 'date'},
                {name: 'updatedAt', mapping: 'updated_at', type: 'date'}
            ],
            proxy: {
                type: 'ajax',
                url: '/erp_app/organizer/asset_management/facilities',
                extraParams: {

                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'facilities',
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
                dataIndex: 'id'
            },
            {
                header: 'Description',
                width: 250,
                dataIndex: 'description'
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
                                invMgtTabPanel = grid.up('facility_list_grid').up('#' + me.applicationContainerId),
                                itemId = 'detailsParty-' + record.get('id'),
                                title = record.get('description'),
                                facilityId = record.get('id');

                            var partyDetailsPanel = invMgtTabPanel.down('#' + itemId);

                            if (!partyDetailsPanel) {
                                partyDetailsPanel = Ext.create('widget.facility_details_panel', {
                                    title: title,
                                    itemId: itemId,
                                    applicationContainerId: me.applicationContainerId,
                                    detailsUrl: me.detailsUrl,
                                    facilityId: facilityId,
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
                                invMgtTabPanel = grid.up('facility_list_grid').up('#' + me.applicationContainerId),
                                itemId = 'editFacility-' + record.get('id'),
                                title = 'Edit ' + me.facilityMgtTitle;

                            var editInventoryEntryForm = invMgtTabPanel.down('#' + itemId);

                            if (!editInventoryEntryForm) {
                                editInventoryEntryForm = Ext.create('widget.facility_form_panel', {
                                    title: title,
                                    itemId: itemId,
                                    applicationContainerId: me.applicationContainerId,
                                    partyType: record.get('model'),
                                    facilityId: record.get('id'),
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
                                        url: '/erp_app/organizer/asset_management/facilities/' + record.get('id'),
                                        params: {
                                            facility_id: record.get('id')
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