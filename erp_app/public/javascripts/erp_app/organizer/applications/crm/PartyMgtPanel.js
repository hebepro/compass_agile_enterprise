Ext.define("Compass.ErpApp.Organizer.Applications.Crm.PartyMgtPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.party_mgt_panel',
    layout: 'border',
    listeners: {
        activate: function () {
            this.down('partygrid').store.load({
                params: {
                    start: 0,
                    limit: 25
                }
            });
        }
    },

    constructor: function (config) {
        //add header
        var items = [{
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
                            src: config.addBtn || '/images/erp_app/organizer/applications/crm/customer_360_64x64.png',
                            height: 64,
                            width: 64,
                            cls: 'shortcut-image-button',
                            style: 'display: block; margin: 10px 10px 0px 44px; clear: both;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        // open tab with create user form.
                                        var tabPanel = component.up('#crmTaskTabPanel');

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
                            html: "<p style='margin: 5px 10px 10px 30px; text-align: center'>" + config.addBtnDescription + "</p>"
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
                            icon: '/images/erp_app/organizer/applications/crm/toolbar_find.png',
                            listeners: {
                                click: function (button, e, eOpts) {
                                    var partyMgtPanel = button.up('party_mgt_panel'),
                                        grid = partyMgtPanel.down('partygrid'),
                                        value = partyMgtPanel.down('#usersearchbox').getValue();

                                    grid.store.load({
                                        params: {
                                            query_filter: value,
                                            start: 0,
                                            limit: 25
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        }];

        items.push({
            xtype: 'partygrid',
            region: 'center',
            toRole: config.toRole,
            fromRoles: config.fromRoles,
            partyMgtTitle: config.title
        });

        config = Ext.apply({
            items: items
        }, config);

        this.callParent([config]);
    }

});        
