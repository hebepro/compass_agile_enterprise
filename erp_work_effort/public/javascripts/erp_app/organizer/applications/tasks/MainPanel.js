Ext.define("Compass.ErpApp.Organizer.Applications.Tasks.MainPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.tasksmainpanel',
    title: 'Tasks',

    layout: 'border',

    items: [
        {
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            bodyPadding: 10,

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },
            region: 'north',
            title: 'Filters',
            header: false,
            collapsible: true,
            collapsed: true,
            split: true,
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',

                    fieldDefaults: {
                        labelAlign: 'top'
                    },

                    items: [
                        {
                            labelWidth: 50,
                            width: 170,
                            fieldLabel: 'Before',
                            xtype: 'datefield',
                            value: new Date()
                        },
                        {
                            labelWidth: 50,
                            width: 170,
                            fieldLabel: 'After',
                            xtype: 'datefield',
                            value: new Date()
                        },
                        {
                            xtype: 'combo',
                            width: 170,
                            fieldLabel: 'Has A Receipt',
                            emptyText: 'Select',
                            store: new Ext.data.ArrayStore({
                                fields: ['sample'],
                                data: [
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'sample',
                            valueField: 'sample'
                        },
                        {
                            xtype: 'combo',
                            width: 170,
                            fieldLabel: 'Unreported Expenses',
                            emptyText: 'Select',
                            store: new Ext.data.ArrayStore({
                                fields: ['sample'],
                                data: [
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'sample',
                            valueField: 'sample'
                        },
                        {
                            xtype: 'combo',
                            width: 170,
                            fieldLabel: 'All Categories',
                            emptyText: 'Select',
                            store: new Ext.data.ArrayStore({
                                fields: ['sample'],
                                data: [
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'sample',
                            valueField: 'sample'
                        },
                        {
                            xtype: 'combo',
                            width: 170,
                            fieldLabel: 'All Tags',
                            emptyText: 'Select',
                            store: new Ext.data.ArrayStore({
                                fields: ['sample'],
                                data: [
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'sample',
                            valueField: 'sample'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    items:[
                        {
                            xtype:'button',
                            width: 100,
                            text: 'Go!',
                            style:{
                                marginRight: '10px'
                            }
                        },
                        {
                            xtype:'button',
                            width: 100,
                            text: 'Reset'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'tasksgridpanel',
            title: '',
            frame: false,
            split: true,
            region: 'center',
            itemId: 'tasksGridPanel'
        }
    ]
})