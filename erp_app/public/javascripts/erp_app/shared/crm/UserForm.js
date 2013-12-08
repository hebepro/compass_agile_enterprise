Ext.define('Compass.ErpApp.Shared.Crm.UserForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.crmuserform',
    border: false,
    frame: false,

    /**
     * @cfg {Boolean} allowFormToggle
     * True to toggle user form.
     */
    addPartyBtn: '/images/erp_app/organizer/applications/crm/customer_360_64x64.png',

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'fieldset',
                checkboxToggle: me.allowFormToggle,
                checkboxName: 'userEnabled',
                title: 'User Information',
                flex: 1,
                defaultType: 'textfield',
                style: 'padding: 10px',
                items: [
                    {
                        fieldLabel: 'Username',
                        name: 'username',
                        itemId: 'username',
                        allowBlank: false
                    },
                    {
                        fieldLabel: 'Email',
                        name: 'email',
                        vtype: 'email',
                        allowBlank: false
                    },
                    {
                        fieldLabel: 'Password',
                        inputType: 'password',
                        name: 'password'
                    },
                    {
                        fieldLabel: 'Confirm Password',
                        inputType: 'password',
                        name: 'password_confirmation'
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'lastLoginAt',
                        hidden: true,
                        fieldLabel: 'Last Login At',
                        name: 'last_login_at'
                    },
                    {
                        xtype: 'radiogroup',
                        hidden: true,
                        allowBlank: false,
                        itemId: 'statusContainer',
                        fieldLabel: 'Status',
                        defaultType: 'radiofield',
                        columns: [100, 100, 100],
                        items: [
                            {
                                boxLabel: 'Active',
                                name: 'activation_state',
                                inputValue: 'active',
                                checked: true
                            },
                            {
                                boxLabel: 'Pending',
                                name: 'activation_state',
                                inputValue: 'pending'
                            },
                            {
                                boxLabel: 'Inactive',
                                name: 'activation_state',
                                inputValue: 'inactive'
                            }
                        ]
                    },
                    {
                        xtype: 'hidden',
                        itemId: 'userId',
                        name: 'id'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    },

    loadUser: function (partyId, userId) {
        var me = this;

        me.partyId = partyId;
        me.userId = userId;

        // Load user details
        Ext.Ajax.request({
            url: '/erp_app/organizer/crm/users/' + userId,
            method: 'GET',
            params: {
                party_id: me.partyId
            },
            success: function (response) {
                var responseObj = Ext.JSON.decode(response.responseText);

                if (responseObj.success) {
                    if (!Ext.isEmpty(responseObj.user)) {
                        var statusRadio = me.down('#statusContainer');

                        me.getForm().setValues(responseObj.user);
                        me.down('#lastLoginAt').show();
                        statusRadio.show();
                        if (Ext.isEmpty(responseObj.user.activation_state)) {
                            statusRadio.setValue({'activation_state': 'pending'});
                        }
                        else {
                            statusRadio.setValue({'activation_state': responseObj.user.activation_state});
                        }
                    }
                    else {
                        me.getForm().findField('userEnabled').setValue(false);
                    }
                }
                else {
                    Ext.Msg.alert('Error', 'Could not load user details');
                }
            },
            failure: function (response) {
                myMask.hide();
                Ext.Msg.alert('Error', 'Could not load user details');
            }
        });
    }
});
