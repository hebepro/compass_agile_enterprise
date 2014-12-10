Compass.ErpApp.Desktop.Applications.Knitkit.addDocumentOptions = function (self, items, record) {
    var sectionId = record.get('recordId');
    var websiteId = compassDesktop.getModule('knitkit-win').currentWebsite.id;

    // Update security
    if (currentUser.hasCapability('unsecure', 'WebsiteSection') || currentUser.hasCapability('secure', 'WebsiteSection')) {
        items.push({
            text: 'Security',
            iconCls: 'icon-document_lock',
            listeners: {
                'click': function () {
                    var westRegion = Ext.getCmp('knitkitWestRegion');
                    westRegion.changeSecurity(record, '/knitkit/erp_app/desktop/section/update_security', record.get('recordId'));
                }
            }
        });
    }

    // Create Document Section
    if (currentUser.hasCapability('create', 'WebsiteSection')) {
        items.push({
            text: 'Add Document',
            iconCls: 'icon-add',
            listeners: {
                'click': function () {
                    var addSectionWindow = Ext.create("Ext.window.Window", {
                        layout: 'fit',
                        width: 375,
                        title: 'New Document Section',
                        plain: true,
                        buttonAlign: 'center',
                        items: {
                            xtype: 'form',
                            labelWidth: 110,
                            frame: false,
                            bodyStyle: 'padding:5px 5px 0',
                            url: '/knitkit/erp_app/desktop/online_document_sections',
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
                                        ['OnlineDocumentSection', 'Online Document Section']
                                    ],
                                    value: 'OnlineDocumentSection',
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
                                    xtype: 'hidden',
                                    name: 'website_section_id',
                                    value: record.get('recordId')
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'website_id',
                                    value: record.data.siteId
                                }
                            ]
                        },
                        buttons: [
                            {
                                text: 'Submit',
                                listeners: {
                                    'click': function (button) {
                                        var window = button.findParentByType('window');
                                        var formPanel = window.down('form');
                                        formPanel.getForm().submit({
                                            method: 'post',
                                            reset: true,
                                            waitMsg: 'Creating document section...',
                                            success: function (form, action) {
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.success) {
                                                    record.appendChild(obj.node);

                                                    var centerRegion = Ext.getCmp('knitkitCenterRegion');
                                                    centerRegion.editContent(obj.documented_content.title, obj.documented_content.id, obj.documented_content.body_html, record.data.siteId, 'article');
                                                    window.close();
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                            },
                                            failure: function (form, action) {
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.message) {
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", "Error creating document.");
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

    // Edit Document Section
    if (currentUser.hasCapability('edit', 'WebsiteSection')) {
        var contentInfo = record.data['contentInfo'];

        items.push({
            text: 'Update Document',
            iconCls: 'icon-edit',
            listeners: {
                'click': function () {
                    var updateSectionWindow = Ext.create("Ext.window.Window", {
                        layout: 'fit',
                        width: 375,
                        title: 'Update Document Section',
                        plain: true,
                        buttonAlign: 'center',
                        items: new Ext.FormPanel({
                            labelWidth: 110,
                            frame: false,
                            bodyStyle: 'padding:5px 5px 0',
                            url: '/knitkit/erp_app/desktop/section/update',
                            defaults: {
                                width: 225
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Title',
                                    value: record.data.text,
                                    name: 'title'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Internal ID',
                                    allowBlank: true,
                                    name: 'internal_identifier',
                                    value: record.data.internal_identifier
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
                                    fieldLabel: 'Use markdown?',
                                    name: 'use_markdown',
                                    columns: 2,
                                    items: [
                                        {
                                            boxLabel: 'Yes',
                                            name: 'use_markdown',
                                            inputValue: 'yes',
                                            checked: record.data.useMarkdown
                                        },

                                        {
                                            boxLabel: 'No',
                                            name: 'use_markdown',
                                            inputValue: 'no',
                                            checked: !record.data.useMarkdown
                                        }
                                    ]
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'id',
                                    value: record.get('recordId')
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
                                        formPanel.getForm().submit({
                                            waitMsg: 'Updating document section...',
                                            success: function (form, action) {
                                                var values = formPanel.getValues();

                                                record.set('text', values.title);
                                                record.set('internal_identifier', values.internal_identifier);
                                                record.set("inMenu", (values.in_menu == 'yes'));
                                                record.set("useMarkdown", (values.use_markdown == 'yes'));
                                                record.commit();
                                                updateSectionWindow.close();
                                            },
                                            failure: function (form, action) {
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

    // Copy Document Section
    items.push({
        text: 'Copy Document',
        iconCls: 'icon-copy',
        listeners: {
            'click': function () {
                Ext.widget("window", {
                    layout: 'fit',
                    modal: true,
                    title: 'Copy Document',
                    plain: true,
                    buttonAlign: 'center',
                    items: {
                        xtype: 'form',
                        labelWidth: 110,
                        frame: false,
                        bodyStyle: 'padding:5px 5px 0',
                        url: '/knitkit/erp_app/desktop/online_document_sections/copy',
                        defaults: {
                            width: 375
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'parent_section_id',
                                width: 320,
                                loadingText: 'Retrieving Sections...',
                                store: Ext.create("Ext.data.Store", {
                                    proxy: {
                                        type: 'ajax',
                                        url: '/knitkit/erp_app/desktop/online_document_sections/existing_documents',
                                        reader: {
                                            type: 'json'
                                        },
                                        extraParams: {
                                            website_id: websiteId
                                        }
                                    },
                                    autoLoad: true,
                                    fields: [
                                        {
                                            name: 'id'
                                        },
                                        {
                                            name: 'title_permalink'

                                        }
                                    ]
                                }),
                                forceSelection: true,
                                allowBlank: true,
                                fieldLabel: 'Parent Document',
                                mode: 'local',
                                displayField: 'title_permalink',
                                valueField: 'id',
                                triggerAction: 'all'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Title',
                                width: 320,
                                value: record.data.text,
                                name: 'title'
                            },
                            {
                                xtype: 'hidden',
                                name: 'id',
                                value: sectionId
                            },
                            {
                                xtype: 'hidden',
                                name: 'website_id',
                                value: websiteId
                            }
                        ]
                    },
                    buttons: [
                        {
                            text: 'Submit',
                            listeners: {
                                'click': function (button) {
                                    var window = button.findParentByType('window');
                                    var formPanel = window.query('.form')[0];

                                    formPanel.getForm().submit({
                                        waitMsg: 'Copying document section...',
                                        success: function (form, action) {
                                            var obj = Ext.decode(action.response.responseText);
                                            var values = formPanel.getValues();
                                            var parentNode = record.getOwnerTree().getRootNode();

                                            if (!Ext.isEmpty(values.parent_section_id)) {
                                                parentNode = parentNode.findChildBy(function (node) {
                                                    if (node.get('recordType') == 'WebsiteSection'
                                                        && node.get('recordId') == values.parent_section_id) {
                                                        return true;
                                                    }
                                                }, this, true);
                                            }

                                            if (parentNode && parentNode != record.getOwnerTree().getRootNode()){
                                                record.getOwnerTree().getStore().load({node: parentNode});
                                            }

                                            window.close();
                                        },
                                        failure: function (form, action) {
                                            var obj = Ext.decode(action.response.responseText);
                                            Ext.Msg.alert("Error", obj.message);
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
                    ]
                }).show();
            }
        }
    });

    // Delete Document Section
    if (currentUser.hasCapability('delete', 'WebsiteSection')) {
        items.push({
            text: 'Delete Document Section',
            iconCls: 'icon-delete',
            listeners: {
                'click': function () {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this document section?', function (btn) {
                        if (btn == 'no') {
                            return false;
                        }
                        else if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: '/knitkit/erp_app/desktop/section/delete',
                                method: 'POST',
                                params: {
                                    id: sectionId
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

                    record.remove();
                }
            }
        });
    }

    return items;
};