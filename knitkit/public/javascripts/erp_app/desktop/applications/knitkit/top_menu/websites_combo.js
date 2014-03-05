Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.WebsitesComboBox", {
    extend: "Ext.form.field.ComboBox",
    alias: 'widget.websitescombo',
    initComponent: function () {

        var websiteJsonStore = new Ext.data.Store({
            timeout: 60000,
            proxy: {
                type: 'ajax',
                url: '/knitkit/erp_app/desktop/site/index',
                reader: {
                    type: 'json',
                    root: 'sites'
                }
            },
            fields: [
                {
                    name: 'name'
                },
                {
                    name: 'id'
                }
            ]
        });

        var me = this;
        websiteJsonStore.on('load', function (store) {
            if (store.length > 0) {
                me.setValue(store.first().get('id'));
            }
        });

        this.store = websiteJsonStore;
        this.callParent(arguments);
    },

    constructor: function (config) {
        config = Ext.apply({
            id: 'websiteCombo',
            emptyText: 'No Websites',
            valueField: 'id',
            displayField: 'name',
            triggerAction: 'all',
            editable: false,
            forceSelection: true,
            listeners: {
                'select': function (combo, record, index) {
                    alert('template listener');
                },
                render: function (combo) {
                    combo.getStore().load();
                }
            }
        }, config);
        this.callParent([config]);
    }
});
