Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.RolesWidget", {
    extend: "Ext.panel.Panel",
    alias: 'widget.security_management_roleswidget',

    updateTitle: function () {
        if (this.assign_to_description) {
            this.down('#assignment').setTitle('Assign Roles to ' + this.assign_to + ' ' + this.assign_to_description);
        }
    },

    refreshWidget: function (tab) {
        if (tab === undefined) tab = this;

        //need a delay to allow for rendering of shared_dynamiceditablegrid
        setTimeout(function () {
            var available_grid = tab.down('#available').down('shared_dynamiceditablegrid');
            var selected_grid = tab.down('#selected').down('shared_dynamiceditablegrid');
            if (tab.assign_to_id) {
                var extraParams = {
                    assign_to: tab.assign_to,
                    id: tab.assign_to_id
                };

                available_grid.getStore().getProxy().extraParams = extraParams;
                available_grid.getStore().load();

                selected_grid.getStore().getProxy().extraParams = extraParams;
                selected_grid.getStore().load();
            } else {
                available_grid.getStore().getProxy().extraParams = {};
                selected_grid.getStore().getProxy().extraParams = {};
            }
        }, 900);
    },

    constructor: function (config) {
        var self = this,
            commonWidgetProperties = Compass.ErpApp.Desktop.Applications.SecurityManagement.CommonWidget.properties;

        var available_grid = Ext.apply(commonWidgetProperties.available_grid, {
            xtype: 'security_management_role_grid',
            title: 'Available Roles',
            setupUrl: '/erp_app/desktop/security_management/roles/available_setup',
            dataUrl: '/erp_app/desktop/security_management/roles/available',
            autoLoad: false
        });

        var selected_grid = Ext.apply(commonWidgetProperties.selected_grid, {
            xtype: 'security_management_role_grid',
            title: 'Selected Roles',
            setupUrl: '/erp_app/desktop/security_management/roles/selected_setup',
            dataUrl: '/erp_app/desktop/security_management/roles/selected',
            autoLoad: false
        });

        var assignment = Ext.apply(commonWidgetProperties.assignment, {
            xtype: 'panel',
            title: 'Manage Roles',
            items: [
                available_grid,
                {
                    xtype: 'container',
                    width: 22,
                    bodyPadding: 5,
                    items: [
                        {xtype: 'SecurityManagement-AddRoleButton'},
                        {xtype: 'SecurityManagement-RemoveRoleButton'}
                    ]
                },
                selected_grid
            ]
        });

        config = Ext.apply({
            title: 'Roles',
            assign_to: (config.assign_to || 'User'),
            items: [
                assignment
            ],
            listeners: {
                activate: function (tab) {
                    self.refreshWidget(tab);
                    self.updateTitle();
                }
            }

        }, config);

        this.callParent([config]);
    }
});

Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.RoleGrid", {
    extend: "Compass.ErpApp.Shared.DynamicEditableGridLoaderPanel",
    alias: 'widget.security_management_role_grid',

    constructor: function (config) {
        config = Ext.apply({
            id: config.id,
            title: config.title,
            editable: false,
            page: true,
            pageSize: 10,
            multiSelect: true,
            displayMsg: 'Displaying {0} - {1} of {2}',
            emptyMsg: 'Empty',
            tbar: [
                {
                    fieldLabel: '<span data-qtitle="Search" data-qwidth="200" data-qtip="">Search</span>',
                    itemId: 'searchValue',
                    xtype: 'textfield',
                    width: 400,
                    value: '',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                var grid = field.findParentByType('security_management_role_grid');
                                var button = grid.query('#searchButton').first();
                                button.fireEvent('click', button);
                            }
                        }
                    }
                },
                {xtype: 'tbspacer', width: 1},
                {
                    xtype: 'button',
                    itemId: 'searchButton',
                    iconCls: 'x-btn-icon icon-search',
                    listeners: {
                        click: function (button) {
                            if (button.findParentByType('security_management_roleswidget') && !button.findParentByType('security_management_roleswidget').assign_to_id) return;
                            var grid = button.findParentByType('security_management_role_grid');
                            var value = grid.query('#searchValue').first().getValue();
                            grid.query('shared_dynamiceditablegrid').first().getStore().load({
                                params: {query_filter: value}
                            });
                        }
                    }
                }
            ]
        }, config);

        this.callParent([config]);
    }
});

