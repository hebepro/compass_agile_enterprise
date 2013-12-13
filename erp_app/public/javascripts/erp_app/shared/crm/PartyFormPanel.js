Ext.define("Compass.ErpApp.Shared.Crm.PartyFormPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.crmpartyformpanel',
    layout: 'vbox',
    padding: 5,
    autoScroll: true,

    /**
     * @cfg {String} partyRole
     * PartyRole this should creating the party as (Customer, Prospect).
     */
    partyRole: 'customer',

    /**
     * @cfg {string} relationshipTypeToCreate
     * Relationship type to create parties with.
     */
    relationshipTypeToCreate: null,

    /**
     * @cfg {String} toRole
     * To RoleType these parties should be related to.
     */
    toRole: null,

    /**
     * @cfg {Int} toPartyId
     * Id of party to relationship should created to.
     */
    toPartyId: null,

    /**
     * @cfg {Int} partyId
     * Id of party being edited.
     */
    partyId: null,

    /**
     * @cfg {Int} userId
     * Id of user for the party being edited.
     */
    userId: null,

    /**
     * @cfg {String} partyType
     * Type of party (Individual, Organization).
     */
    partyType: null,

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    /**
     * @cfg {String} allowedPartyType
     * Party type that can be created {Both | Individual | Organization}.
     */
    allowedPartyType: 'Both',

    initComponent: function () {
        var me = this;

        me.addEvents(
            /*
             * @event partycreated
             * Fires when a party is created
             * @param {Compass.ErpApp.Shared.Crm.PartyFormPanel} this
             * @param {Int} newPartyId
             */
            'partycreated',
            /*
             * @event partyupdated
             * Fires when a party is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyFormPanel} this
             * @param {Int} updatedPartyId
             */
            'partyupdated',
            /*
             * @event usercreated
             * Fires when a user is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyFormPanel} this
             * @param {Int} createdUserId
             */
            'usercreated',
            /*
             * @event userupdated
             * Fires when a party is updated
             * @param {Compass.ErpApp.Shared.Crm.PartyFormPanel} this
             * @param {Int} updatedUserId
             */
            'userupdated'
        );

        this.items = [
            {
                xtype: 'crmpartyform',
                allowedPartyType: (me.partyType || me.allowedPartyType),
                width: 300,
                listeners: {
                    'partytypechange': function (comp, partyType) {
                        if (partyType == 'Individual') {
                            comp.up('crmpartyformpanel').down('crmuserform').show();
                        }
                        else {
                            comp.up('crmpartyformpanel').down('crmuserform').hide();
                        }
                    }
                }
            },
            {
                width: 300,
                xtype: 'crmuserform',
                allowFormToggle: true,
                applicationContainerId: me.applicationContainerId
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
                            var crmPartyFormPanel = btn.up('crmpartyformpanel'),
                                crmPartyForm = crmPartyFormPanel.down('crmpartyform'),
                                crmUserForm = crmPartyFormPanel.down('crmuserform'),
                                url = '/erp_app/organizer/crm/parties';

                            if (crmPartyForm.isValid()) {
                                if (crmUserForm.isVisible() && crmUserForm.getForm().findField('userEnabled').getValue() && !crmPartyForm.isValid()) {
                                    return false
                                }

                                // submit party form first
                                var partyId = crmPartyForm.down('#partyId').getValue(),
                                    partyAjaxMethod = null;

                                if (Ext.isEmpty(partyId)) {
                                    partyAjaxMethod = 'POST';

                                }
                                else {
                                    partyAjaxMethod = 'PUT';
                                    url = url + '/' + partyId;
                                }

                                crmPartyForm.submit({
                                    params: {
                                        party_role: me.partyRole,
                                        to_role: me.toRole,
                                        to_party_id: me.toPartyId,
                                        relationship_type_to_create: me.relationshipTypeToCreate,
                                        business_party_type: me.partyType
                                    },
                                    clientValidation: true,
                                    url: url,
                                    method: partyAjaxMethod,
                                    waitMsg: 'Please Wait...',
                                    success: function (form, action) {
                                        var partyId = action.result.party_id;

                                        if (partyAjaxMethod == 'POST')
                                            me.fireEvent('partycreated', me, partyId);


                                        if (partyAjaxMethod == 'PUT')
                                            me.fireEvent('partyupdated', me, partyId);

                                        // Check if the user form is visible if so submit that too now
                                        if (action.result.success && crmUserForm.isVisible() && crmUserForm.getForm().findField('userEnabled').getValue()) {
                                            var userId = crmUserForm.down('#userId').getValue(),
                                                url = '/erp_app/organizer/crm/users',
                                                userAjaxMethod = null;

                                            if (Ext.isEmpty(userId)) {
                                                userAjaxMethod = 'POST';
                                            }
                                            else {
                                                userAjaxMethod = 'PUT';
                                                url = url + '/' + userId;
                                            }

                                            crmUserForm.submit({
                                                clientValidation: true,
                                                url: url,
                                                method: userAjaxMethod,
                                                waitMsg: 'Please Wait...',
                                                params: {
                                                    party_id: partyId
                                                },
                                                success: function (form, action) {
                                                    if (action.result.success) {
                                                        if (userAjaxMethod == 'POST')
                                                            me.fireEvent('usercreated', me, partyId);

                                                        if (userAjaxMethod == 'PUT')
                                                            me.fireEvent('userupdated', me, action.result.users.id);

                                                        crmPartyFormPanel.close();
                                                    }
                                                },
                                                failure: function (form, action) {
                                                    if (partyAjaxMethod == 'POST') {
                                                        Ext.Ajax.request({
                                                            method: 'DELETE',
                                                            url: '/erp_app/organizer/crm/parties/' + partyId,
                                                            success: function (response) {
                                                            },
                                                            failure: function (response) {
                                                                myMask.hide();
                                                                Ext.Msg.alert("Error", "Error with request.");
                                                            }
                                                        });
                                                    }

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
                                            crmPartyFormPanel.close();
                                        }
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
                        xtype: 'button',
                        flex: 1,
                        text: 'Cancel',
                        handler: function (btn) {
                            btn.up('crmpartyformpanel').close();
                        }
                    }
                ]
            }
        ];

        this.callParent();

        if (!Ext.isEmpty(me.partyId)) {
            this.down('crmpartyform').loadParty(me.partyId);
        }

        if (!Ext.isEmpty(me.partyType) && me.partyType == 'Individual') {
            this.down('crmuserform').loadUser(me.partyId, me.userId);
        }

        if (me.allowedPartyType == 'Organization' || (!Ext.isEmpty(me.partyType) && me.partyType == 'Organization')) {
            this.down('crmuserform').hide();
        }
    }

});