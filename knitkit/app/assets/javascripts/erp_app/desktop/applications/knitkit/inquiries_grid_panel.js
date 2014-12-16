Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.InquiriesGridPanel", {
    extend: "Ext.grid.Panel",
    alias: 'widget.knitkit_inquiriesgridpanel',

    websiteId: null,
    listeners: {
        render: function () {
            this.store.load();
        }
    },

    deleteInquiry: function (rec) {
        var self = this;
        Ext.Msg.confirm('Please Confirm', 'Do you want to remove this inquiry?', function (btn) {
            if (btn == 'yes' || btn == 'ok') {
                Ext.getCmp('knitkitCenterRegion').setWindowStatus('Deleting inquiry...');
                Ext.Ajax.request({
                    url: '/knitkit/erp_app/desktop/inquiries/' + rec.get("id"),
                    method: 'DELETE',
                    success: function (response) {
                        var obj = Ext.decode(response.responseText);
                        if (obj.success) {
                            Ext.getCmp('knitkitCenterRegion').clearWindowStatus();
                            self.store.load();
                        }
                        else {
                            Ext.Msg.alert('Error', 'Error deleting inquiry');
                            Ext.getCmp('knitkitCenterRegion').clearWindowStatus();
                        }
                    },
                    failure: function (response) {
                        Ext.getCmp('knitkitCenterRegion').clearWindowStatus();
                        Ext.Msg.alert('Error', 'Error deleting inquiry');
                    }
                });
            }
        });
    },

    initComponent: function () {
        this.store = Ext.create("Ext.data.Store", {
            proxy: {
                type: 'ajax',
                method: 'GET',
                url: '/knitkit/erp_app/desktop/inquiries',
                reader: {
                    type: 'json',
                    root: 'inquiries'
                },
                extraParams: {
                    website_id: this.websiteId
                }
            },
            idProperty: 'id',
            remoteSort: true,
            fields: [
                {
                    name: 'id'
                },
                {
                    name: 'firstName', mapping: 'first_name'
                },
                {
                    name: 'lastName', mapping: 'last_name'
                },
                {
                    name: 'email'
                },
                {
                    name: 'username'
                },
                {
                    name: 'message'
                },
                {
                    name: 'createdAt', mapping: 'created_at', type: 'date'
                }
            ]
        });

        this.columns = [
            {
                header: 'First Name',
                dataIndex: 'firstName',
                flex: 1
            },
            {
                header: 'Last Name',
                dataIndex: 'lastName',
                flex: 1
            },
            {
                header: 'Email',
                dataIndex: 'email',
                flex: 1
            },
            {
                header: 'Username',
                dataIndex: 'username',
                flex: 0.5
            },
            {
                header: 'Created At',
                dataIndex: 'createdAt',
                renderer: Ext.util.Format.dateRenderer('m/d/Y H:i:s'),
                flex: 1
            },
            {
                menuDisabled: true,
                resizable: false,
                xtype: 'actioncolumn',
                header: 'Action',
                align: 'center',
                flex: 0.5,
                items: [
                    {
                        icon: '/images/icons/eye/eye_16x16.png',
                        tooltip: 'View',
                        getClass: function (v, meta, rec) {
                            return 'x-action-col-icon';
                        },
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);

                            Ext.getCmp('knitkitCenterRegion').showComment(rec.get('message'))
                        }
                    },
                    {
                        icon: '/images/icons/delete/delete_16x16.png',
                        tooltip: 'Delete',
                        getClass: function (v, meta, rec) {
                            return 'x-action-col-icon';
                        },
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            grid.ownerCt.deleteInquiry(rec);
                        }
                    }
                ]
            }
        ];

        this.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: this.store,
                dock: 'bottom',
                pageSize: 15,
                title: 'Inquiries',
                displayInfo: true,
                displayMsg: '{0} - {1} of {2}',
                emptyMsg: "Empty"
            }
        ];

        this.callParent();
    }
});
