Ext.define("Compass.ErpApp.Organizer.Applications.InventoryMgt.InventoryEntryFormPanel",{
    extend: "Ext.panel.Panel",
    alias: 'widget.inventory_entry_form_panel',
    cls: 'inventory_entry_form_panel',
    layout: 'vbox',
    padding: 5,
    autoScroll: true,

    /**
     * @cfg {Int} inventoryEntryId
     * Id of party being edited.
     */
    inventoryEntryId: null,

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    initComponent: function () {
        var me = this;

        me.addEvents(
            /*
             * @event partycreated
             * Fires when a party is created
             * @param {Compass.ErpApp.Shared.Crm.PartyFormPanel} this
             * @param {Int} newinventoryEntryId
             */
            'partycreated'
        );

        this.items = [
            {
                xtype: 'inventory_entry_form',
                width: 350,
                listeners: {

                }
            },
            {
                xtype: 'container',
                width: 300,
                layout: 'hbox',
                items: [
                    {
                        xtype: 'button',
                        flex: 1,
                        text: 'Save',
                        handler: function (btn) {
                            //get the panel and the form
                            var inventoryEntryFormPanel = btn.up('inventory_entry_form_panel'),
                                inventoryEntryForm = inventoryEntryFormPanel.down('inventory_entry_form');

                            if (inventoryEntryForm.isValid()) {

                                var inventoryEntryId = inventoryEntryForm.down('#inventoryEntryId').getValue(),
                                    inventoryEntryAjaxMethod = null;

                                if (Ext.isEmpty(inventoryEntryId)) {
                                    inventoryEntryAjaxMethod = 'POST';
                                }
                                else {
                                    inventoryEntryAjaxMethod = 'PUT';
                                }

                                inventoryEntryForm.submit({
                                    params: {

                                    },
                                    clientValidation: true,
                                    url: '/erp_inventory/erp_app/organizer/inventory_mgt/inventory_entries/' + inventoryEntryId,
                                    method: inventoryEntryAjaxMethod,
                                    waitMsg: 'Please Wait...',
                                    success: function (form, action) {
                                        inventoryEntryFormPanel.close();
                                    },
                                    failure: function (form, action) {
                                        switch (action.failureType) {
                                            case Ext.form.action.Action.CLIENT_INVALID:
                                                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                                                break;
                                            case Ext.form.action.Action.CONNECT_FAILURE:
                                                Ext.Msg.alert('Failure', 'Ajax communication failed');
                                                break;
                                            case Ext.form.action.Action.SERVER_INVALID:
                                                Ext.Msg.alert('Failure', action.result.message);
                                        }
                                    }
                                });
                            }
                            else {
                                Ext.Msg.alert('Invalid Data', 'Please correct highlighted fields.');
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        flex: 1,
                        text: 'Cancel',
                        handler: function (btn) {
                            btn.up('inventory_entry_form_panel').close();
                        }
                    }
                ]
            }
        ];

        this.callParent();

        if (!Ext.isEmpty(me.inventoryEntryId)) {
            this.down('inventory_entry_form').loadInventoryEntry(me.inventoryEntryId);
        }

    }

});