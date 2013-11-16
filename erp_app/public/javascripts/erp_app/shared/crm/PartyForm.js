Ext.define("Compass.ErpApp.Shared.Crm.PartyForm", {
    extend: "Ext.form.Panel",
    alias: 'widget.crmpartyform',
    buttonAlign: 'left',
    frame: false,
    border: false,
    width: 400,

    /**
     * @cfg {Int} partyId
     * Id of party being edited.
     */
    partyId: null,
    /**
     * @cfg {String} allowedPartyType
     * Party type that can be created {Both | Individual | Organization}.
     */
    allowedPartyType: 'Both',

    initComponent: function () {
        var me = this,
            items = [],
            partyTypeFieldContainer = null;

        if(me.allowedPartyType !== 'Both' && me.allowedPartyType !== 'Individual' && me.allowedPartyType !== 'Organization'){
            Ext.Msg.alert('Error', 'Invalid Party Type');
            me.allowedPartyType = 'Both';
        }

        if (me.allowedPartyType === 'Both') {
            partyTypeFieldContainer = {
                xtype: 'fieldcontainer',
                padding: 10,
                fieldLabel: false,
                defaultType: 'radiofield',
                defaults: {
                    width: 100,
                    height: 50
                },
                layout: 'hbox',
                items: []
            };

            partyTypeFieldContainer.items.push({
                boxLabel: '<div style="text-align: center;"><img src="/images/erp_app/organizer/applications/crm/person.png"><br/>Individual</div>',
                itemId: 'individualRadio',
                checked: true,
                name: 'business_party_type',
                inputValue: 'Individual',
                listeners: {
                    change: function (comp, newValue) {
                        if (newValue)
                            comp.up('crmpartyform').updateForm('Individual');
                    }
                }
            });

            partyTypeFieldContainer.items.push({
                boxLabel: '<div style="text-align: center;"><img src="/images/erp_app/organizer/applications/crm/business.png"><br/>Business</div>',
                itemId: 'organizationRadio',
                name: 'business_party_type',
                inputValue: 'Organization',
                listeners: {
                    change: function (comp, newValue) {
                        if (newValue)
                            comp.up('crmpartyform').updateForm('Organization');
                    }
                }
            });

            items.push(partyTypeFieldContainer);
        }
        else{
            items.push({
                xtype: 'hidden',
                name: 'business_party_type',
                value: me.allowedPartyType
            });
        }

        this.items = items.concat([
            {
                xtype: 'fieldset',
                title: 'Business Details',
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
                title: 'Individual Details',
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
                        allowBlank: true,
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
        ]);

        this.callParent(arguments);

        if (me.allowedPartyType === 'Organization') {
            organizationDetails = this.down('#organizationDetails');
            organizationDetails.show();
            organizationDetails.down('#organizationDescription').allowBlank = false;

            individualDetails = me.down('#individualDetails');
            individualDetails.down('#firstName').allowBlank = true;
            individualDetails.down('#lastName').allowBlank = true;

            individualDetails.hide();
        }
    },

    updateForm: function (partyType) {
        var me = this,
            organizationDetails = me.down('#organizationDetails'),
            individualDetails = me.down('#individualDetails');

        if (partyType === 'Individual') {
            organizationDetails.hide();
            individualDetails.show();

            individualDetails.down('#firstName').allowBlank = false;
            individualDetails.down('#lastName').allowBlank = false;

            organizationDetails.down('#organizationDescription').allowBlank = true;
        }
        else {
            individualDetails.hide();
            organizationDetails.show();

            individualDetails.down('#firstName').allowBlank = true;
            individualDetails.down('#lastName').allowBlank = true;

            organizationDetails.down('#organizationDescription').allowBlank = false;
        }

        this.fireEvent('partytypechange', this, partyType);
    },

    loadParty: function (partyId) {
        var me = this;

        me.partyId = partyId;

        Ext.Ajax.request({
            method: 'GET',
            url: '/erp_app/organizer/crm/base/parties',
            params: {
                party_id: me.partyId
            },
            success: function (response) {
                responseObj = Ext.JSON.decode(response.responseText);

                if (responseObj.success) {
                    var basicForm = me.getForm();
                    basicForm.setValues(responseObj.data);
                    me.down('#partyId').setValue(me.partyId);
                }
            },
            failure: function (response) {
                Ext.Msg.alert("Error", "Error loading data.");
            }
        });
    }
});