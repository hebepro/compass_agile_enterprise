Ext.define("Compass.ErpApp.Organizer.Applications.Crm.PartyForm", {
    extend: "Ext.panel.Panel",
    alias: 'widget.party_form',
    closable: true,
    items: [
        {
            xtype: 'form',
            buttonAlign: 'left',
            frame: false,
            border: false,
            padding: 20,
            width:400,
            items: [
                {
                    xtype: 'fieldcontainer',
                    padding: 10,
                    fieldLabel: 'Type',
                    defaultType: 'radiofield',
                    defaults: {
                        width: 100
                    },
                    layout: 'hbox',
                    items: [
                        {
                            boxLabel: 'Individual',
                            checked: true,
                            name: 'businessPartyType',
                            inputValue: 'Individual',
                            listeners: {
                                change: function (comp, newValue) {
                                    var form = comp.up('form'),
                                        organizationDetails = form.down('#organizationDetails'),
                                        individualDetails = form.down('#individualDetails');

                                    if (newValue) {
                                        organizationDetails.hide();
                                        individualDetails.show();
                                    }
                                    else {
                                        individualDetails.hide();
                                        organizationDetails.show();
                                    }
                                }
                            }
                        },
                        {
                            boxLabel: 'Business',
                            name: 'businessPartyType',
                            inputValue: 'Business',
                            listeners: {
                                change: function (comp, newValue) {
                                    var form = comp.up('form'),
                                        organizationDetails = form.down('#organizationDetails'),
                                        individualDetails = form.down('#individualDetails');

                                    if (newValue) {
                                        organizationDetails.show();
                                        individualDetails.hide();
                                    }
                                    else {
                                        individualDetails.show();
                                        organizationDetails.hide();
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Details',
                    hidden: true,
                    itemId: 'organizationDetails',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Enterprise Identifier',
                            allowBlank: true,
                            name: 'enterprise_identifier'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Tax ID',
                            allowBlank: true,
                            name: 'tax_id_number'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Description',
                            allowBlank: true,
                            name: 'description'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    itemId: 'individualDetails',
                    title: 'Details',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Enterprise Identifier',
                            allowBlank: true,
                            name: 'enterprise_identifier'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Title',
                            allowBlank: true,
                            name: 'current_personal_title'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'First Name',
                            allowBlank: false,
                            name: 'current_first_name'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Middle Name',
                            allowBlank: true,
                            name: 'current_middle_name'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Last Name',
                            allowBlank: false,
                            name: 'current_last_name'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Suffix',
                            allowBlank: true,
                            name: 'current_suffix'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Nickname',
                            allowBlank: true,
                            name: 'current_nickname'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Passport Number',
                            allowBlank: true,
                            name: 'current_passport_number'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: 'Passport Expiration Date',
                            allowBlank: true,
                            name: 'current_passport_expire_date'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: 'DOB',
                            allowBlank: false,
                            name: 'birth_date'
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Gender',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['v', 'k'],
                                data: [
                                    {"v": "m", "k": "Male"},
                                    {"v": "f", "k": "Female"}
                                ]
                            }),
                            displayField: 'k',
                            valueField: 'v',
                            name: 'gender'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Total Yrs Work Exp',
                            allowBlank: true,
                            name: 'total_years_work_experience'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Marital Status',
                            allowBlank: true,
                            name: 'marital_status'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Social Security Number',
                            allowBlank: true,
                            name: 'social_security_number'
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    handler: function (btn) {
                        var form = btn.up('carrier_form').down('form');

                        if (form.isValid()) {
                            var carrierId = form.down('#carrierId').getValue(),
                                method = null;

                            if (Ext.isEmpty(carrierId)) {
                                method = 'POST';
                            }
                            else {
                                method = 'PUT';
                            }

                            form.submit({
                                params:{
                                    fromRoles: this.initial
                                },
                                clientValidation: true,
                                url: '/erp_app/organizer/fuel_buddy_user_mgmt/users/carriers',
                                method: method,
                                waitMsg: 'Please Wait...',
                                success: function (form, action) {
                                    btn.up('carrier_form').close();
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
                                            Ext.Msg.alert('Failure', action.result.msg);
                                    }
                                }
                            });
                        }
                    }
                },
                {
                    text: 'Cancel',
                    handler: function (btn) {
                        btn.up('party_form').close();
                    }
                }
            ]
        }
    ]
});