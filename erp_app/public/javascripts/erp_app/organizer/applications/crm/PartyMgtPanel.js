Ext.define("Compass.ErpApp.Organizer.Applications.Crm.PartyMgtPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.party_mgt_panel',
    layout: 'border',
    items: [],

    initComponent: function () {
        var config = this.initialConfig;

        //add header
        this.items.push({
            xtype: 'panel',
            itemId: 'containerPanel',
            region: 'north',
            height: 100,
            layout: 'hbox',
            width: '50%',
            items: [
                {
                    xtype: 'panel',
                    layout: 'vbox',
                    border: false,
                    items: [
                        {
                            xtype: 'image',
                            src: config.addBtn || '/images/icons/add_user64x64.png',
                            height: 64,
                            width: 64,
                            cls: 'shortcut-image-button',
                            style: 'display: block; margin: 10px 10px 0px 44px; clear: both;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        // open tab with create user form.
                                        var tabPanel = component.up('#taskTabPanel');

                                        // check and see if tab already open
                                        var tab = tabPanel.down('party_form');
                                        if (tab) {
                                            tabPanel.setActiveTab(tab);
                                            return;
                                        }

                                        var newPartyForm = Ext.create("widget.party_form", {
                                            title: config.addBtnDescription,
                                            toRoles: config.toRoles,
                                            fromRoles: config.fromRoles
                                        });

                                        tabPanel.add(newPartyForm);
                                        tabPanel.setActiveTab(newPartyForm);

                                    }, component);
                                }
                            }
                        },
                        {
                            xtype: 'panel',
                            border: false,
                            html: "<p style='margin: 5px 10px 10px 30px; text-align: center'>"+ config.addBtnDescription +"</p>"
                        }
                    ]
                },
                {
                    xtype: 'form',
                    itemId: 'searchForm',
                    width: '50%',
                    layout: 'hbox',
                    style: 'margin: 30px 0 0 30px;',
                    border: false,
                    url: '/erp_app/organizer/users/search',
                    items: [
                        {
                            itemId: 'usersearchbox',
                            xtype: 'textfield',
                            emptyText: config.searchDescription,
                            width: 200,
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        var button = field.up('#usersearchform').down('#searchbutton');
                                        button.fireEvent('click', button);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'searchbutton',
                            icon: '/images/icons/toolbar_find.png',
                            listeners: {
                                click: function (button, e, eOpts) {
                                    var c = button.up('user_mgt_panel');
                                    var grid = c.query('#usersgrid').first(),
                                        value = c.query('#usersearchbox').first().getValue();

                                    grid.query('shared_dynamiceditablegrid').first().getStore().load({
                                        params: {query_filter: value}
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        });

        this.items.push({
            xtype: 'partygrid',
            region: 'center',
            toRoles: config.toRoles,
            fromRoles: config.fromRoles
        });

        this.callParent(arguments);
    }

});        
