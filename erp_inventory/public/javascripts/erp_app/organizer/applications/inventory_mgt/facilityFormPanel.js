Ext.define("Compass.ErpApp.Organizer.Applications.InventoryMgt.FacilityFormPanel",{
    extend: "Ext.panel.Panel",
    alias: 'widget.facility_form_panel',
    cls: 'facility_form_panel',
    layout: 'vbox',
    padding: 5,
    autoScroll: true,

    /**
     * @cfg {Int} facilityId
     * Id of party being edited.
     */
    facilityId: null,

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    initComponent: function () {
        var me = this;

        me.addEvents(
            /*
             * @event facilitycreated
             * Fires when a facility is created
             * @param {Compass.ErpApp.Shared.Crm.PartyFormPanel} this
             * @param {Int} newfacilityId
             */
            'facilitycreated'
        );

        this.items = [
            {
                xtype: 'facility_form',
                width: 300,
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
                            var facilityFormPanel = btn.up('facility_form_panel'),
                                facilityForm = facilityFormPanel.down('facility_form');

                            if (facilityForm.isValid()) {

                                var facilityId = facilityForm.down('#facilityId').getValue(),
                                    facilityAjaxMethod = null;

                                if (Ext.isEmpty(facilityId)) {
                                    facilityAjaxMethod = 'POST';
                                }
                                else {
                                    facilityAjaxMethod = 'PUT';
                                }

                                facilityForm.submit({
                                    params: {

                                    },
                                    clientValidation: true,
                                    url: '/erp_app/organizer/asset_management/facilities/' + facilityId,
                                    method: facilityAjaxMethod,
                                    waitMsg: 'Please Wait...',
                                    success: function (form, action) {
                                        facilityFormPanel.close();
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
                                alert('not valid');
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        flex: 1,
                        text: 'Cancel',
                        handler: function (btn) {
                            btn.up('facility_form_panel').close();
                        }
                    }
                ]
            }
        ];

        this.callParent();

        if (!Ext.isEmpty(me.facilityId)) {
            this.down('facility_form').loadFacility(me.facilityId);
        }

    }

});