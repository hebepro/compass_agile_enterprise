Ext.define("Compass.ErpApp.Organizer.Applications.Crm.PartyDetailsPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.party_details_panel',
    layout: 'border',
    partyId: null,
    items: [],
    contactWidgetXtypes: [
        'phonenumbergrid',
        'emailaddressgrid',
        'postaladdressgrid',
        'shared_notesgrid',
        'usersgrid'
    ],

    initComponent: function () {
        var config = this.initialConfig,
            me = this;

        me.detailsUrl = config.detailsUrl;
        me.partyId = config.partyId;

        me.partyDetailsPanel = Ext.create('widget.panel', {
            itemId: 'partyDetails',
            html: 'Party Details',
            border: false,
            frame: false,
            region: 'center'
        });

        me.partyDetailsTabPanel = Ext.create('widget.tabpanel', {
            height: 300,
            collapsible: true,
            region: 'south',
            items: [
                {xtype: 'phonenumbergrid', partyId: me.partyId},
                {xtype: 'emailaddressgrid', partyId: me.partyId},
                {xtype: 'postaladdressgrid', partyId: me.partyId},
                {xtype: 'shared_notesgrid', partyId: me.partyId},
                {xtype: 'usersgrid', partyId: me.partyId}
            ]
        });

        me.items = [me.partyDetailsPanel, me.partyDetailsTabPanel];

        this.callParent(arguments);
    },

    loadParty: function () {
        var me = this,
            partyDetails = me.down('#partyDetails'),
            tabPanel = me.down('tabpanel'),
            detailsUrl = me.detailsUrl;

        if(Ext.isEmpty(me.detailUrl)){
            detailsUrl = '/erp_app/organizer/crm/base/get_party_details/'
        }

        // Load html of party
        Ext.Ajax.request({
            url: detailsUrl+ me.partyId,
            disableCaching: false,
            method: 'GET',
            success: function (response) {
                partyDetails.update(response.responseText);
            }
        });

        // Load contact stores
        for (i = 0; i < me.contactWidgetXtypes.length; i += 1) {
            var widget = tabPanel.down(me.contactWidgetXtypes[i]);
            if(!Ext.isEmpty(widget)){
                widget.store.load();
            }
        }
    }
});