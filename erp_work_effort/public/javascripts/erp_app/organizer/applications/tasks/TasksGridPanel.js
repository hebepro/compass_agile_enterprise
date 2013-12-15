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

    initComponent: function () {
        var me = this;

        me.tasksStore = Ext.create('Ext.data.Store', {
            fields: [
                'id',
                'description',
                {name: 'createdAt', mapping: 'created_at', type: 'datetime'},
                'current_status',
                'current_status_description'
            ],
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

        me.columns = [
            { text: 'Description', dataIndex: 'description', width: 200, sortable: false },
            { text: 'Status', dataIndex: 'current_status_description', sortable: false },
            { text: 'Created At', dataIndex: 'createdAt', renderer: Ext.util.Format.dateRenderer('m/d/Y g:i A'), width: 150, sortable: false }
        ];

        if (me.additionalColumns)
            me.columns = me.columns.concat(me.additionalColumns);

        me.store = me.tasksStore;

        me.dockedItems = [
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
        var listeners =  {
            'activate': function () {
                this.store.load({
                    params: {
                        start: 0,
                        limit: 25
                    }
                });
            }
        }

        config['listeners'] = Ext.apply(listeners, config['listeners']);

        this.callParent([config]);
    }
});