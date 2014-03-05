Ext.ns("Compass.ErpApp.Organizer.Applications.Crm");

Compass.ErpApp.Organizer.Applications.Crm.Base = function (config) {
    var tabs = [
        {
            xtype: 'crmpartygrid',
            applicationContainerId: 'crmTaskTabPanel',
            itemId: 'customersPanel',
            contactPurposes: [
                {
                    fieldLabel: 'Home',
                    internalIdentifier: 'home'
                },
                {
                    fieldLabel: 'Work',
                    internalIdentifier: 'work'
                },
                {
                    fieldLabel: 'Billing',
                    internalIdentifier: 'billing'
                }
            ],
            partyRelationships: [
                {
                    title: 'Employees',
                    relationshipType: 'employee_customer',
                    toRoleType: 'customer',
                    fromRoleType: 'employee',
                    contactPurposes: [
                        {
                            fieldLabel: 'Home',
                            internalIdentifier: 'home'
                        },
                        {
                            fieldLabel: 'Work',
                            internalIdentifier: 'work'
                        },
                        {
                            fieldLabel: 'Billing',
                            internalIdentifier: 'billing'
                        }
                    ]
                }
            ]
        }
    ];

    var menuItems = [
        {
            xtype: 'image',
            src: '/images/erp_app/organizer/applications/crm/customer_360_64x64.png',
            height: 50,
            width: 50,
            cls: 'shortcut-image-button',
            style: 'display: block; margin: 10px 0px 0px 75px; clear: both;',
            listeners: {
                render: function (component) {
                    component.getEl().on('click', function (e) {
                        var crmTaskTabPanel = Ext.getCmp('crmTaskTabPanel'),
                            tab = crmTaskTabPanel.down('#customersPanel');
                        crmTaskTabPanel.setActiveTab(tab);

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
                            Compass.ErpApp.Organizer.Layout.setActiveCenterItem('crmTaskTabPanel');
                        });
                    });
                });
            }
        },
        items: menuItems
    };

    //Create the main tab panel which will house instances of the main Task Types
    var crmTaskTabPanel = Ext.create('Ext.tab.Panel', {
        id: 'crmTaskTabPanel',
        itemId: 'crmTaskTabPanel',
        //These tasks we always want open
        items: tabs
    });

    this.setup = function () {
        config['organizerLayout'].addApplication(appShortcutMenuPanel, [crmTaskTabPanel]);
    };
};

