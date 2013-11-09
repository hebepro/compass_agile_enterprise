Ext.define('Compass.ErpApp.Shared.Crm.User', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'username',
        'email',
        {name: 'status', mapping: 'activation_state'},
        {name: 'lastLoginAt', mapping: 'last_login_at', type: 'date'},
        {name: 'createdAt', mapping: 'created_at', type: 'date'},
        {name: 'updatedAt', mapping: 'updated_at', type: 'date'}
    ],
    validations: [
        {
            type: 'presence',
            field: 'username'
        },
        {
            type: 'presence',
            field: 'email'
        },
        {
            type: 'email',
            field: 'email'
        }
    ]
});

Ext.define("Compass.ErpApp.Shared.Crm.UsersGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.crmusersgrid',
    frame: false,
    autoScroll: true,
    loadMask: true,
    title: 'Users',

    /**
     * @cfg {String[]} fromRoles
     * Array of PartyRoles to load for Grid Example (Customer, Prospect).
     */
    partyRoles: ['customer'],

    /**
     * @cfg {String} toRole
     * Relationship with this toRole of the current user should be mimic on these parties.
     */
    toRole: null,

    /**
     * @cfg {String} applicationContainerId
     * The id of the root application container that this panel resides in.
     */
    applicationContainerId: 'crmTaskTabPanel',

    initComponent: function () {
        var me = this;

        var toolBarItems = [
            {
                text: 'Add',
                xtype: 'button',
                iconCls: 'icon-add',
                handler: function (button) {
                    // open tab with create user form.
                    var tabPanel = button.up('crmpartydetailspanel').up('tabpanel');

                    // check and see if tab already open
                    var tab = tabPanel.down('crmpartyformpanel');
                    if (tab) {
                        tabPanel.setActiveTab(tab);
                        return;
                    }

                    var crmPartyFormPanel = Ext.create("widget.crmpartyformpanel", {
                        title: 'Add User',
                        partyRoles: me.partyRoles,
                        allowedPartyType: 'Individual',
                        toRole: me.toRole,
                        closable: true
                    });

                    tabPanel.add(crmPartyFormPanel);
                    tabPanel.setActiveTab(crmPartyFormPanel);
                }
            }
        ];

        this.store = Ext.create('Ext.data.Store', {
            model: Compass.ErpApp.Shared.Crm.User,
            autoLoad: false,
            autoSync: true,
            proxy: {
                type: 'ajax',
                url: '/erp_app/organizer/crm/users/index',
                extraParams: { party_id: me.partyId},
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    idProperty: 'id',
                    root: 'users',
                    totalProperty: 'total',
                    messageProperty: 'message'
                }
            }
        });

        this.columns = [
            {
                header: 'Username',
                dataIndex: 'username',
                width: 200,
                allowBlank: false,
                editor: {
                    xtype: 'textfield'
                }
            },
            {
                header: 'Email',
                dataIndex: 'email',
                width: 200,
                allowBlank: false,
                editor: {
                    xtype: 'textfield'
                }
            },
            {
                header: 'Status',
                dataIndex: 'status',
                allowBlank: false,
                renderer: 'capitalize'
            },
            {
                header: 'Last Login',
                width: 200,
                dataIndex: 'lastLoginAt',
                renderer: Ext.util.Format.dateRenderer('m/d/Y')
            },
            {
                header: 'Created At',
                width: 200,
                dataIndex: 'createdAt',
                renderer: Ext.util.Format.dateRenderer('m/d/Y')
            },
            {
                header: 'Updated At',
                width: 200,
                dataIndex: 'updatedAt',
                renderer: Ext.util.Format.dateRenderer('m/d/Y')
            }
        ];

        this.dockedItems = [
            {
                xtype: 'toolbar',
                docked: 'top',
                items: toolBarItems
            },
            {
                xtype: 'pagingtoolbar',
                store: this.store,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        this.callParent(arguments);
    }
});


