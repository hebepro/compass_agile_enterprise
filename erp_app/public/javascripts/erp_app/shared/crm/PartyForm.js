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
     * @cfg {String} partyType
     * Type of party (Individual, Organization).
     */
    partyType: null,

    /**
     * @cfg {String} allowedPartyType
     * Party type that can be created {Both | Individual | Organization}.
     */
    allowedPartyType: 'Both',

    /**
     * @cfg {String | Array} formFields
     * Optional Fields to show in edit and create forms, if set to 'All' all fields will be shown.
     * if set to 'None' no fields are shown.
     * If an array is passed only field names within array are shown
     * field names are:
     * - organizationTaxId
     * - individualTitle
     * - individualMiddleName
     * - individualSuffix
     * - individualNickname
     * - individualPassportNumber
     * - individualPassportExpirationDate
     * - individualDateOfBirth
     * - individualTotalYrsWorkExp
     * - individualMaritalStatus
     * - individualSocialSecurityNumber
     */
    formFields: 'None',

    initComponent: function () {
        var me = this,
            items = [],
            partyTypeFieldContainer = null;

        var partyType = (me.partyType || me.allowedPartyType);

        if(partyType !== 'Both' && partyType !== 'Individual' && partyType !== 'Organization'){
            Ext.Msg.alert('Error', 'Invalid Party Type');
            partyType = 'Both';
        }

        if (partyType === 'Both') {
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
                value: partyType
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
                        itemId: 'organizationTaxId',
                        fieldLabel: 'Tax ID',
                        allowBlank: true,
                        hidden: me.hideField('organizationTaxId'),
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
                        itemId: 'individualTitle',
                        fieldLabel: 'Title',
                        allowBlank: true,
                        hidden: me.hideField('individualTitle'),
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
                        hidden: me.hideField('individualMiddleName'),
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
                        hidden: me.hideField('individualSuffix'),
                        name: 'current_suffix'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Nickname',
                        allowBlank: true,
                        hidden: me.hideField('individualNickname'),
                        name: 'current_nickname'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Passport Number',
                        allowBlank: true,
                        hidden: me.hideField('individualPassportNumber'),
                        name: 'current_passport_number'
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: 'Passport Expiration Date',
                        allowBlank: true,
                        hidden: me.hideField('individualPassportExpirationDate'),
                        name: 'current_passport_expire_date'
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: 'DOB',
                        itemId: 'dob',
                        allowBlank: true,
                        hidden: me.hideField('individualDateOfBirth'),
                        name: 'birth_date'
                    },
                    {
                        xtype: 'radiogroup',
                        allowBlank: false,
                        itemId: 'statusContainer',
                        fieldLabel: 'Gender',
                        defaultType: 'radiofield',
                        columns: [100, 100],
                        items: [
                            {
                                boxLabel: 'Male',
                                name: 'gender',
                                inputValue: 'm',
                                checked: true
                            },
                            {
                                boxLabel: 'Female',
                                name: 'gender',
                                inputValue: 'f'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Total Yrs Work Exp',
                        allowBlank: true,
                        hidden: me.hideField('individualTotalYrsWorkExp'),
                        name: 'total_years_work_experience'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Marital Status',
                        allowBlank: true,
                        hidden: me.hideField('individualMaritalStatus'),
                        name: 'marital_status'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Social Security Number',
                        allowBlank: true,
                        hidden: me.hideField('individualSocialSecurityNumber'),
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

        if (partyType === 'Organization') {

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
            url: '/erp_app/organizer/crm/parties/' + me.partyId,
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
    },

    hideField: function(fieldName){
        return (this.formFields == 'None' || (this.formFields !== 'All' && !Ext.Array.contains(fieldName)))
    }
});