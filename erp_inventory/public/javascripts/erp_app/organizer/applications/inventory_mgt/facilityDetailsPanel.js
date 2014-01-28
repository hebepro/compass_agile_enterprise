Ext.define("Compass.ErpApp.Organizer.Applications.InventoryMgt.FacilityDetailsPanel",{
    extend: "Ext.panel.Panel",
    alias: 'widget.facility_details_panel',
    cls: 'facility_details_panel',
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
     * @cfg {Int} facilityId
     * Id of facility being edited.
     */
    facilityId: null,

    /**
     * @cfg {String} detailsUrl
     * Url to retrieve details.
     */
    detailsUrl: '/erp_inventory/erp_app/organizer/asset_management/facilities/show/',

    /**
     *
     * @param {String} title
     * title of tab
     *
     */
    partyRelationships: [],

    initComponent: function () {
        var me = this,
            tabPanels = [];

        me.addEvents(
            //add custom events here
        );

        me.facilityDetailsPanel = Ext.create('widget.panel', {
            itemId: 'facilityDetails',
            height: 200,
            html: 'Details',
            border: false,
            frame: false,
            region: 'north',
            autoScroll: true
        });

        tabPanels.push({xtype: 'shared_notesgrid', facilityId: me.facilityId});

        me.facilityDetailsTabPanel = Ext.create('widget.tabpanel', {
            flex: 1,
            //height: 400,
            collapsible: true,
            region: 'center',
            items: tabPanels
        });

        me.items = [me.facilityDetailsPanel, me.facilityDetailsTabPanel];

        this.callParent(arguments);
    },

    loadDetails: function () {
        var me = this,
            detailsUrl = me.detailsUrl,
            facilityDetails = me.down('#facilityDetails');

        var myMask = new Ext.LoadMask(facilityDetails, {msg: "Please wait..."});
        myMask.show();

        // Load html of party
        Ext.Ajax.request({
            url: detailsUrl + me.facilityId,
            disableCaching: false,
            method: 'GET',
            success: function (response) {
                myMask.hide();
                facilityDetails.update(response.responseText);
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