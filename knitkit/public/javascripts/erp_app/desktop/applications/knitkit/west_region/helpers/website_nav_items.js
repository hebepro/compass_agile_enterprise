Compass.ErpApp.Desktop.Applications.Knitkit.addWebsiteNavItemOptions = function (self, items, record) {
    var websiteId = compassDesktop.getModule('knitkit-win').currentWebsite.id;

    if (currentUser.hasCapability('edit', 'WebsiteNavItem')) {
        items.push({
            text: 'Update Menu Item',
            iconCls: 'icon-edit',
            handler: function (btn) {
                Ext.create("Ext.window.Window", {
                    layout: 'fit',
                    width: 375,
                    title: 'Update Menu Item',
                    height: 175,
                    plain: true,
                    buttonAlign: 'center',
                    items: Ext.create('Ext.form.Panel', {
                        labelWidth: 50,
                        frame: false,
                        bodyStyle: 'padding:5px 5px 0',
                        url: '/knitkit/erp_app/desktop/website_nav_item/' + record.data.websiteNavItemId,
                        defaults: {
                            width: 375
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Title',
                                width: 320,
                                value: record.data.text,
                                allowBlank: false,
                                name: 'title'
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: 'Link to',
                                width: 320,
                                name: 'link_to',
                                id: 'knitkit_nav_item_link_to',
                                allowBlank: false,
                                forceSelection: true,
                                editable: false,
                                autoSelect: true,
                                typeAhead: false,
                                mode: 'local',
                                triggerAction: 'all',
                                store: [
                                    ['website_section', 'Section'],
                                    ['url', 'Url']

                                ],
                                value: record.data.linkToType,
                                listeners: {
                                    'change': function (combo, newValue, oldValue) {
                                        switch (newValue) {
                                            case 'website_section':
                                                Ext.getCmp('knitkit_website_nav_item_section').show();
                                                Ext.getCmp('knitkit_website_nav_item_url').hide();
                                                break;
                                            case 'article':
                                                Ext.getCmp('knitkit_website_nav_item_section').hide();
                                                Ext.getCmp('knitkit_website_nav_item_url').hide();
                                                break;
                                            case 'url':
                                                Ext.getCmp('knitkit_website_nav_item_section').hide();
                                                Ext.getCmp('knitkit_website_nav_item_url').show();
                                                break;
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'combo',
                                width: 320,
                                itemId: 'knitkit_website_nav_item_section',
                                hiddenName: 'website_section_id',
                                name: 'website_section_id',
                                loadingText: 'Retrieving Sections...',
                                store: Ext.create("Ext.data.Store", {
                                    proxy: {
                                        type: 'ajax',
                                        url: '/knitkit/erp_app/desktop/section/existing_sections',
                                        reader: {
                                            type: 'json'
                                        },
                                        extraParams: {
                                            website_id: websiteId
                                        }
                                    },
                                    fields: [
                                        {
                                            name: 'id',
                                            type: 'integer'
                                        },
                                        {
                                            name: 'title_permalink',
                                            type: 'string'
                                        }
                                    ]
                                }),
                                editable: false,
                                fieldLabel: 'Section',
                                typeAhead: false,
                                queryMode: 'local',
                                displayField: 'title_permalink',
                                valueField: 'id',
                                hidden: (record.data.linkToType != 'website_section' && record.data.linkToType != 'article')
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Url',
                                value: record.data.url,
                                id: 'knitkit_website_nav_item_url',
                                hidden: (record.data.linkToType == 'website_section' || record.data.linkToType == 'article'),
                                name: 'url'
                            }
                        ]
                    }),
                    buttons: [
                        {
                            text: 'Submit',
                            listeners: {
                                'click': function (button) {
                                    var window = button.findParentByType('window'),
                                        formPanel = window.query('form')[0];

                                    formPanel.getForm().submit({
                                        waitMsg: 'Please wait...',
                                        method: 'PUT',
                                        success: function (form, action) {
                                            var obj = Ext.decode(action.response.responseText);
                                            if (obj.success) {
                                                record.set('linkedToId', parseInt(obj.linkedToId));
                                                record.set('linkToType', obj.linkToType);
                                                record.set('url', obj.url);
                                                record.set('text', obj.title);
                                                window.close();
                                            }
                                            else {
                                                Ext.Msg.alert("Error", obj.msg);
                                            }
                                        },
                                        failure: function (form, action) {
                                            if (action.response === null) {
                                                Ext.Msg.alert("Error", 'Could not create menu item');
                                            }
                                            else {
                                                var obj = Ext.decode(action.response.responseText);
                                                Ext.Msg.alert("Error", obj.msg);
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text: 'Close',
                            handler: function (btn) {
                                btn.up('window').close();
                            }
                        }
                    ],
                    listeners: {
                        show: function () {
                            var select = this.down('#knitkit_website_nav_item_section');
                            select.getStore().load({
                                callback: function () {
                                    select.setValue(record.get('linkedToId'));
                                }
                            });
                        }
                    }
                }).show();
            }
        });
    }

    if (currentUser.hasCapability('unsecure', 'WebsiteNavItem') || currentUser.hasCapability('secure', 'WebsiteNavItem')) {
        items.push({
            text: 'Security',
            iconCls: 'icon-document_lock',
            listeners: {
                'click': function () {
                    var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first();

                    westRegion.changeSecurity(record, '/knitkit/erp_app/desktop/website_nav_item/' + record.data.websiteNavItemId + '/update_security', '');
                }
            }
        });
    }

    if (currentUser.hasCapability('delete', 'WebsiteNavItem')) {
        items.push({
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: function (btn) {
                Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this menu item?', function (btn) {
                    if (btn == 'no') {
                        return false;
                    }
                    else if (btn == 'yes') {
                        Ext.Ajax.request({
                            url: '/knitkit/erp_app/desktop/website_nav_item/' + record.get('websiteNavItemId'),
                            method: 'DELETE',
                            success: function (response) {
                                var obj = Ext.decode(response.responseText);
                                if (obj.success) {
                                    record.remove();
                                }
                                else {
                                    Ext.Msg.alert('Error', 'Error deleting menu item');
                                }
                            },
                            failure: function (response) {
                                Ext.Msg.alert('Error', 'Error deleting menu item');
                            }
                        });
                    }
                });
            }
        });
    }

    return items;
};
