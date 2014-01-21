Ext.ns("Compass.ErpApp.Organizer.Applications");

Compass.ErpApp.Organizer.Layout = function (config) {

    this.layoutConfig = config;

    //used to build accordion menu
    var accordionMenuItems = [];

    var menu = Ext.create('Ext.menu.Menu', {
        items: [
            {
                text: 'Preferences',
                iconCls: 'icon-gear',
                handler: function () {
                    var win = Ext.create("Compass.ErpApp.Organizer.PreferencesWindow", {iconCls: 'icon-gear'});
                    win.show();
                    win.setup();
                }
            },
            {
                text: 'Profile',
                iconCls: 'icon-user',
                handler: function () {
                    var win = Ext.create("Ext.window.Window", {
                        title: 'Profile',
                        iconCls: 'icon-user',
                        items: [
                            {xtype: 'shared_profilemanagementpanel', title: '', height: 250}
                        ]
                    });
                    win.show();
                }
            }
        ]
    });

    this.toolBar = Ext.create("Ext.toolbar.Toolbar", {
        dock: 'top',
        height: 50,
        style: {
            backgroundColor: '#537697',
            paddingLeft: '22px',
            paddingRight: '15px'
        },
        items: [
            {
                text: 'Menu',
                iconCls: 'icon-info',
                menu: menu
            },
            ' ',
            {
                xtype: 'label',
                style: 'color:white;',
                text: 'Welcome',
                itemId: 'organizerWelcomeMsg'
            }
        ]
    });

    this.addToToolBar = function (item) {
        this.toolBar.add(item);
    };

    this.setupLogoutButton = function () {
        this.toolBar.add("->");
        this.toolBar.add({
            text: 'Logout',
            xtype: 'button',
            iconCls: "icon-exit",
            defaultAlign: "right",
            'listeners': {
                scope: this,
                'click': function () {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to logout?', function (btn) {
                        if (btn == 'no') {
                            return false;
                        }
                        else if (btn == 'yes') {
                            var defaultLogoutUrl = '/session/sign_out';
                            if (Compass.ErpApp.Utility.isBlank(this.layoutConfig) || Compass.ErpApp.Utility.isBlank(this.layoutConfig["logout_url"])) {
                                window.location = defaultLogoutUrl;
                            }
                            else {
                                window.location = this.layoutConfig["logout_url"];
                            }
                        }
                    });
                }
            }
        });
    };

    this.centerPanel = Ext.create("Ext.Panel", {
        id: 'erp_app_viewport_center',
        cls: 'masterPanel',
        style:{
            marginRight: '20px',
            borderRadiusBottomRight: '10px'
        },
        region: 'center',
        layout: 'card',
        activeItem: 0,
        items: []
    });

    this.bottomBar = Ext.create("Ext.toolbar.Toolbar", {
        dock: 'bottom',
        height: 50,
        style: {
            backgroundColor: '#537697',
            paddingLeft: '22px',
            paddingRight: '15px'
        },
        items: [
            "->",
            {
                xtype: "trayclock"
            }
        ]
    });

    this.addApplication = function (menuPanel, components) {
        accordionMenuItems.push(menuPanel);
        for (var i = 0; i < components.length; i++) {
            this.centerPanel.add(components[i]);
        }
    };

    this.setup = function () {
        this.westPanel = {
            id: 'erp_app_viewport_west',
            style:{
                marginRight: '10px',
                marginLeft: '20px',
                borderRadius: '5px'
            },
            region: 'west',
            width: 200,
            split: true,
            layout: 'accordion',
            items: accordionMenuItems
        };

        this.viewPort = Ext.create('Ext.container.Viewport', {
            border: false,
            layout: 'fit',
            items: [
                {
                    xtype:'panel',
                    border: false,
                    layout: 'border',
                    dockedItems: [
                        this.toolBar,
                        this.bottomBar
                    ],
                    items:[
                        this.westPanel,
                        this.centerPanel,
                        this.eastPanel
                    ]
                }
            ]
        });

        this.viewPort.down('#organizerWelcomeMsg').setText('Welcome: ' + currentUser.description);
    };
};

Compass.ErpApp.Organizer.Layout.setActiveCenterItem = function (panel_id, menu_id, loadRemoteData) {
    // set panel as active
    var panel = Ext.ComponentMgr.get('erp_app_viewport_center').down('#' + panel_id);
    if (panel)
        Ext.ComponentMgr.get('erp_app_viewport_center').layout.setActiveItem(panel);

    var menu = Ext.ComponentMgr.get('erp_app_viewport_west').down('#' + menu_id);
    if (menu)
        menu.expand();

    if (loadRemoteData === undefined || loadRemoteData) {
        var hasLoad = ( (typeof panel.loadRemoteData) != 'undefined' );
        if (hasLoad) {
            panel.loadRemoteData();
        }
    }

};



