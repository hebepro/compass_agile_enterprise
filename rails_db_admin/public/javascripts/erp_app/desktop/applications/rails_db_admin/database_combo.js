Ext.define("Compass.ErpApp.Desktop.Applications.RailsDbAdmin.DatabaseComboBox", {
    extend: "Ext.form.field.ComboBox",
    alias: 'widget.railsdbadmin_databasecombo',
    initComponent: function () {

        var databaseJsonStore = Ext.create('Ext.data.Store', {
            timeout: 60000,
            proxy: {
                type: 'ajax',
                url: '/rails_db_admin/erp_app/desktop/base/databases',
                reader: {
                    type: 'json',
                    root: 'databases'
                }
            },
            fields: [
                'value',
                'display'
            ]
        });

        var me = this;
        databaseJsonStore.on('load', function (store) {
            me.setValue(store.first().get('value'));
        });

        this.store = databaseJsonStore;
        this.callParent(arguments);
    },

    constructor: function (config) {
        config = Ext.apply({
            id: 'databaseCombo',
            fieldStyle: {
                borderRadius: '0px !important'
            },
            valueField: 'value',
            displayField: 'display',
            triggerAction: 'all',
            editable: false,
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                'select': function (combo, record, index) {
                    // switch databases
                    combo.initialConfig.module.connectToDatatbase();
                },
                render: function (combo) {
                    combo.getStore().load();
                }
            }
        }, config);

        this.callParent([config]);
    }
});
