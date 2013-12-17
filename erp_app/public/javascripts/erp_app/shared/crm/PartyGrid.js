Ext.define("Compass.ErpApp.Shared.Crm.PartyGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.crmpartygrid',
    frame: false,
    autoScroll: true,
    loadMask: true,

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    /**
     * @cfg {String[]} fromRoles
     * Array of PartyRoles to load for Grid Example (Customer, Prospect).
     */
    partyRole: 'customer',

    /**
     * @cfg {String} toRole
     * To RoleType these parties should be related to.
     */
    toRole: null,

    /**
     * @cfg {Integer} toPartyId
     * To parties id to get related parties from.
     */
    toPartyId: null,

    /**
     * @cfg {string} relationshipTypeToCreate
     * Relationship type to create parties with.
     */
    relationshipTypeToCreate: null,

    /**
     * @cfg {String} addBtnIconCls
     * Icon css class for add button.
     */
    addBtnIconCls: 'icon-add',

    /**
     * @cfg {String} title
     * title of panel.
     */
    title: 'Customers',

    /**
     * @cfg {String} addBtnDescription
     * Description for add party button.
     */
    addBtnDescription: 'Add Customer',

    /**
     * @cfg {String} searchDescription
     * Placeholder description for party search box.
     */
    searchDescription: 'Find Customer',

    /**
     * @cfg {String} allowedPartyType
     * Party type that can be created {Both | Individual | Organization}.
     */
    allowedPartyType: 'Both',

    /**
     * @cfg {String} partyMgtTitle
     * Title of parties.
     */
    partyMgtTitle: 'Customer',

    /**
     * @cfg {Array | Object} partyRelationships
     * Party Relationships to include in the details of this party, is an config object with the following options
     *
     * @param {String} title
     * title of tab
     *
     * @param {String} relationshipType
     * relationship type internal_identifier
     *
     * @param {String} relationshipDirection {from | to}
     * if we are getting the to or from side of relationships
     *
     * @param {String} toRoleType
     * RoleType internal_identifier for to side
     *
     * @param {String} fromRoleType
     * RoleType internal_identifier for from side
     *
     * @param {Boolean} canAddParty
     * True to allow party creation.
     *
     * @param {Boolean} canEditParty
     * True to allow party to be edited.
     *
     * @param {Boolean} canDeleteParty
     * True to allow party to be deleted.
     *
     * @example
     * {
            title: 'Employees',
            relationshipType: 'employee_customer',
            toRoleType: 'customer',
            fromRoleType: 'employee',
            canAddParty: true,
            canEditParty: true,
            canDeleteParty: true
        }
     */
    partyRelationships: [],
    /**
     * @cfg {Boolean} canAddParty
     * True to allow party creation.
     */
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
    /**
     * @cfg {Array} additionalTabs
     * Array of additional tab panels to add.
     */
    additionalTabs: [],

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
             * @event partycreated
             * Fires when a party is created
             * @param {Compass.ErpApp.Shared.Crm.PartyGrid} this
             * @param {Int} newPartyId
             */
            'partycreated',
            /*
             * @event partyupdated
             * Fires when a party is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyGrid} this
             * @param {Int} updatedPartyId
             */
            'partyupdated',
            /*
             * @event usercreated
             * Fires when a user is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyGrid} this
             * @param {Int} createdUserId
             */
            'usercreated',
            /*
             * @event userupdated
             * Fires when a party is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyGrid} this
             * @param {Int} updatedUserId
             */
            'userupdated',
            /*
             * @event contactcreated
             * Fires when a contact is created
             * @param {Compass.ErpApp.Shared.Crm.PartyGrid} this
             * @param {String} ContactType {PhoneNumber, PostalAddress, EmailAddress}
             * @param {Record} record
             * @param {int} partyId
             */
            'contactcreated',
            /*
             * @event contactupdated
             * Fires when a contact is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyGrid} this
             * @param {String} ContactType {PhoneNumber, PostalAddress, EmailAddress}
             * @param {Record} record
             * @param {int} partyId
             */
            'contactupdated',
            /*
             * @event contactdestroyed
             * Fires when a contact is destroyed
             * @param {Compass.ErpApp.Shared.Crm.PartyGrid} this
             * @param {String} ContactType {PhoneNumber, PostalAddress, EmailAddress}
             * @param {Record} record
             * @param {int} partyId
             */
            'contactdestroyed'
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
                    // open tab with create user form.
                    var tabPanel = button.up('crmpartygrid').up('#' + me.applicationContainerId);

                    // check and see if tab already open
                    var tab = tabPanel.down('crmpartyformpanel');
                    if (tab) {
                        tabPanel.setActiveTab(tab);
                        return;
                    }

                    var crmPartyFormPanel = Ext.create("widget.crmpartyformpanel", {
                        title: me.addBtnDescription,
                        applicationContainerId: me.applicationContainerId,
                        toPartyId: me.toPartyId,
                        partyRole: me.partyRole,
                        toRole: me.toRole,
                        relationshipTypeToCreate: me.relationshipTypeToCreate,
                        closable: true,
                        allowedPartyType: me.allowedPartyType,
                        listeners: {
                            partycreated: function (comp, partyId) {
                                me.fireEvent('partycreated', me, partyId);
                            },
                            usercreated: function (comp, userId) {
                                me.fireEvent('usercreated', me, userId);
                            }
                        }
                    });

                    tabPanel.add(crmPartyFormPanel);
                    tabPanel.setActiveTab(crmPartyFormPanel);
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
                        var grid = button.up('crmpartygrid'),
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
                {name: 'updatedAt', mapping: 'updated_at', type: 'date'},
                'model',
                {name: 'userId', mapping: 'user_id', type: 'int'}
            ],
            proxy: {
                type: 'ajax',
                url: '/erp_app/organizer/crm/parties',
                extraParams: {
                    party_role: me.partyRole,
                    to_role: me.toRole,
                    to_party_id: me.toPartyId
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'parties',
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
                header: 'Description',
                dataIndex: 'description',
                width: 250
            },
            {
                header: 'Customer Type',
                dataIndex: 'model',
                renderer: function (v) {
                    switch (v) {
                        case 'Organization':
                            return 'Business';
                            break;
                        case 'Individual':
                            return 'Individual';
                            break;
                    }
                }
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
                                crmTaskTabPanel = grid.up('crmpartygrid').up('#' + me.applicationContainerId),
                                itemId = 'detailsParty-' + record.get('id'),
                                title = record.get('description'),
                                partyId = record.get('id');

                            var partyDetailsPanel = crmTaskTabPanel.down('#' + itemId);

                            if (!partyDetailsPanel) {
                                partyDetailsPanel = Ext.create('widget.crmpartydetailspanel', {
                                    title: title,
                                    itemId: itemId,
                                    applicationContainerId: me.applicationContainerId,
                                    partyId: partyId,
                                    partyModel: record.get('model'),
                                    partyRelationships: me.partyRelationships,
                                    additionalTabs: me.additionalTabs,
                                    closable: true,
                                    listeners:{
                                        contactcreated:function(comp, contactType, record){
                                            me.fireEvent('contactcreated', me, contactType, record, partyId);
                                        },
                                        contactupdated:function(comp, contactType, record){
                                            me.fireEvent('contactupdated', me, contactType, record, partyId);
                                        },
                                        contactdestroyed:function(comp, contactType, record){
                                            me.fireEvent('contactdestroyed', me, contactType, record, partyId);
                                        }
                                    }
                                });
                                crmTaskTabPanel.add(partyDetailsPanel);
                            }

                            crmTaskTabPanel.setActiveTab(partyDetailsPanel);
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
                                crmTaskTabPanel = grid.up('crmpartygrid').up('#' + me.applicationContainerId),
                                itemId = 'editParty-' + record.get('id'),
                                title = 'Edit ' + me.partyMgtTitle;

                            var editPartyForm = crmTaskTabPanel.down('#' + itemId);

                            if (!editPartyForm) {
                                editPartyForm = Ext.create('widget.crmpartyformpanel', {
                                    title: title,
                                    itemId: itemId,
                                    applicationContainerId: me.applicationContainerId,
                                    partyType: record.get('model'),
                                    partyId: record.get('id'),
                                    userId: record.get('userId'),
                                    listeners: {
                                        partyupdated: function (comp, partyId) {
                                            me.fireEvent('partyupdated', me, partyId);
                                        },
                                        userupdated: function (comp, userId) {
                                            me.fireEvent('userupdated', me, userId);
                                        }
                                    },
                                    closable: true
                                });
                                crmTaskTabPanel.add(editPartyForm);
                            }

                            crmTaskTabPanel.setActiveTab(editPartyForm);
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
                                        url: '/erp_app/organizer/crm/parties/' + record.get('id'),
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


