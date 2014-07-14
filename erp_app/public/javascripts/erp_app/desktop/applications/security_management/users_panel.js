Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.UsersPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.security_management_userspanel',
    layout: 'fit',

    setUser: function (record) {
        var me = this;

        var assign_to_id = record.get('id');
        var assign_to_username = record.get('username');

        var southPanel = Ext.getCmp('security_management_south_region');

        var security_management_groupswidget = southPanel.down('security_management_groupswidget');
        security_management_groupswidget.assign_to_id = assign_to_id;
        security_management_groupswidget.assign_to_description = assign_to_username;
        security_management_groupswidget.refreshWidget();

        var security_management_roleswidget = southPanel.down('security_management_roleswidget');
        security_management_roleswidget.assign_to_id = assign_to_id;
        security_management_roleswidget.assign_to_description = assign_to_username;
        security_management_roleswidget.refreshWidget();

        var security_management_capabilitieswidget = southPanel.down('security_management_capabilitieswidget');
        security_management_capabilitieswidget.assign_to_id = assign_to_id;
        security_management_capabilitieswidget.assign_to_description = assign_to_username;
        security_management_capabilitieswidget.refreshWidget();

        var security_management_userseffectivesecurity = southPanel.down('security_management_userseffectivesecurity');
        security_management_userseffectivesecurity.assign_to_id = assign_to_id;
        security_management_userseffectivesecurity.assign_to_description = assign_to_username;
        security_management_userseffectivesecurity.refreshWidget();
    },

    constructor: function (config) {
        var self = this;

        config = Ext.apply({
            title: 'Users',
            autoScroll: true,
            items: [
                {
                    xtype: 'security_management_user_grid',
                    setupUrl: '/erp_app/desktop/security_management/users/available_setup',
                    dataUrl: '/erp_app/desktop/security_management/users/available',
                    grid_listeners: {
                        itemclick: function (grid, record, item, index) {
                            self.setUser(record);
                        }
                    }
                }
            ]

        }, config);

        this.callParent([config]);
    }

});
