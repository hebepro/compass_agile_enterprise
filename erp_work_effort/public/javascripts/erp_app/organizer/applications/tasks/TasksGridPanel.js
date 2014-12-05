Ext.define("Compass.ErpApp.Organizer.Applications.Tasks.GridPanel", {
    extend: "Ext.grid.Panel",
    alias: 'widget.tasksgridpanel',
    title: 'Tasks',

    /**
     * @cfg {String} url
     * Url of work_efforts controller.
     */
    url: '/erp_work_effort/erp_app/organizer/tasks/work_efforts',

    /**
     * @cfg {Array} additionalColumns
     * Additional columns to add to grid.
     */
    additionalColumns: [],

    /**
     * @cfg {Array} additionalColumns
     * Additional fields to add to grid store.
     */
    additionalFields: [],
    /**
     * @cfg {Boolean} canAddTask
     * Allowed to add tasks.
     */
    canAddTask: true,

    /**
     * @cfg {Boolean} canDeleteTask
     * Allowed to delete tasks.
     */
    canDeleteTask: true,

    initComponent: function () {
        var me = this;

        var fields = [
            'id',
            'description',
            {name: 'createdAt', mapping: 'created_at', type: 'datetime'},
            {name: 'currentStatus', mapping: 'current_status'},
            {name: 'currentStatusDescription', mapping: 'current_status_description'},
            {name: 'assignedParties', mapping: 'assigned_parties'},
            {name: 'assignedRoles', mapping: 'assigned_roles'}
        ];

        if (me.additionalFields)
            fields = fields.concat(me.additionalFields);

        me.tasksStore = Ext.create('Ext.data.Store', {
            fields: fields,
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: me.url,
                reader: {
                    type: 'json',
                    root: 'work_efforts',
                    totalProperty: 'total'
                }
            }
        });

        // setup toolbar
        var toolBarItems = [];

        if (me.canAddTask) {
            toolBarItems.push(
                {
                    text: 'Add Task',
                    xtype: 'button',
                    iconCls: 'icon-add',
                    handler: function (button) {
                        // open tab with create user form.
                        var tabPanel = button.up('tasksgridpanel').up('#tasksPanel');

                        // check and see if tab already open
                        var tab = tabPanel.down('addtaskform');
                        if (tab) {
                            tabPanel.setActiveTab(tab);
                            return;
                        }

                        var crmPartyFormPanel = Ext.create("widget.addtaskform");

                        tabPanel.add(crmPartyFormPanel);
                        tabPanel.setActiveTab(crmPartyFormPanel);
                    }
                },
                '|');
        }

        toolBarItems.push(
            'Search',
            {
                xtype: 'textfield',
                emptyText: me.searchDescription,
                width: 200,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var button = field.up('toolbar').down('button');
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
                        var grid = button.up('tasksgridpanel'),
                            value = grid.down('toolbar').down('textfield').getValue();

                        grid.store.load({
                            params: {
                                query_filter: value,
                                start: 0,
                                limit: 25
                            }
                        });
                    }
                }
            });

        if(Ext.isEmpty(me.initialConfig.columns)){
            me.columns = [
                { text: 'Description', dataIndex: 'description', width: 200, sortable: false },
                { text: 'Status', dataIndex: 'currentStatusDescription', sortable: false },
                { text: 'Assigned Parties', dataIndex: 'assignedParties', sortable: false },
                { text: 'Assigned Roles', dataIndex: 'assignedRoles', sortable: false },
                { text: 'Created At', dataIndex: 'createdAt', renderer: Ext.util.Format.dateRenderer('m/d/Y g:i A'), width: 150, sortable: false }
            ];

            if (me.canDeleteTask) {
                me.columns.push(
                    {
                        xtype: 'actioncolumn',
                        header: 'Delete',
                        align: 'center',
                        width: 50,
                        items: [
                            {
                                icon: '/images/icons/delete/delete_16x16.png',
                                tooltip: 'Delete',
                                handler: function (grid, rowIndex, colIndex) {
                                    var record = grid.getStore().getAt(rowIndex);

                                    var myMask = new Ext.LoadMask(grid, {msg: "Please wait..."});
                                    myMask.show();

                                    Ext.Msg.confirm('Please Confirm', 'Delete record?', function (btn) {
                                        if (btn == 'ok' || btn == 'yes') {
                                            Ext.Ajax.request({
                                                method: 'DELETE',
                                                url: '/erp_work_effort/erp_app/organizer/tasks/work_efforts/' + record.get('id'),
                                                success: function (response) {
                                                    myMask.hide();
                                                    responseObj = Ext.JSON.decode(response.responseText);

                                                    if (responseObj.success) {
                                                        grid.store.reload();
                                                    }
                                                },
                                                failure: function (response) {
                                                    myMask.hide();
                                                    Ext.Msg.alert("Error", "Error with request");
                                                }
                                            });
                                        }
                                        else {
                                            myMask.hide();
                                        }
                                    });
                                }
                            }
                        ]
                    }
                );
            }

            if (me.additionalColumns)
                me.columns = me.columns.concat(me.additionalColumns);
        }

        me.store = me.tasksStore;

        me.dockedItems = [
            {
                xtype: 'toolbar',
                docked: 'top',
                items: toolBarItems
            },
            {
                xtype: 'pagingtoolbar',
                store: me.tasksStore,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        me.callParent();
    },

    constructor: function (config) {
        var listeners = {
            'activate': function () {
                this.store.load({
                    params: {
                        start: 0,
                        limit: 25
                    }
                });
            }
        };

        config['listeners'] = Ext.apply(listeners, config['listeners']);

        this.callParent([config]);
    }
});