Ext.ns("Compass.ErpApp.Organizer.Applications.Crm");

Compass.ErpApp.Organizer.Applications.Crm.Base = function (config) {
    var tabs = [
        {
            xtype: 'party_mgt_panel',
            itemId: 'customersPanel',
            fromRoles: ['customer'],
            toRoles: [],
            title: 'Customers',
            addBtn: '/images/icons/add_user64x64.png',
            addBtnDescription: 'Add Customer',
            searchDescription: 'Find Customer'
        }
    ];

    var menuItems = [
        {
            xtype: 'image',
            src: '/images/icons/carrier-icon50x50.png',
            height: 50,
            width: 50,
            cls: 'shortcut-image-button',
            style: 'display: block; margin: 10px 0px 0px 75px; clear: both;',
            listeners: {
                render: function (component) {
                    component.getEl().on('click', function (e) {

                        var taskTabPanel = Ext.getCmp('taskTabPanel');
                        taskTabPanel.setActiveTab(taskTabPanel.down('#customersPanel'));

                    }, component);
                }
            }
        },
        {
            xtype: 'panel',
            border: false,
            html: "<p style='margin: 0px 0px 10px 0px; text-align: center'>Manage Customers</p>"
        }
    ];

    var appShortcutMenuPanel = {
        xtype: 'panel',
        title: 'CRM',
        width: 100,
        listeners: {
            render: function (c) {
                /*
                 *  We want a listener on each DOM element within this menu to ensure the center panel is set
                 *  properly when they are clicked. This is because this custom panel does not use the default
                 *  menu tree panel type, and hence does not inherit the switching behavior automatically.
                 */
                c.items.each(function (item) {
                    // Wait until each item is rendered to add the click listener, as the panel usually renders before the items within the panel
                    item.on('render', function () {
                        this.getEl().on('click', function () {
                            Compass.ErpApp.Organizer.Layout.setActiveCenterItem('user_mgt_taskTabPanel');
                        });
                    });
                });
            }
        },
        items: menuItems
    };

    //Create the main tab panel which will house instances of the main Task Types
    var taskTabPanel = Ext.create('Ext.tab.Panel', {
        id: 'taskTabPanel',
        itemId: 'taskTabPanel',
        //These tasks we always want open
        items: tabs
    });

    this.setup = function () {
        config['organizerLayout'].addApplication(appShortcutMenuPanel, [taskTabPanel]);
    };
};

