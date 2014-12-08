Ext.define("Compass.ErpApp.Desktop.Applications.UserManagement", {
    extend: "Ext.ux.desktop.Module",
    id: 'user-management-win',
    init: function () {
        this.launcher = {
            text: 'User Management',
            iconCls: 'icon-user-mgt',
            handler: this.createWindow,
            scope: this
        };
    },
    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('user_management');
        if (!win) {
            var tabPanel = new Ext.TabPanel({
                region: 'center'
            });
            win = desktop.createWindow({
                id: 'user_management',
                title: 'User Management',
                width: 1150,
                height: 550,
                iconCls: 'icon-user-mgt-light',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                layout: 'border',
                items: [
                    {
                        xtype: 'usermanagement_usersgrid',
                        tabPanel: tabPanel
                    },
                    tabPanel
                ]
            });
        }
        win.show();
    }
});

Ext.define("Compass.ErpApp.Desktop.Applications.UserManagement.UsersGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.usermanagement_usersgrid',
    setWindowStatus: function (status) {
        this.findParentByType('statuswindow').setStatus(status);
    },

    clearWindowStatus: function () {
        this.findParentByType('statuswindow').clearStatus();
    },

    deleteUser: function (rec) {
        var me = this;
        me.setWindowStatus('Deleting user...');
        Ext.Ajax.request({
            url: '/erp_app/desktop/user_management/users/delete/' + rec.get("id"),
            method: 'POST',
            success: function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    me.clearWindowStatus();
                    me.getStore().load();
                }
                else {
                    me.clearWindowStatus();
                    Ext.Msg.alert('Error', obj.message);
                }
            },
            failure: function (response) {
                me.clearWindowStatus();
                Ext.Msg.alert('Error', 'Error deleting user.');
            }
        });
    },

    resetPassword: function (rec) {
        var me = this;
        me.setWindowStatus('Resetting password...');
        Ext.Ajax.request({
            url: '/users/reset_password/',
            params: {
                login: rec.get('email')
            },
            method: 'POST',
            success: function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    me.clearWindowStatus();
                    Ext.Msg.alert('Notice', obj.message);
                }
                else {
                    me.clearWindowStatus();
                    Ext.Msg.alert('Error', obj.message);
                }
            },
            failure: function (response) {
                me.clearWindowStatus();
                Ext.Msg.alert('Error', 'Error resetting password.');
            }
        });
    },

    viewUser: function (rec) {
        this.setWindowStatus('Loading User...');
        var userId = rec.get('id');
        var me = this;
        Ext.Ajax.request({
            url: '/erp_app/desktop/user_management/users/get_details/' + userId,
            params: {},
            success: function (responseObject) {
                var response = Ext.decode(responseObject.responseText);
                me.tabPanel.removeAll();

                me.initialConfig.tabPanel.add(
                    {
                        xtype: 'usermanagement_personalinfopanel',
                        businessParty: response.businessParty,
                        userInfo: response.userInfo,
                        entityType: response.entityType
                    });

                me.initialConfig.tabPanel.add(
                    {
                        xtype: 'controlpanel_userapplicationmgtpanel',
                        userId: userId,
                        title: 'Desktop Applications',
                        appContainerType: 'Desktop'
                    });
                me.initialConfig.tabPanel.add(
                    {
                        xtype: 'controlpanel_userapplicationmgtpanel',
                        userId: userId,
                        appContainerType: 'Organizer',
                        title: 'Organizer Applications'
                    });
                me.initialConfig.tabPanel.add(
                    {
                        xtype: 'controlpanel_userapplicationmgtpanel',
                        userId: userId,
                        appContainerType: 'Mobile',
                        title: 'Mobile Applications'
                    });

                me.initialConfig.tabPanel.add(
                    {
                        xtype: 'shared_notesgrid',
                        recordId: rec.get('party_id'),
                        recordType: 'Party',
                        title: 'Notes'
                    });

                me.initialConfig.tabPanel.setActiveTab(0);
                me.clearWindowStatus('Loading User...');
            },
            failure: function () {
                me.clearWindowStatus('Loading User...');
                Ext.Msg.alert('Status', 'Error loading User');
            }
        });
    },

    initComponent: function () {
        this.store.load();
        this.callSuper();
    },

    constructor: function (config) {
        var me = this;

        var usersStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: '/erp_app/desktop/user_management/users/',
                reader: {
                    idProperty: 'id',
                    totalProperty: 'totalCount',
                    type: 'json',
                    root: 'data'
                }
            },
            remoteSort: true,
            fields: [
                {
                    name: 'id',
                    type: 'int'
                },
                {
                    name: 'party_id',
                    type: 'int'
                },
                {
                    name: 'username',
                    type: 'string'
                },
                {
                    name: 'email',
                    type: 'string'
                }
            ]
        });

        var columns = [
            {
                header: 'Username',
                dataIndex: 'username',
                width: 150
            },
            {
                header: 'Email',
                dataIndex: 'email',
                width: 150
            },
            {
                menuDisabled: true,
                resizable: false,
                xtype: 'actioncolumn',
                align: 'center',
                width: 50,
                items: [
                    {
                        icon: '/images/icons/person/person_16x16.png',
                        tooltip: 'View',
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            me.viewUser(rec);
                        }
                    }
                ]
            }
        ];

        if (currentUser.hasRole('admin')) {
            columns.push({
                menuDisabled: true,
                resizable: false,
                xtype: 'actioncolumn',
                align: 'center',
                width: 50,
                items: [
                    {
                        icon: '/images/icons/secure/secure_16x16.png',
                        tooltip: 'Reset Password',
                        handler: function (grid, rowIndex, colIndex) {
                            Ext.MessageBox.confirm('Confirm', "Are you sure you want to reset this users's password?", function (btn) {
                                if (btn == 'no') {
                                    return false;
                                }
                                else if (btn == 'yes') {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.resetPassword(rec);
                                }
                            });
                        }
                    }
                ]
            });
        }

        if (currentUser.hasCapability('delete', 'User')) {
            columns.push({
                menuDisabled: true,
                resizable: false,
                xtype: 'actioncolumn',
                align: 'center',
                width: 50,
                items: [
                    {
                        icon: '/images/icons/delete/delete_16x16.png',
                        tooltip: 'Delete',
                        handler: function (grid, rowIndex, colIndex) {
                            Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this user?', function (btn) {
                                if (btn == 'no') {
                                    return false;
                                }
                                else if (btn == 'yes') {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.deleteUser(rec);
                                }
                            });
                        }
                    }
                ]
            });
        }

        var toolBarItems = [];
        if (currentUser.hasCapability('create', 'User')) {
            toolBarItems.push({
                text: 'Add User',
                iconCls: 'icon-add-light',
                handler: function () {
                    var addUserWindow = Ext.create("Ext.window.Window", {
                        width: 325,
                        layout: 'fit',
                        title: 'New User',
                        plain: true,
                        buttonAlign: 'center',
                        items: {
                            xtype: 'form',
                            frame: false,
                            bodyStyle: 'padding:5px 5px 0',
                            url: '/erp_app/desktop/user_management/users/new',
                            defaults: {
                                width: 225,
                                labelWidth: 100
                            },
                            items: [
                                {
                                    emptyText: 'Select Gender...',
                                    xtype: 'combo',
                                    forceSelection: true,
                                    store: [
                                        ['m', 'Male'],
                                        ['f', 'Female']
                                    ],
                                    fieldLabel: 'Gender',
                                    name: 'gender',
                                    allowBlank: false,
                                    triggerAction: 'all'

                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'First Name',
                                    allowBlank: false,
                                    name: 'first_name'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Last Name',
                                    allowBlank: false,
                                    name: 'last_name'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Email',
                                    allowBlank: false,
                                    name: 'email'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Username',
                                    allowBlank: false,
                                    name: 'username'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Password',
                                    inputType: 'password',
                                    allowBlank: false,
                                    name: 'password'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Confirm Password',
                                    inputType: 'password',
                                    allowBlank: false,
                                    name: 'password_confirmation'
                                }
                            ]
                        },
                        buttons: [
                            {
                                text: 'Submit',
                                listeners: {
                                    'click': function (button) {
                                        var window = button.findParentByType('window');
                                        var formPanel = window.query('.form')[0];
                                        me.setWindowStatus('Creating user...');
                                        formPanel.getForm().submit({
                                            reset: true,
                                            success: function (form, action) {
                                                me.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.success) {
                                                    me.getStore().load();
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                            },
                                            failure: function (form, action) {
                                                me.clearWindowStatus();
                                                if (action.response !== undefined) {
                                                    var obj = Ext.decode(action.response.responseText);
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", 'Error adding user.');
                                                }
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text: 'Close',
                                handler: function () {
                                    addUserWindow.close();
                                }
                            }
                        ]
                    });
                    addUserWindow.show();
                }
            });

            toolBarItems.push('|');
        }

        toolBarItems.push({
            xtype: 'textfield',
            width: 200,
            hideLabel: true,
            id: 'user_search_field'
        });
        toolBarItems.push({
            text: 'Search',
            iconCls: 'icon-search-light',
            handler: function (button) {
                var username = Ext.getCmp('user_search_field').getValue();
                usersStore.setProxy({
                    type: 'ajax',
                    url: '/erp_app/desktop/user_management/users/',
                    reader: {
                        type: 'json',
                        root: 'data',
                        idProperty: 'id',
                        totalProperty: 'totalCount'
                    },
                    extraParams: {
                        username: username
                    }
                });
                usersStore.loadPage(1);
            }
        });

        config = Ext.apply({
            width: 460,
            region: 'west',
            split:true,
            collapsible: true,
            header: false,
            store: usersStore,
            loadMask: false,
            columns: columns,
            tbar: {
                ui: 'ide-main',
                items: toolBarItems
            },
            bbar: Ext.create("Ext.toolbar.Paging", {
                pageSize: 25,
                store: usersStore,
                displayInfo: true,
                displayMsg: 'Displaying {0} - {1} of {2}',
                emptyMsg: "No Users"
            }),
            listeners:{
                itemdblclick: function(grid, record, item, index){
                    me.viewUser(record);
                }
            }
        }, config);

        this.callSuper([config]);
    }
});
