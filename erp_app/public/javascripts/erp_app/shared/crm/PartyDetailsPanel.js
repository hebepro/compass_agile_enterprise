Ext.define("Compass.ErpApp.Shared.Crm.PartyDetailsPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.crmpartydetailspanel',
    cls: 'crmpartydetailspanel',
    layout: 'border',
    items: [],
    contactWidgetXtypes: [
        'phonenumbergrid',
        'emailaddressgrid',
        'postaladdressgrid'
    ],

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    /**
     * @cfg {Array} additionalTabs
     * Array of additional tab panels to add.
     */
    additionalTabs: [],

    /**
     * @cfg {Int} partyId
     * Id of party being edited.
     */
    partyId: null,

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
     * @param {String} allowedPartyType
     * Party type that can be created {Both | Individual | Organization}.
     *
     * @param {Array | Object} partyRelationships
     *
     * @example
     * {
            title: 'Employees',
            relationshipType: 'employee_customer',
            toRoleType: 'customer',
            fromRoleType: 'employee',
            allowedPartyType: 'Individual',
            partyRelationships: [
                {
                    title: 'Family',
                    relationshipType: 'employee_family_member',
                    toRoleType: 'employee',
                    fromRoleType: 'family_member',
                    allowedPartyType: 'Individual'
                }
            ]
        }
     */
    partyRelationships: [],

    initComponent: function () {
        var me = this,
            tabPanels = [];

        me.addEvents(
            /*
             * @event contactcreated
             * Fires when a contact is created
             * @param {Compass.ErpApp.Shared.Crm.PartyDetailsPanel} this
             * @param {String} ContactType {PhoneNumber, PostalAddress, EmailAddress}
             * @param {Record} record
             */
            'contactcreated',
            /*
             * @event contactupdated
             * Fires when a contact is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyDetailsPanel} this
             * @param {String} ContactType {PhoneNumber, PostalAddress, EmailAddress}
             * @param {Record} record
             */
            'contactupdated',
            /*
             * @event contactdestroyed
             * Fires when a contact is destroyed
             * @param {Compass.ErpApp.Shared.Crm.PartyDetailsPanel} this
             * @param {String} ContactType {PhoneNumber, PostalAddress, EmailAddress}
             * @param {Record} record
             */
            'contactdestroyed'
        );

        contactsPanel = Ext.create('widget.panel', {
            title: 'Contacts',
            layout: 'border',
            itemId: 'contactsContainer',
            items: [
                {
                    xtype: 'panel',
                    style:{
                        borderRight: 'solid 2px black'
                    },
                    header: false,
                    collapsible: true,
                    region: 'west',
                    width: 155,
                    items: Ext.create('widget.dataview', {
                        autoScroll: true,
                        store: Ext.create('Ext.data.SimpleStore', {
                            fields: ['title', 'xtype', 'iconSrc'],
                            data: [
                                ['Phone Numbers', 'phonenumbergrid', '/images/icons/phone/phone_16x16.png'],
                                ['Email Addresses', 'emailaddressgrid', '/images/icons/mail/mail_16x16.png'],
                                ['Postal Addressses', 'postaladdressgrid', '/images/icons/home/home_16x16.png']
                            ]
                        }),
                        selModel: {
                            mode: 'SINGLE',
                            listeners: {
                                selectionchange: function (dataView, selection) {
                                    if (selection) {
                                        selection = selection.first();

                                        var selectedContactContainer = me.down('#contactsContainer').down('#selectedContactContainer'),
                                            selectedContact = selectedContactContainer.down(selection.data.xtype);

                                        selectedContactContainer.layout.setActiveItem(selectedContact);
                                    }
                                }
                            }
                        },
                        listeners: {
                            viewready: function (dataView) {
                                dataView.getSelectionModel().select(dataView.store.first());
                            }
                        },
                        trackOver: true,
                        cls: 'crm-contacts-list',
                        itemSelector: '.crm-contacts-list-item',
                        overItemCls: 'crm-contacts-list-item-hover',
                        tpl: '<tpl for="."><img class="crm-contacts-list-icon" src="{iconSrc}" /><div class="crm-contacts-list-item">{title}</div></tpl>'
                    })
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    itemId: 'selectedContactContainer',
                    cls: 'selectedContactContainer',
                    region: 'center',
                    layout: 'card',
                    items: [
                        {xtype: 'phonenumbergrid', partyId: me.partyId, listeners: {
                            contactcreated: {fn: me.contactCreated, scope: me},
                            contactupdated: {fn: me.contactUpdated, scope: me},
                            contactdestroyed: {fn: me.contactDestroyed, scope: me}
                        }},
                        {xtype: 'emailaddressgrid', partyId: me.partyId, listeners: {
                            contactcreated: {fn: me.contactCreated, scope: me},
                            contactupdated: {fn: me.contactUpdated, scope: me},
                            contactdestroyed: {fn: me.contactDestroyed, scope: me}
                        }},
                        {xtype: 'postaladdressgrid', partyId: me.partyId, listeners: {
                            contactcreated: {fn: me.contactCreated, scope: me},
                            contactupdated: {fn: me.contactUpdated, scope: me},
                            contactdestroyed: {fn: me.contactDestroyed, scope: me}
                        }}
                    ]
                }
            ]
        });

        tabPanels.push(contactsPanel);
        tabPanels.push({xtype: 'shared_notesgrid', partyId: me.partyId});

        me.partyDetailsPanel = Ext.create('widget.panel', {
            itemId: 'partyDetails',
            html: 'Party Details',
            border: false,
            frame: false,
            region: 'center',
            autoScroll: true
        });

        Ext.each(me.partyRelationships, function (partyRelationship) {
            tabPanels.push({
                xtype: 'crmpartygrid',
                title: partyRelationship.title,
                formFields: partyRelationship.formFields || 'none',
                securityRoles: partyRelationship.securityRoles || [],
                allowedPartyType: partyRelationship.allowedPartyType || 'Both',
                applicationContainerId: me.applicationContainerId,
                addBtnDescription: partyRelationship.addBtnDescription || ('Add ' + Ext.String.capitalize(partyRelationship.fromRoleType)),
                searchDescription: 'Search ' + partyRelationship.title,
                toRole: partyRelationship.toRoleType,
                toPartyId: me.partyId,
                relationshipTypeToCreate: partyRelationship.relationshipType,
                partyRole: partyRelationship.fromRoleType,
                canAddParty: partyRelationship.canAddParty || true,
                canEditParty: partyRelationship.canEditParty || true,
                canDeleteParty: partyRelationship.canDeleteParty || true,
                partyRelationships: partyRelationship.partyRelationships || [],
                listeners: {
                    partycreated: function (comp, partyId) {
                        this.store.load();
                    },
                    partyupdated: function (comp, partyId) {
                        this.store.load();
                    }
                }
            });
        });

        Ext.each(me.additionalTabs, function (tab) {

            //
            // Pass party id to each additional tab...
            //
            Ext.apply(tab, {partyId: me.partyId});
            tabPanels.push(tab);
        });

        me.partyDetailsTabPanel = Ext.create('widget.tabpanel', {
            //flex: 1,
            height: 400,
            collapsible: true,
            region: 'south',
            items: tabPanels
        });

        me.items = [me.partyDetailsPanel, me.partyDetailsTabPanel];

        this.callParent(arguments);
    },

    contactCreated: function (comp, contactType, record) {
        var me = this;

        me.fireEvent('contactcreated', me, contactType, record);

        me.loadDetails();
    },

    contactUpdated: function (comp, contactType, record) {
        var me = this;

        me.fireEvent('contactupdated', me, contactType, record);

        me.loadDetails();
    },

    contactDestroyed: function (comp, contactType, record) {
        var me = this;

        me.fireEvent('contactdestroyed', me, contactType, record);

        me.loadDetails();
    },

    loadDetails: function () {
        var me = this,
            partyDetails = me.down('#partyDetails');

        var myMask = new Ext.LoadMask(partyDetails, {msg: "Please wait..."});
        myMask.show();

        // Load html of party
        Ext.Ajax.request({
            url: '/erp_app/organizer/crm/parties/' + me.partyId + '/details',
            disableCaching: false,
            method: 'GET',
            success: function (response) {
                myMask.hide();
                partyDetails.update(response.responseText);
            }
        });
    },

    loadParty: function () {
        var me = this,
            tabPanel = me.down('tabpanel');

        me.loadDetails();

        // Load contact stores
        for (i = 0; i < me.contactWidgetXtypes.length; i += 1) {
            var widget = tabPanel.down(me.contactWidgetXtypes[i]);
            if (!Ext.isEmpty(widget)) {
                widget.store.load();
            }
        }
    }
});