Ext.ns("Compass.ErpApp.Organizer.Applications.Tasks");
/**
 * Method to setup organizer application
 * @param {config} object containing (organizerLayout : reference to main layout container, widgetRoles : roles for widgets contained in this application)
 */
Compass.ErpApp.Organizer.Applications.Tasks.Base = function (config) {
    var me = this;

    var tabs = [
        {
            xtype: 'tasksgridpanel',
            itemId: 'tasksGridPanel',
            allTasks: currentUser.hasRole('admin')
        },
        {
            xtype: 'crmpartygrid',
            title: 'Workers',
            searchDescription: 'Find Worker',
            partyMgtTitle: 'Worker',
            addBtnDescription: 'Add Worker',
            applicationContainerId: 'tasksPanel',
            itemId: 'workersPanel',
            partyRole: 'worker',
            partyRelationships: [],
            allowedPartyType: 'Individual',
            additionalTabs: [
                {
                    xtype: 'tasksgridpanel',
                    itemId: 'tasksGridPanel',
                    canAddTask: false,
                    canDeleteTask: false,
                    listeners: {
                        activate: function (comp) {
                            var details = comp.up('crmpartydetailspanel');

                            comp.store.getProxy().extraParams.partyId = details.partyId;
                            comp.store.load();
                        }
                    }
                }
            ]
        },
        {
            xtype: 'taskganttpanel'
        }
    ];

    var menuItems = [
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
        },
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
                        var crmTaskTabPanel = Ext.getCmp('tasksPanel'),
                            tab = crmTaskTabPanel.down('#workersPanel');
                        crmTaskTabPanel.setActiveTab(tab);

                    }, component);
                }
            }
        },
        {
            xtype: 'panel',
            border: false,
            html: "<p style='margin: 0px 0px 10px 0px; text-align: center'>Manage Workers</p>"
        }
    ];

    var appShortcutMenuPanel = {
        id: 'tasksPanelMenu',
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
        items: menuItems
    };

    //Create the main tab panel which will house instances of the main Task Types
    var taskTabPanel = Ext.create('Ext.tab.Panel', {
        id: 'tasksPanel',
        itemId: 'tasksPanel',
        items: tabs
    });

    this.setup = function () {
        config['organizerLayout'].addApplication(appShortcutMenuPanel, [taskTabPanel]);

        me.taskCountBtn = Ext.create('widget.button', {
            hidden: true,
            text: '<span id="taskPanelTaskCountContainer" style="color:red;font-weight:bold;">Tasks (<span id="taskPanelTaskCount">0</span>)</span>',
            handler: function () {
                Compass.ErpApp.Organizer.Layout.setActiveCenterItem('tasksPanel', 'tasksPanelMenu');

                var taskTabPanel = Ext.getCmp('tasksPanel');
                taskTabPanel.setActiveTab(taskTabPanel.down('#tasksGridPanel'));
            }
        });

        config['organizerLayout'].addToToolBar(me.taskCountBtn);
    };

    this.updateTaskCount = function () {
        Ext.Ajax.request({
            method: 'GET',
            url: '/erp_work_effort/erp_app/organizer/tasks/work_efforts/task_count',
            success: function (response) {
                responseObj = Ext.decode(response.responseText);
                var count = Ext.get('taskPanelTaskCount');
                if (responseObj.success) {
                    if (responseObj.count > 0) {
                        me.taskCountBtn.show();
                        count.update(responseObj.count);
                    }
                    else {
                        me.taskCountBtn.hide();
                    }
                }
            },
            failure: function () {
                // should we display error message or fail silently?
            }
        });
    };

    var task = Ext.TaskManager.start({
        run: me.updateTaskCount,
        scope: me,
        interval: 30000
    });

};

