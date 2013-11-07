Ext.define("Compass.ErpApp.Shared.Crm.PartyForm", {
    extend: "Ext.panel.Panel",
    alias: 'widget.party_form',
    closable: true,
    partyId: false,

    initComponent: function () {
        var config = this.initialConfig,
            fromRoles = config.fromRoles || [];

        this.partyId = config.partyId;

        this.items = [
            {
                xtype: 'form',
                buttonAlign: 'left',
                frame: false,
                border: false,
                padding: 20,
                width: 400,
                items: [
                    {
                        xtype: 'fieldcontainer',
                        padding: 10,
                        fieldLabel: false,
                        defaultType: 'radiofield',
                        defaults: {
                            width: 100,
                            height: 50
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: '<div style="text-align: center;"><img src="/images/erp_app/organizer/applications/crm/person.png"><br/>Individual</div>',
                                itemId: 'individualRadio',
                                checked: true,
                                name: 'business_party_type',
                                inputValue: 'Individual',
                                listeners: {
                                    change: function (comp, newValue) {
                                        comp.up('party_form').updateForm(comp, newValue);
                                    }
                                }
                            },
                            {
                                boxLabel: '<div style="text-align: center;"><img src="/images/erp_app/organizer/applications/crm/business.png"><br/>Business</div>',
                                itemId: 'organizationRadio',
                                name: 'business_party_type',
                                inputValue: 'Organization',
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
                                itemId: 'organizationDescription',
                                fieldLabel: 'Description',
                                allowBlank: true,
                                name: 'description'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Tax ID',
                                allowBlank: true,
                                name: 'tax_id_number'
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
                                fieldLabel: 'Title',
                                allowBlank: true,
                                name: 'current_personal_title'
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'firstName',
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
                                itemId: 'lastName',
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
                                itemId: 'dob',
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
                    },
                    {
                        xtype: 'hidden',
                        itemId: 'partyId',
                        name: 'party_id'
                    }
                ],
                buttons: [
                    {
                        text: 'Save',
                        handler: function (btn) {
                            var form = btn.up('form');

                            if (form.isValid()) {
                                var partyId = form.down('#partyId').getValue(),
                                    method = null;

                                if (Ext.isEmpty(partyId)) {
                                    method = 'POST';
                                }
                                else {
                                    method = 'PUT';
                                }

                                form.submit({
                                    params: {
                                        from_roles: fromRoles.join(),
                                        to_role: config.toRole
                                    },
                                    clientValidation: true,
                                    url: '/erp_app/organizer/crm/base/parties',
                                    method: method,
                                    waitMsg: 'Please Wait...',
                                    success: function (form, action) {
                                        btn.up('party_form').close();
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
        ];

        this.callParent(arguments);
    },

    updateForm: function (radio, newValue) {
        var form = radio.up('form'),
            organizationDetails = form.down('#organizationDetails'),
            individualDetails = form.down('#individualDetails');

        if (radio.inputValue == 'Individual' && newValue) {
            organizationDetails.hide();
            individualDetails.show();

            individualDetails.down('#firstName').allowBlank = false;
            individualDetails.down('#lastName').allowBlank = false;
            individualDetails.down('#dob').allowBlank = false;

            organizationDetails.down('#organizationDescription').allowBlank = true;
        }
        else {
            individualDetails.hide();
            organizationDetails.show();

            individualDetails.down('#firstName').allowBlank = true;
            individualDetails.down('#lastName').allowBlank = true;
            individualDetails.down('#dob').allowBlank = true;

            organizationDetails.down('#organizationDescription').allowBlank = false;
        }
    },

    loadParty: function () {
        var me = this;

        Ext.Ajax.request({
            method: 'GET',
            url: '/erp_app/organizer/crm/base/parties',
            params: {
                party_id: this.partyId
            },
            success: function (response) {
                responseObj = Ext.JSON.decode(response.responseText);

                if (responseObj.success) {
                    me.down('form').getForm().setValues(responseObj.data);
                    if(responseObj.data.model == "Organization"){
                        me.down('form').down('#organizationRadio').setValue(true);
                        me.down('form').down('#individualRadio').hide();
                    }
                    else{
                        me.down('form').down('#individualRadio').setValue(true);
                        me.down('form').down('#organizationRadio').hide();
                    }
                    me.down('form').down('#partyId').setValue(me.partyId);
                }
            },
            failure: function (response) {
                Ext.Msg.alert("Error", "Error loading data.");
            }
        });
    }
});