Ext.define('Compass.ErpApp.Desktop.Applications.SecurityManagement.AddRoleButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.SecurityManagement-AddRoleButton',
    itemId: 'AddRoleButton',
    cls: 'x-btn-text-icon',
    iconCls: 'icon-arrow-right-blue',
    formBind: false,
    tooltip: 'Add to Selected',
    listeners: {
        click: function (button) {
            var security_management_roleswidget = button.findParentByType('security_management_roleswidget');
            var available_grid = security_management_roleswidget.query('#available').first().down('shared_dynamiceditablegrid');
            var selected_grid = security_management_roleswidget.query('#selected').first().down('shared_dynamiceditablegrid');
            var selection = available_grid.getSelectionModel().getSelection();
            if (security_management_roleswidget.assign_to_id && selection.length > 0) {
                var selected = [];
                Ext.each(selection, function (s) {
                    selected.push(s.data.id);
                });

                Ext.Ajax.request({
                    url: '/erp_app/desktop/security_management/roles/add',
                    method: 'POST',
                    params: {
                        assign_to: security_management_roleswidget.assign_to,
                        id: security_management_roleswidget.assign_to_id,
                        selection: Ext.encode(selected)
                    },
                    success: function (response) {
                        var json_response = Ext.decode(response.responseText);
                        if (json_response.success) {
                            available_grid.getStore().load();
                            selected_grid.getStore().load();
                        } else {
                            Ext.Msg.alert('Error', Ext.decode(response.responseText).message);
                        }
                    },
                    failure: function (response) {
                        Ext.Msg.alert('Error', 'Error Adding Role');
                    }
                });
            } else {
                Ext.Msg.alert('Error', 'Please make a selection.');
            }
        }
    }
});

Ext.define('Compass.ErpApp.Desktop.Applications.SecurityManagement.RemoveRoleButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.SecurityManagement-RemoveRoleButton',
    itemId: 'RemoveRoleButton',
    cls: 'x-btn-text-icon',
    iconCls: 'icon-arrow-left-blue',
    formBind: false,
    tooltip: 'Remove from Selected',
    listeners: {
        click: function (button) {
            var security_management_roleswidget = button.findParentByType('security_management_roleswidget');
            var available_grid = security_management_roleswidget.query('#available').first().down('shared_dynamiceditablegrid');
            var selected_grid = security_management_roleswidget.query('#selected').first().down('shared_dynamiceditablegrid');
            var selection = selected_grid.getSelectionModel().getSelection();
            if (security_management_roleswidget.assign_to_id && selection.length > 0) {
                var selected = [];
                Ext.each(selection, function (s) {
                    selected.push(s.data.id);
                });

                Ext.Ajax.request({
                    url: '/erp_app/desktop/security_management/roles/remove',
                    method: 'POST',
                    params: {
                        assign_to: security_management_roleswidget.assign_to,
                        id: security_management_roleswidget.assign_to_id,
                        selection: Ext.encode(selected)
                    },
                    success: function (response) {
                        var json_response = Ext.decode(response.responseText);
                        if (json_response.success) {
                            available_grid.getStore().load();
                            selected_grid.getStore().load();
                        } else {
                            Ext.Msg.alert('Error', Ext.decode(response.responseText).message);
                        }
                    },
                    failure: function (response) {
                        Ext.Msg.alert('Error', 'Error Removing Role');
                    }
                });
            } else {
                Ext.Msg.alert('Error', 'Please make a selection.');
            }
        }
    }
});
