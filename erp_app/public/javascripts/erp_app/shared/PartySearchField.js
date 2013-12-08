Ext.define("Compass.ErpApp.Shared.PartySearchField", {
    extend: "Ext.form.field.ComboBox",
    alias: 'widget.partysearchfield',
    typeAhead: false,
    hideTrigger: true,
    pageSize: 10,

    constructor: function (config) {
        var me = this,
            extraParams = {role_type: config.partyRole, to_role: config.toRole},
            listTemplate = config.list_template,
            fields = config.fields;

        // merge extraParams with extraParams passed in config
        if (config.extraParams)
            extraParams = Ext.apply(config.extraParams, extraParams);

        if (!listTemplate) {
            listTemplate = '<div>{description}</div>';
            listTemplate += '<tpl if="!Ext.isEmpty(addressLine1)">';
            listTemplate += '<div>{addressLine1}</div>';
            listTemplate += '<div>{addressLine2}</div>';
            listTemplate += '<div>{city}, {state}</div><div>{zip}</div>';
            listTemplate += '</tpl>';
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
                    url: (config.url || '/erp_app/organizer/crm/parties/search')
                },
                autoLoad: true
            })
        }, config);

        this.callParent([config]);
    }
});
