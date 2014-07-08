Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.UsersPanel",{
  extend:"Ext.panel.Panel",
  alias:'widget.security_management_userspanel',

  setUser : function(field){
    var assign_to_id = field.getValue();
    var assign_to_username = field.getStore().getById(assign_to_id).data.username;

    var security_management_userspanel = field.findParentByType('security_management_userspanel');
    var southPanel = Ext.ComponentQuery.query('security_management_southpanel').first();
    
    var security_management_groupswidget = southPanel.down('security_management_groupswidget');
    security_management_groupswidget.assign_to_id = assign_to_id;
    security_management_groupswidget.assign_to_description = assign_to_username;

    var security_management_roleswidget = southPanel.down('security_management_roleswidget');
    security_management_roleswidget.assign_to_id = assign_to_id;
    security_management_roleswidget.assign_to_description = assign_to_username;

    var security_management_capabilitieswidget = southPanel.down('security_management_capabilitieswidget');
    security_management_capabilitieswidget.assign_to_id = assign_to_id;
    security_management_capabilitieswidget.assign_to_description = assign_to_username;

    var security_management_userseffectivesecurity = southPanel.down('security_management_userseffectivesecurity');
    security_management_userseffectivesecurity.assign_to_id = assign_to_id;
    security_management_userseffectivesecurity.assign_to_description = assign_to_username;
  },

  constructor : function(config) {
    var self = this;

    config = Ext.apply({
      width:460,
      title:'Users',
      autoScroll: true,
      items:[{
        xtype: 'form',
        bodyPadding: 10,
        items: [ {
          xtype:'related_searchbox',
          fieldLabel: 'User',
          width: 300,
          url:'/erp_app/desktop/security_management/search',
          extraParams: {
            model: 'User',
            search_fields: "username",
            display_fields: "username"
          },
          fields: [{name: "id"}, {name:"username"}],
          display_template: "{username}",
          listeners:{
            select: function(field, records, eOpts){
              self.setUser(field);

              // get active tabpanel
              var southPanel = Ext.ComponentQuery.query('security_management_southpanel').first();
              var activeTabPanel = southPanel.down('tabpanel').getActiveTab();
              activeTabPanel.refreshWidget();
                        activeTabPanel.updateTitle();
                    }
                }
            }
        ]
        }
      ]

    }, config);

    this.callParent([config]);
  }

});
