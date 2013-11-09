Ext.define("Compass.ErpApp.Shared.Crm.PartyDetailsPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.crmpartydetailspanel',
    layout: 'border',
    items: [],
    contactWidgetXtypes: [
        'phonenumbergrid',
        'emailaddressgrid',
        'postaladdressgrid',
        'shared_notesgrid',
        'crmusersgrid'
    ],

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    /**
     * @cfg {Int} partyId
     * Id of party being edited.
     */
    partyId: null,

    /**
     * @cfg {String} detailsUrl
     * Url to retrieve details for these parties.
     */
    detailsUrl: '/erp_app/organizer/crm/base/get_party_details/',

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
     * @example
     * {
            title: 'Employees',
            relationshipType: 'employee_customer',
            toRoleType: 'customer',
            fromRoleType: 'employee'
        }
     */
    partyRelationships: [],

    initComponent: function () {
        var me = this,
            tabPanels = [
                {xtype: 'phonenumbergrid', partyId: me.partyId},
                {xtype: 'emailaddressgrid', partyId: me.partyId},
                {xtype: 'postaladdressgrid', partyId: me.partyId},
                {xtype: 'shared_notesgrid', partyId: me.partyId}
            ];

        me.partyDetailsPanel = Ext.create('widget.panel', {
            flex: 1,
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
                applicationContainerId: me.applicationContainerId,
                addBtnDescription: 'Add ' + Ext.String.capitalize(partyRelationship.fromRoleType),
                searchDescription: 'Search ' + partyRelationship.title,
                toRole: partyRelationship.toRoleType,
                toPartyId: me.partyId,
                relationshipTypeToCreate: partyRelationship.relationshipType,
                partyRole: partyRelationship.fromRoleType,
                canAddParty: partyRelationship.canAddParty || true,
                canEditParty: partyRelationship.canEditParty || true,
                canDeleteParty: partyRelationship.canDeleteParty || true,
                listeners:{
                    partycreated: function(comp, partyId){
                        this.store.load();
                    },
                    partyupdated: function(comp, partyId){
                        this.store.load();
                    }
                }
            });
        });

        me.partyDetailsTabPanel = Ext.create('widget.tabpanel', {
            height: 300,
            collapsible: true,
            region: 'south',
            items: tabPanels
        });

        me.items = [me.partyDetailsPanel, me.partyDetailsTabPanel];

        this.callParent(arguments);
    },

    loadParty: function () {
        var me = this,
            partyDetails = me.down('#partyDetails'),
            tabPanel = me.down('tabpanel'),
            detailsUrl = me.detailsUrl;

        if (Ext.isEmpty(me.detailUrl)) {
            detailsUrl = '/erp_app/organizer/crm/base/get_party_details/'
        }

        // Load html of party
        Ext.Ajax.request({
            url: detailsUrl + me.partyId,
            disableCaching: false,
            method: 'GET',
            success: function (response) {
                partyDetails.update(response.responseText);
            }
        });

        // Load contact stores
        for (i = 0; i < me.contactWidgetXtypes.length; i += 1) {
            var widget = tabPanel.down(me.contactWidgetXtypes[i]);
            if (!Ext.isEmpty(widget)) {
                widget.store.load();
            }
        }
    }
});