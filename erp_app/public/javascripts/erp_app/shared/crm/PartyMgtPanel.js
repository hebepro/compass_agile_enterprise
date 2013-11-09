Ext.define("Compass.ErpApp.Shared.Crm.PartyMgtPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.crmpartymgtpanel',
    layout: 'border',
    items: [],
    listeners: {
        activate: function () {
            this.down('crmpartygrid').store.load({
                params: {
                    start: 0,
                    limit: 25
                }
            });
        }
    },

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    /**
     * @cfg {String[]} fromRoles
     * Array of PartyRoles to load for Grid Example (Customer, Prospect).
     */
    partyRoles: ['customer'],

    /**
     * @cfg {String} toRole
     * Relationship with this toRole of the current user should be mimic on these parties.
     */
    toRole: null,

    /**
     * @cfg {String} detailsUrl
     * Url to retrieve details for these parties.
     */
    detailsUrl: '/erp_app/organizer/crm/base/get_party_details/',

    /**
     * @cfg {String} addPartyBtn
     * Url for add party button.
     */
    addPartyBtn: '/images/erp_app/organizer/applications/crm/customer_360_64x64.png',

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
     * @cfg {Array | Object} partyRelationships
     * Party Relationships to include in the details of this party, is an config object with the following options
     * @param {String} title
     * title of tab
     * @param {String} relationshipType
     * relationship type internal_identifier
     * @param {String} relationshipDirection {from | to}
     * if this is to to or from side of the relationship
     */
    partyRelationships: [
        {
            title: 'Employees',
            relationshipType: 'employee_customer',
            relationshipsDirection: 'to'
        }
    ],

    initComponent: function () {
        var me = this;

        me.addEvents(
            /*
             * @event partycreated
             * Fires when a party is created
             * @param {Compass.ErpApp.Shared.Crm.PartyMgtPanel} this
             * @param {Int} newPartyId
             */
            'partycreated',
            /*
             * @event partyupdated
             * Fires when a party is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyMgtPanel} this
             * @param {Int} updatedPartyId
             */
            'partyupdated',
            /*
             * @event usercreated
             * Fires when a user is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyMgtPanel} this
             * @param {Int} createdUserId
             */
            'usercreated',
            /*
             * @event userupdated
             * Fires when a party is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyMgtPanel} this
             * @param {Int} updatedUserId
             */
            'userupdated'
        );

        //add header
        var items = [
            {
                xtype: 'panel',
                itemId: 'containerPanel',
                region: 'north',
                height: 100,
                layout: 'hbox',
                width: '50%',
                items: [
                    {
                        xtype: 'panel',
                        layout: 'vbox',
                        border: false,
                        items: [
                            {
                                xtype: 'image',
                                src: me.addPartyBtn,
                                height: 64,
                                width: 64,
                                cls: 'shortcut-image-button',
                                style: 'display: block; margin: 10px 10px 0px 44px; clear: both;',
                                listeners: {
                                    render: function (component) {
                                        component.getEl().on('click', function (e) {

                                            // open tab with create user form.
                                            var tabPanel = component.up('tabpanel');

                                            // check and see if tab already open
                                            var tab = tabPanel.down('party_form');
                                            if (tab) {
                                                tabPanel.setActiveTab(tab);
                                                return;
                                            }

                                            var crmPartyFormPanel = Ext.create("widget.crmpartyformpanel", {
                                                title: me.addBtnDescription,
                                                applicationContainerId: me.applicationContainerId,
                                                toRole: me.toRole,
                                                partyRoles: me.partyRoles,
                                                closable: true,
                                                allowedPartyType: me.allowedPartyType,
                                                listeners: {
                                                    partycreated: function (comp, partyId) {
                                                        me.fireEvent('partycreated', me, partyId);
                                                    },
                                                    partyupdated: function (comp, partyId) {
                                                        me.fireEvent('partyupdated', me, partyId);
                                                    },
                                                    usercreated: function (comp, userId) {
                                                        me.fireEvent('usercreated', me, userId);
                                                    },
                                                    userupdated: function (comp, userId) {
                                                        me.fireEvent('userupdated', me, userId);
                                                    }
                                                }
                                            });

                                            tabPanel.add(crmPartyFormPanel);
                                            tabPanel.setActiveTab(crmPartyFormPanel);

                                        }, component);
                                    }
                                }
                            },
                            {
                                xtype: 'panel',
                                border: false,
                                html: "<p style='margin: 5px 10px 10px 30px; text-align: center'>" + me.addBtnDescription + "</p>"
                            }
                        ]
                    },
                    {
                        xtype: 'form',
                        itemId: 'searchForm',
                        width: '50%',
                        layout: 'hbox',
                        style: 'margin: 30px 0 0 30px;',
                        border: false,
                        url: '/erp_app/organizer/users/search',
                        items: [
                            {
                                itemId: 'usersearchbox',
                                xtype: 'textfield',
                                emptyText: me.searchDescription,
                                width: 200,
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == e.ENTER) {
                                            var button = field.up('#usersearchform').down('#searchbutton');
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
                                        var partyMgtPanel = button.up('party_mgt_panel'),
                                            grid = partyMgtPanel.down('partygrid'),
                                            value = partyMgtPanel.down('#usersearchbox').getValue();

                                        grid.store.load({
                                            params: {
                                                query_filter: value,
                                                start: 0,
                                                limit: 25
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ];

        items.push({
            xtype: 'crmpartygrid',
            region: 'center',
            toRole: me.toRole,
            partyRoles: me.partyRoles,
            partyMgtTitle: me.title,
            applicationContainerId: me.applicationContainerId,
            partyRelationships: me.partyRelationships
        });

        this.items = items;

        this.callParent(arguments);
    }

});        
