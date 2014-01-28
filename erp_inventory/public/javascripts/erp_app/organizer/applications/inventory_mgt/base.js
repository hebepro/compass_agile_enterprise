Ext.ns("Compass.ErpApp.Organizer.Applications.InventoryMgt");
/**
 * Method to setup organizer application
 * @param {config} object containing (organizerLayout : reference to main layout container, widgetRoles : roles for widgets contained in this application)
 */
Compass.ErpApp.Organizer.Applications.InventoryMgt.Base = function(config){

    var tabs = [
        {
            xtype: 'inventory_list_grid',
            title: 'Inventory Listing',
            applicationContainerId: 'invMgtTabPanel',
            itemId: 'inventoryMgtPanel',
            partyRelationships: [
                {
                    title: 'Inventory List',
                    relationshipType: 'employee_customer',
                    toRoleType: 'customer',
                    fromRoleType: 'employee'
                }
            ]
        },
        {
            xtype: 'facility_list_grid',
            title: 'Storage Facility Listing',
            applicationContainerId: 'invMgtTabPanel',
            itemId: 'facilityMgtPanel',
            partyRelationships: [
                {
                    title: 'Storage Facility List',
                    relationshipType: 'employee_customer',
                    toRoleType: 'customer',
                    fromRoleType: 'employee'
                }
            ]
        }
    ];

    var menuItems = [

        {
            xtype: 'image',
            src: '/images/erp_app/organizer/applications/inventory_mgt/warehouse.png',
            height: 50,
            width: 50,
            cls: 'shortcut-image-button',
            style: 'display: block; margin: 10px 0px 0px 75px; clear: both;',
            listeners: {
                render: function (component) {
                    component.getEl().on('click', function (e) {
                        var crmTaskTabPanel = Ext.getCmp('invMgtTabPanel'),
                            tab = crmTaskTabPanel.down('#facilityMgtPanel');
                        crmTaskTabPanel.setActiveTab(tab);

                    }, component);
                }
            }
        },
        {
            xtype: 'panel',
            border: false,
            html: "<p style='margin: 0px 0px 10px 0px; text-align: center'>Storage Facilities</p>"
        },
        {
            xtype: 'image',
            src: '/images/erp_app/organizer/applications/inventory_mgt/inventory.png',
            height: 50,
            width: 50,
            cls: 'shortcut-image-button',
            style: 'display: block; margin: 10px 0px 0px 75px; clear: both;',
            listeners: {
                render: function (component) {
                    component.getEl().on('click', function (e) {
                        var crmTaskTabPanel = Ext.getCmp('invMgtTabPanel'),
                            tab = crmTaskTabPanel.down('#inventoryMgtPanel');
                        crmTaskTabPanel.setActiveTab(tab);

                    }, component);
                }
            }
        },
        {
            xtype: 'panel',
            border: false,
            html: "<p style='margin: 0px 0px 10px 0px; text-align: center'>Inventory Entries</p>"
        }
    ];

    var appShortcutMenuPanel = {
        xtype: 'panel',
        title: 'Inventory Mgt',
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
                            Compass.ErpApp.Organizer.Layout.setActiveCenterItem('invMgtTabPanel');
                        });
                    });
                });
            }
        },
        items: menuItems
    };

    //Create the main tab panel which will house instances of the main Task Types
    var invMgtTabPanel = Ext.create('Ext.tab.Panel', {
        id: 'invMgtTabPanel',
        itemId: 'invMgtTabPanel',
        //These tasks we always want open
        items: tabs
    });

    this.setup = function () {
        config['organizerLayout'].addApplication(appShortcutMenuPanel, [invMgtTabPanel]);
    };

};


