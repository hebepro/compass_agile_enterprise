Compass.ErpApp.Desktop.Applications.Knitkit.addSectionOptions = function (self, items, record) {

    items.push({
        text: 'Add Article',
        iconCls: 'icon-document',
        listeners: {
            'click': function () {

                var addFormItems = [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Title',
                        allowBlank: false,
                        name: 'title'
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Display title?',
                        name: 'display_title',
                        columns: 2,
                        items: [
                            {
                                boxLabel: 'Yes',
                                name: 'display_title',
                                inputValue: 'yes',
                                checked: true
                            },

                            {
                                boxLabel: 'No',
                                name: 'display_title',
                                inputValue: 'no'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Internal ID',
                        allowBlank: true,
                        name: 'internal_identifier'
                    }
                ];

                var addArticleWindow = new Ext.Window({
                    layout: 'fit',
                    modal: true,
                    width: 375,
                    title: 'Create New Article',
                    plain: true,
                    buttonAlign: 'center',
                    items: new Ext.FormPanel({
                        labelWidth: 110,
                        frame: false,
                        bodyStyle: 'padding:5px 5px 0',
                        width: 425,
                        url: '/knitkit/erp_app/desktop/articles/new/' + record.data.id.split('_')[1],
                        defaults: {
                            width: 300
                        },
                        items: addFormItems
                    }),
                    buttons: [
                        {
                            text: 'Submit',
                            listeners: {
                                'click': function (button) {
                                    var window = button.findParentByType('window');
                                    var formPanel = window.query('form')[0];

                                    formPanel.getForm().submit({
                                        reset: true,
                                        success: function (form, action) {

                                            var obj = Ext.decode(action.response.responseText);
                                            if (obj.success) {

                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.success) {
                                                    //debugger;
                                                    var childNode = {
                                                        id: obj.node.id,
                                                        text: obj.node.text,
                                                        objectType: obj.node.objectType,
                                                        parentItemId: obj.node.parentItemId,
                                                        siteId: obj.node.siteId,
                                                        iconCls: obj.node.iconCls,
                                                        leaf: true
                                                    }
                                                    record.appendChild(childNode);
                                                }
                                            }
                                            else {
                                                Ext.Msg.alert("Error", obj.msg);
                                            }
                                            addArticleWindow.close();
                                        },
                                        failure: function (form, action) {
                                            Ext.Msg.alert("Error", "Error creating article");
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text: 'Close',
                            handler: function () {
                                addArticleWindow.close();
                            }
                        }
                    ]
                });
                addArticleWindow.show();
            }
        }
    });

    if (currentUser.hasCapability('unsecure', 'WebsiteSection') || currentUser.hasCapability('secure', 'WebsiteSection')) {
        items.push({
            text: 'Security',
            iconCls: 'icon-document_lock',
            listeners: {
                'click': function () {
                    var westRegion = Ext.getCmp('knitkitWestRegion');
                    westRegion.changeSecurity(record, '/knitkit/erp_app/desktop/section/update_security', record.data.id.split('_')[1]);
                }
            }
        });
    }

    if (currentUser.hasCapability('create', 'WebsiteSection') && !record.get('isBlog')) {
        items.push({
            text: 'Add Section',
            iconCls: 'icon-add',
            listeners: {
                'click': function () {
                    var addSectionWindow = Ext.create("Ext.window.Window", {
                        modal: true,
                        layout: 'fit',
                        width: 375,
                        title: 'New Section',
                        plain: true,
                        buttonAlign: 'center',
                        items: new Ext.FormPanel({
                            labelWidth: 110,
                            frame: false,
                            bodyStyle: 'padding:5px 5px 0',
                            url: '/knitkit/erp_app/desktop/section/new',
                            defaults: {
                                width: 225
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Title',
                                    allowBlank: false,
                                    name: 'title'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Internal ID',
                                    allowBlank: true,
                                    name: 'internal_identifier'
                                },
                                {
                                    xtype: 'combo',
                                    forceSelection: true,
                                    store: [
                                        ['Page', 'Page'],
                                        ['Blog', 'Blog']
                                    ],
                                    value: 'Page',
                                    fieldLabel: 'Type',
                                    name: 'type',
                                    allowBlank: false,
                                    triggerAction: 'all'
                                },
                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: 'Display in menu?',
                                    name: 'in_menu',
                                    columns: 2,
                                    items: [
                                        {
                                            boxLabel: 'Yes',
                                            name: 'in_menu',
                                            inputValue: 'yes',
                                            checked: true
                                        },

                                        {
                                            boxLabel: 'No',
                                            name: 'in_menu',
                                            inputValue: 'no'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: 'Render with Base Layout?',
                                    name: 'render_with_base_layout',
                                    columns: 2,
                                    items: [
                                        {
                                            boxLabel: 'Yes',
                                            name: 'render_with_base_layout',
                                            inputValue: 'yes',
                                            checked: true
                                        },

                                        {
                                            boxLabel: 'No',
                                            name: 'render_with_base_layout',
                                            inputValue: 'no'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'website_section_id',
                                    value: record.data.id.split('_')[1]
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'website_id',
                                    value: record.data.siteId
                                }
                            ]
                        }),
                        buttons: [
                            {
                                text: 'Submit',
                                listeners: {
                                    'click': function (button) {
                                        var window = button.findParentByType('window');
                                        var formPanel = window.query('.form')[0];
                                        //self.setWindowStatus('Creating section...');
                                        formPanel.getForm().submit({
                                            reset: true,
                                            success: function (form, action) {
                                                //self.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.success) {
                                                    record.appendChild(obj.node);
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                            },
                                            failure: function (form, action) {
                                                //self.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.message) {
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", "Error creating section.");
                                                }
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text: 'Close',
                                handler: function () {
                                    addSectionWindow.close();
                                }
                            }
                        ]
                    });
                    addSectionWindow.show();
                }
            }
        });
    }

    if (currentUser.hasCapability('edit', 'WebsiteSection')) {
        items.push({
            text: 'Update ' + record.data["type"],
            iconCls: 'icon-edit',
            listeners: {
                'click': function () {
                    var updateSectionWindow = Ext.create("Ext.window.Window", {
                        layout: 'fit',
                        modal: true,
                        width: 375,
                        title: 'Update Section',
                        plain: true,
                        buttonAlign: 'center',
                        items: new Ext.FormPanel({
                            labelWidth: 110,
                            frame: false,
                            bodyStyle: 'padding:5px 5px 0',
                            url: '/knitkit/erp_app/desktop/section/update',
                            defaults: {
                                width: 375
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Title',
                                    width: 320,
                                    value: record.data.text,
                                    name: 'title'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Internal ID',
                                    width: 320,
                                    allowBlank: true,
                                    name: 'internal_identifier',
                                    value: record.data.internal_identifier
                                },
                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: 'Display in menu?',
                                    width: 220,
                                    name: 'in_menu',
                                    columns: 2,
                                    items: [
                                        {
                                            boxLabel: 'Yes',
                                            name: 'in_menu',
                                            inputValue: 'yes',
                                            checked: record.data.inMenu
                                        },

                                        {
                                            boxLabel: 'No',
                                            name: 'in_menu',
                                            inputValue: 'no',
                                            checked: !record.data.inMenu
                                        }
                                    ]
                                },
                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: 'Render with Base Layout?',
                                    width: 220,
                                    name: 'render_with_base_layout',
                                    columns: 2,
                                    items: [
                                        {
                                            boxLabel: 'Yes',
                                            name: 'render_with_base_layout',
                                            inputValue: 'yes',
                                            checked: record.data.renderWithBaseLayout
                                        },

                                        {
                                            boxLabel: 'No',
                                            name: 'render_with_base_layout',
                                            inputValue: 'no',
                                            checked: !record.data.renderWithBaseLayout
                                        }
                                    ]
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Path',
                                    width: 320,
                                    name: 'path',
                                    value: record.data.path
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'id',
                                    value: record.data.id.split('_')[1]
                                }
                            ]
                        }),
                        buttons: [
                            {
                                text: 'Submit',
                                listeners: {
                                    'click': function (button) {
                                        var window = button.findParentByType('window');
                                        var formPanel = window.query('.form')[0];
                                        //self.setWindowStatus('Updating section...');
                                        formPanel.getForm().submit({
                                            success: function (form, action) {
                                                //self.clearWindowStatus();
                                                var values = formPanel.getValues();
                                                record.set('title', values.title);
                                                record.set('text', values.title);
                                                record.set('internal_identifier', values.internal_identifier);
                                                record.set("inMenu", (values.in_menu == 'yes'));
                                                record.set("renderWithBaseLayout", (values.render_with_base_layout == 'yes'));
                                                record.commit();
                                                updateSectionWindow.close();
                                            },
                                            failure: function (form, action) {
                                                //self.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                Ext.Msg.alert("Error", obj.msg);
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text: 'Close',
                                handler: function () {
                                    updateSectionWindow.close();
                                }
                            }
                        ]
                    });
                    updateSectionWindow.show();
                }
            }
        });
    }

    //no layouts for blogs.
    if (Compass.ErpApp.Utility.isBlank(record.data['isBlog']) && record.data['hasLayout']) {
        if (currentUser.hasCapability('edit', 'WebsiteSectionLayout')) {
            items.push({
                text: 'Edit Layout',
                iconCls: 'icon-edit',
                listeners: {
                    'click': function () {
                        var sectionPanel = Ext.ComponentQuery.query('#knitkitSiteContentsTreePanel').first();
                        sectionPanel.editSectionLayout(record.data.text, record.data.id.split('_')[1], record.data.siteId);
                    }
                }
            });
        }
    }
    else if (Compass.ErpApp.Utility.isBlank(record.data['isBlog'])) {
        if (currentUser.hasCapability('create', 'WebsiteSectionLayout')) {
            items.push({
                text: 'Add Layout',
                iconCls: 'icon-add',
                listeners: {
                    'click': function () {
                        var sectionId = record.data.id.split('_')[1];
                        Ext.Ajax.request({
                            url: '/knitkit/erp_app/desktop/section/add_layout',
                            method: 'POST',
                            params: {
                                id: sectionId
                            },
                            success: function (response) {
                                var obj = Ext.decode(response.responseText);
                                if (obj.success) {
                                    record.data.hasLayout = true;
                                    
									var sectionPanel = Ext.ComponentQuery.query('#knitkitSiteContentsTreePanel').first();
									sectionPanel.editSectionLayout(record.data.text, sectionId, record.data.siteId);
                                }
                                else {
                                    Ext.Msg.alert('Status', obj.message);
                                }
                            },
                            failure: function (response) {
                                Ext.Msg.alert('Status', 'Error adding layout.');
                            }
                        });
                    }
                }
            });
        }
    }

    if (currentUser.hasCapability('delete', 'WebsiteSection')) {
        items.push({
            text: 'Delete ' + record.data["type"],
            iconCls: 'icon-delete',
            listeners: {
                'click': function () {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this section?<br> NOTE: Articles belonging to this section will be orphaned.<br><br>', function (btn) {
                        if (btn == 'no') {
                            return false;
                        }
                        else if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: '/knitkit/erp_app/desktop/section/delete',
                                method: 'POST',
                                params: {
                                    id: record.data.id.split('_')[1]
                                },
                                success: function (response) {

                                    var obj = Ext.decode(response.responseText);
                                    if (obj.success) {
                                        record.remove();
                                    }
                                    else {
                                        Ext.Msg.alert('Error', 'Error deleting section');
                                    }
                                },
                                failure: function (response) {
                                    Ext.Msg.alert('Error', 'Error deleting section');
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    return items;
};