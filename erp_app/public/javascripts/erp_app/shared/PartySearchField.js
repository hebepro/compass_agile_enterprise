Ext.define("Compass.ErpApp.Shared.PartySearchField", {
    extend: "Ext.form.field.ComboBox",
    alias: 'widget.partysearchfield',
    typeAhead: false,
    hideTrigger: true,
    pageSize: 10,

    constructor: function (config) {
        var me = this,
            extraParams = {role_type: config.partyRole},
            listTemplate = config.list_template,
            fields = config.fields;

        // merge extraParams with extraParams passed in config
        if (config.extraParams)
            extraParams = Ext.apply(config.extraParams, extraParams);

        if (!listTemplate) {
            listTemplate = '<div>{description}</div><div>{addressLine1}</div><div>{addressLine2}</div><div>{city}, {state}</div><div>{zip}</div>';
        }

        if (!fields) {
            fields = [
                'id',
                'description',
                {name: 'addressLine1', mapping: 'address_line_1'},
                {name: 'addressLine2', mapping: 'address_line_2'},
                'city',
                'state',
                'zip'
            ]
        }

        config = Ext.apply({
            emptyText: (config.emptyText || 'Search'),
            valueField: (config.valueField || 'id'),
            displayField: (config.valueField || 'description'),
            triggerAction: 'all',
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching results found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return listTemplate;
                }
            },
            hideTrigger: true,
            typeAhead: (config.typeAhead || true),
            minChars: 3,
            store: Ext.create('Ext.data.Store', {
                fields: fields,
                proxy: {
                    type: 'ajax',
                    reader: {
                        type: 'json',
                        root: 'parties',
                        totalProperty: 'total'
                    },
                    extraParams: extraParams,
                    url: (config.url || '/erp_app/organizer/crm/base/search_parties')
                },
                autoLoad: true,
                listeners: {
                    load: function (store, records, options) {
                        try {
                            var record_value = self.ownerCt.getRecord().data[me.name];
                        } catch (e) {
                        }
                        if (!Ext.isEmpty(record_value)) {
                            me.setValue(record_value);
                        } else if (!Ext.isEmpty(self.default_value)) {
                            // self.value did not want to work for selecting default value so we use custom self.default_value
                            me.setValue(self.default_value);
                        }
                    }
                }
            })
        }, config);

        this.callParent([config]);
    }
});
