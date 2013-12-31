Ext.define("Compass.ErpApp.Organizer.Applications.InventoryMgt.InventoryEntryForm",{
    extend: "Ext.form.Panel",
    alias: 'widget.inventory_entry_form',
    cls: 'inventory_entry_form',
    buttonAlign: 'left',
    frame: false,
    border: false,
    width: 400,

    /**
     * @cfg {Int} inventoryEntryId
     * Id of inventory entry being edited.
     */
    inventoryEntryId: null,

    initComponent: function () {
        var me = this,
            items = [];

        var facilityStore = Ext.create('Ext.data.Store', {
            fields: [{
            name: "id"
            }, {
            name: "description"
            }],
            proxy: {
                type: 'ajax',
                url: '/erp_inventory/erp_app/organizer/asset_management/facilities',
                reader: {
                    type: 'json',
                    root: 'facilities'
                }
            },
            storeId: 'FacilityStore',
            autoLoad: true
        });

        me.items = items.concat([
            {
                xtype: 'fieldset',
                title: 'Inventory Entry Details',
                hidden: true,
                itemId: 'inventoryEntryDetails',
                items: [
                    {
                        xtype: 'textfield',
                        itemId: 'description',
                        fieldLabel: 'Description',
                        allowBlank: true,
                        name: 'description'
                    },
                    {
                        xtype: 'combobox',
                        itemId: 'inventory_facility',
                        fieldLabel: 'Current Location',

                        displayField: 'description',
                        valueField: 'id',
                        store: facilityStore,
                        name: 'inventory_facility'
//                        listeners:{
//                            scope: me,
//                            'select': function(field, e){
//                                me.setInventoryLocation( field.getValue());
//                            }
//                        }
                    },
                    {
                        xtype: 'numberfield',
                        itemId: 'number_available',
                        fieldLabel: 'Number Available',
                        allowBlank: true,
                        name: 'number_available'
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'sku',
                        fieldLabel: 'SKU',
                        allowBlank: true,
                        name: 'sku'
                    }
                ]
            },
            {
                xtype: 'hidden',
                itemId: 'inventoryEntryId',
                name: 'inventory_entry_id'
            }
        ]);
        this.callParent(arguments);
        inventoryEntryDetails = this.down('#inventoryEntryDetails');
        inventoryEntryDetails.show();
    },

    updateForm: function (partyType) {
        var me = this;
        inventoryEntryDetails = me.down('#inventoryEntryDetails');
    },

    loadInventoryEntry: function (inventoryEntryId) {
        var me = this;

        me.inventoryEntryId = inventoryEntryId;

        Ext.Ajax.request({
            method: 'GET',
            url: '/erp_inventory/erp_app/organizer/inventory_mgt/inventory_entries/show',
            params: {
                inventory_entry_id: me.inventoryEntryId
            },
            success: function (response) {
                responseObj = Ext.JSON.decode(response.responseText);

                if (responseObj.success) {
                    var basicForm = me.getForm();
                    basicForm.setValues(responseObj.data);
                    me.down('#inventoryEntryId').setValue(me.inventoryEntryId);
                    me.down('#inventory_facility').setValue(responseObj.data.inventory_storage_facility_id);
                }
            },
            failure: function (response) {
                Ext.Msg.alert("Error", "Error loading data.");
            }
        });
    },
    setInventoryLocation: function ( facilityId ) {

        var me = this;

        Ext.Ajax.request({
            method: 'POST',
            url: '/erp_inventory/erp_app/organizer/inventory_mgt/inventory_entry_locations',
            params: {
                facility_id: facilityId,
                inventory_entry_id: me.inventoryEntryId
            },
            success: function (response) {
                responseObj = Ext.JSON.decode(response.responseText);

                if (responseObj.success) {
                    //var basicForm = me.getForm();
                    //Ext.Msg.alert("Success", "Inventory Entry Updated")
                }
            },
            failure: function (response) {
                Ext.Msg.alert("Error", "Error loading data.");
            }
        });
    }
});