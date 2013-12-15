Ext.ns("Compass.ErpApp.Organizer.Applications.Tasks");
/**
 * Method to setup organizer application
 * @param {config} object containing (organizerLayout : reference to main layout container, widgetRoles : roles for widgets contained in this application)
 */
Compass.ErpApp.Organizer.Applications.Tasks.Base = function (config) {

    var appShortcutMenuPanel = {
        xtype: 'panel',
        title: 'Tasks',
        width: 100,
        autoScroll: true,
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
                            Compass.ErpApp.Organizer.Layout.setActiveCenterItem('tasksPanel');
                        });
                    });
                });
            }
        },
        items: [
            {
                xtype: 'image',
                src: '/images/icons/erp_work_effort/tasks50x50.png',
                height: 50,
                width: 50,
                cls: 'shortcut-image-button',
                style: 'display: block; margin: 2px 0px 0px 72px; clear: both;cursor: pointer;',
                listeners: {
                    render: function (c) {
                        c.getEl().on('click', function (e) {
                            var taskTabPanel = Ext.getCmp('tasksPanel');
                            taskTabPanel.setActiveTab(taskTabPanel.down('#tasksGridPanel'));
                        }, c);
                    }
                }
            },
            {
                xtype: 'panel',
                border: false,
                html: "<p style='margin: 0px 0px 10px 0px; text-align: center'>Tasks</p>"
            }
        ]
    };

    //Create the main tab panel which will house instances of the main Task Types
    var taskTabPanel = Ext.create('Ext.tab.Panel', {
        id: 'tasksPanel',
        itemId: 'tasksPanel',
        items: [
            {
                xtype: 'tasksgridpanel',
                itemId: 'tasksGridPanel'
            }
        ]
    });

    this.setup = function () {
        config['organizerLayout'].addApplication(appShortcutMenuPanel, [taskTabPanel]);
    };

};

