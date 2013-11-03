Ext.define('Compass.ErpApp.Organizer.Applications.Crm.User', {
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

Ext.define("Compass.ErpApp.Organizer.Applications.Crm.UsersGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.usersgrid',

    constructor: function (config) {
        var me = this;

        this.editing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1
        });

        var toolBarItems = [
            {
                text: 'Add',
                xtype: 'button',
                iconCls: 'icon-add',
                handler: function (button) {
                    var grid = button.findParentByType('usersgrid');
                    var edit = grid.editing;

                    grid.store.insert(0, new Compass.ErpApp.Organizer.Applications.Crm.User());
                    edit.startEdit(0, 0);
                }
            },
            '-',
            {
                text: 'Delete',
                type: 'button',
                iconCls: 'icon-delete',
                handler: function (button) {
                    var grid = button.findParentByType('usersgrid');
                    var selection = grid.getView().getSelectionModel().getSelection()[0];
                    if (selection) {
                        Ext.MessageBox.confirm(
                            'Confirm', 'Are you sure?',
                            function (btn) {
                                if (btn == 'yes') {
                                    grid.store.remove(selection);
                                }
                            }
                        );
                    }
                }
            },
            '-',
            {
                text: 'Reset Password',
                type: 'button',
                iconCls: 'icon-edit',
                handler: function (button) {
                    var grid = button.findParentByType('usersgrid');
                    var selection = grid.getView().getSelectionModel().getSelection()[0];
                    if (selection) {
                        me.setLoading(true);

                        Ext.MessageBox.confirm(
                            'Confirm', 'Reset Password?',
                            function (btn) {
                                Ext.Ajax.request({
                                    method: 'POST',
                                    url: '/users/reset_password',
                                    params: {
                                        login: selection.get('username')
                                    },
                                    success: function (response) {
                                        me.setLoading(false);

                                        responseObj = Ext.JSON.decode(response.responseText);

                                        if (responseObj.success) {
                                            Ext.Msg.alert("Success", "Password has been reset");
                                        }
                                        else{
                                            Ext.Msg.alert("Error", responseObj.message);
                                        }
                                    },
                                    failure: function (response) {
                                        me.setLoading(false);

                                        Ext.Msg.alert("Error", "Error loading data.");
                                    }
                                });
                            }
                        );
                    }
                }
            }
        ];

        this.store = Ext.create('Ext.data.Store', {
            model: Compass.ErpApp.Organizer.Applications.Crm.User,
            autoLoad: false,
            autoSync: true,
            proxy: {
                type: 'rest',
                url: '/erp_app/organizer/crm/users/index',
                extraParams: { party_id: config.partyId},
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    idProperty: 'id',
                    root: 'users',
                    totalProperty: 'total',
                    messageProperty: 'message'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true,
                    root: 'data'
                },
                listeners: {
                    exception: function (proxy, response, operation) {
                        if (response.responseText) {
                            var responseObj = Ext.JSON.decode(response.responseText);

                            if (responseObj.success) {

                            }
                            else {
                                Ext.MessageBox.show({
                                    title: 'REMOTE EXCEPTION',
                                    msg: responseObj.message,
                                    icon: Ext.MessageBox.ERROR,
                                    buttons: Ext.Msg.OK
                                });
                            }
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'REMOTE EXCEPTION',
                                msg: 'An error has occurred',
                                icon: Ext.MessageBox.ERROR,
                                buttons: Ext.Msg.OK
                            });
                        }
                        me.setLoading(false);
                    }
                }
            },
            listeners: {
                'beforesync': function () {
                    me.setLoading(true);
                },
                'datachanged': function () {
                    me.setLoading(false);
                }
            }
        });

        config = Ext.apply({
            title: 'Users',
            store: this.store,
            plugins: [this.editing],
            columns: [
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
            ],
            dockedItems: [
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
            ],
            frame: false,
            autoScroll: true,
            loadMask: true
        }, config);

        this.callParent([config]);
    }
});


