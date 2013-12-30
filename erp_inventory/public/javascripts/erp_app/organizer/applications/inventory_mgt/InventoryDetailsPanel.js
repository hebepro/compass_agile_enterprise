Ext.define("Compass.ErpApp.Organizer.Applications.InventoryMgt.InventoryDetailsPanel",{
    extend: "Ext.panel.Panel",
    alias: 'widget.inventory_details_panel',
    cls: 'inventory_details_panel',
    layout: 'border',
    items: [],
    contactWidgetXtypes: [
        'phonenumbergrid'
    ],

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    /**
     * @cfg {Int} inventoryEntryId
     * Id of party being edited.
     */
    inventoryEntryId: null,

    /**
     * @cfg {String} detailsUrl
     * Url to retrieve details for these parties.
     */
    detailsUrl: '/erp_inventory/erp_app/organizer/inventory_mgt/base/show/',

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
     * @example
     * {
            title: 'Employees',
            relationshipType: 'employee_customer',
            toRoleType: 'customer',
            fromRoleType: 'employee',
            allowedPartyType: 'Both',
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

        me.partyDetailsPanel = Ext.create('widget.panel', {
            itemId: 'partyDetails',
            height: 200,
            html: 'Details',
            border: false,
            frame: false,
            region: 'north',
            autoScroll: true
        });

        tabPanels.push({
            xtype: 'inventory_txn_history_grid',
            title: 'Inventory Transaction History',
            inventoryEntryId: me.inventoryEntryId
        });

        tabPanels.push({xtype: 'shared_notesgrid', inventoryEntryId: me.inventoryEntryId});

        me.partyDetailsTabPanel = Ext.create('widget.tabpanel', {
            //flex: 1,
            //height: 400,
            collapsible: true,
            region: 'center',
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
            detailsUrl = me.detailsUrl,
            partyDetails = me.down('#partyDetails');

        var myMask = new Ext.LoadMask(partyDetails, {msg: "Please wait..."});
        myMask.show();

        // Load html of party
        Ext.Ajax.request({
            url: detailsUrl + me.inventoryEntryId,
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