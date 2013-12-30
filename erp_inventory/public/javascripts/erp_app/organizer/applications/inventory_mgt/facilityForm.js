Ext.define("Compass.ErpApp.Organizer.Applications.InventoryMgt.FacilityForm",{
    extend: "Ext.form.Panel",
    alias: 'widget.facility_form',
    cls: 'facility_form',
    buttonAlign: 'left',
    frame: false,
    border: false,
    width: 400,

    /**
     * @cfg {Int} facilityId
     * Id of facility being edited.
     */
    facilityId: null,

    initComponent: function () {
        var me = this,
            items = [];

        var fixedAssetStore = Ext.create('Ext.data.Store', {
            fields: [{
                name: "id"
            }, {
                name: "description"
            }],
            proxy: {
                type: 'ajax',
                url: '/erp_app/organizer/asset_management/facilities',
                reader: {
                    type: 'json',
                    root: 'facilities'
                }
            },
            storeId: 'FixedAssetStore',
            autoLoad: true
        });

        me.items = items.concat([
            {
                xtype: 'fieldset',
                title: 'Facility Entry Details',
                hidden: true,
                itemId: 'facilityDetails',
                items: [
                    {
                        xtype: 'textfield',
                        itemId: 'description',
                        fieldLabel: 'Description',
                        allowBlank: true,
                        name: 'description'
                    }
                ]
            },
            {
                xtype: 'hidden',
                itemId: 'facilityId',
                name: 'facility_id'
            }
        ]);
        this.callParent(arguments);
        facilityDetails = this.down('#facilityDetails');
        facilityDetails.show();
    },

    loadFacility: function (facilityId) {
        var me = this;

        me.facilityId = facilityId;

        Ext.Ajax.request({
            method: 'GET',
            url: '/erp_app/organizer/asset_management/facilities/show',
            params: {
                facility_id: me.facilityId
            },
            success: function (response) {
                responseObj = Ext.JSON.decode(response.responseText);

                if (responseObj.success) {
                    var basicForm = me.getForm();
                    basicForm.setValues(responseObj.data);
                    me.down('#facilityId').setValue(me.facilityId);
                }
            },
            failure: function (response) {
                Ext.Msg.alert("Error", "Error loading data.");
            }
        });
    }
});