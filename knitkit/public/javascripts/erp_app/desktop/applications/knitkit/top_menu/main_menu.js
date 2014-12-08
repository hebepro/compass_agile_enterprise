// Website
Compass.ErpApp.Desktop.Applications.Knitkit.editWebsiteMenuItem = function (disabled) {
    return {
        text: 'Edit Website',
        iconCls: 'icon-edit',
        itemId: 'editWebsiteMenuItem',
        disabled: disabled,
        handler: function () {
            var knitkitModule = compassDesktop.getModule('knitkit-win');

            Ext.create("Ext.window.Window", {
                title: 'Update Website',
                plain: true,
                buttonAlign: 'center',
                items: Ext.create("Ext.form.Panel", {
                    labelWidth: 110,
                    frame: false,
                    bodyStyle: 'padding:5px 5px 0',
                    url: '/knitkit/erp_app/desktop/site/update',
                    defaults: {
                        width: 225
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Name',
                            allowBlank: false,
                            name: 'name',
                            value: knitkitModule.currentWebsite.name
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Title',
                            id: 'knitkitUpdateSiteTitle',
                            allowBlank: false,
                            name: 'title',
                            value: knitkitModule.currentWebsite.title
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Sub Title',
                            allowBlank: true,
                            name: 'subtitle',
                            value: knitkitModule.currentWebsite.subtitle

                        },
                        {
                            xtype: 'hidden',
                            name: 'website_id',
                            value: knitkitModule.currentWebsite.id
                        }
                    ]
                }),
                buttons: [
                    {
                        text: 'Submit',
                        listeners: {
                            'click': function (button) {
                                var window = button.findParentByType('window');
                                var formPanel = window.query('form')[0];

                                formPanel.getForm().submit({
                                    waitMsg: 'Please wait...',
                                    success: function (form, action) {
                                        knitkitModule.currentWebsite.name = form.findField('name').getValue();
                                        knitkitModule.currentWebsite.title = form.findField('title').getValue();
                                        knitkitModule.currentWebsite.subtitle = form.findField('subtitle').getValue();

                                        var websiteCombo = compassDesktop.desktop.getWindow('knitkit').down('websitescombo');
                                        websiteCombo.getStore().load({
                                            callback: function () {
                                                websiteCombo.select(knitkitModule.currentWebsite.id);
                                            }
                                        })

                                        window.close();
                                    },
                                    failure: function (form, action) {
                                        Ext.Msg.alert("Error", "Error updating website");
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
};

Compass.ErpApp.Desktop.Applications.Knitkit.exportWebsiteMenuItem = function (disabled) {
    return {
        text: 'Export Website',
        iconCls: 'icon-website-export',
        itemId: 'exportWebsiteMenuItem',
        disabled: disabled,
        handler: function () {
            var knitkitWin = compassDesktop.getModule('knitkit-win'),
                websiteId = knitkitWin.currentWebsite.id;

            window.open('/knitkit/erp_app/desktop/site/export?website_id=' + websiteId, '_blank');
        }
    }
};

Compass.ErpApp.Desktop.Applications.Knitkit.configureWebsiteMenuItem = function (disabled) {
    return {
        text: 'Configure Website',
        iconCls: 'icon-knitkit',
        itemId: 'configureWebsiteMenuItem',
        disabled: disabled,
        handler: function () {
            var knitkitWin = compassDesktop.getModule('knitkit-win'),
                configurationId = knitkitWin.currentWebsite.configurationId;

            Ext.create("Ext.window.Window", {
                layout: 'fit',
                height: 500,
                width: 700,
                modal: true,
                title: 'Configuration',
                autoScroll: true,
                items: [
                    {
                        xtype: 'sharedconfigurationpanel',
                        configurationId: configurationId
                    }
                ]
            }).show();
        }
    }
};

Compass.ErpApp.Desktop.Applications.Knitkit.websitePublicationsMenuItem = function (disabled) {
    return {
        text: 'Website Publications',
        itemId: 'websitePublicationsMenuItem',
        disabled: disabled,
        iconCls: 'icon-website-publications',
        handler: function () {
            var knitkitWin = compassDesktop.getModule('knitkit-win'),
                websiteId = knitkitWin.currentWebsite.id;

            Ext.create("Ext.window.Window", {
                layout: 'fit',
                height: 500,
                width: 800,
                modal: true,
                title: 'Publications',
                autoScroll: true,
                items: [
                    {
                        xtype: 'knitkit_publishedgridpanel',
                        siteId: websiteId
                    }
                ]
            }).show();
        }
    }
};

Compass.ErpApp.Desktop.Applications.Knitkit.websitePublishMenuItem = function (disabled) {
    return {
        text: 'Publish Website',
        itemId: 'publishWebsiteMenuItem',
        disabled: disabled,
        iconCls: 'icon-document_up',
        handler: function () {
            var knitkitWin = compassDesktop.getModule('knitkit-win'),
                websiteId = knitkitWin.currentWebsite.id;

            Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.PublishWindow', {
                baseParams: {
                    website_id: websiteId
                },
                url: '/knitkit/erp_app/desktop/site/publish',
                listeners: {
                    'publish_success': function (window, response) {
                        if (!response.success) {
                            Ext.Msg.alert('Error', 'Error publishing Website');
                        }
                    },
                    'publish_failure': function (window, response) {
                        Ext.Msg.alert('Error', 'Error publishing Website');
                    }
                }
            }).show();
        }
    }
};

Compass.ErpApp.Desktop.Applications.Knitkit.websiteInquiresMenuItem = function (disabled) {
    return {
        text: 'View Inquires',
        itemId: 'websiteInquiresMenuItem',
        disabled: disabled,
        iconCls: 'icon-document',
        handler: function () {
            var knitkitModule = compassDesktop.getModule('knitkit-win')
            knitkitWindow = compassDesktop.desktop.getWindow('knitkit');

            knitkitWindow.down('knitkit_centerregion').viewWebsiteInquiries(knitkitModule.currentWebsite.id, knitkitModule.currentWebsite.name);
        }
    }
};

Compass.ErpApp.Desktop.Applications.Knitkit.websiteMenu = function () {
    return {
        text: 'Websites',
        iconCls: 'icon-website',
        menu: {
            xtype: 'menu',
            items: [
                {
                    text: 'New Website',
                    iconCls: 'icon-add',
                    handler: function (btn) {
                        Ext.create("Ext.window.Window", {
                            modal: true,
                            title: 'New Website',
                            buttonAlign: 'center',
                            width: 360,
                            items: Ext.create('widget.form', {
                                labelWidth: 110,
                                frame: false,
                                bodyStyle: 'padding:5px 5px 0',
                                url: '/knitkit/erp_app/desktop/site/new',
                                defaults: {
                                    width: 320
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Name *',
                                        allowBlank: false,
                                        name: 'name',
                                        plugins: [new helpQtip("This is required and must be unique. Spaces are OK.")]
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Host *',
                                        allowBlank: false,
                                        name: 'host',
                                        plugins: [new helpQtip("If you are running locally, this will probably be localhost:3000.<br> Otherwise, it is the domain or subdomain for this CompassAE instance")]
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Title *',
                                        allowBlank: false,
                                        name: 'title'
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Sub Title',
                                        allowBlank: true,
                                        name: 'subtitle'
                                    }
                                ]
                            }),
                            buttons: [
                                {
                                    text: 'Submit',
                                    listeners: {
                                        'click': function (button) {
                                            var knitkitModule = compassDesktop.getModule('knitkit-win'),
                                                knitkitWindow = compassDesktop.desktop.getWindow('knitkit'),
                                                window = button.findParentByType('window'),
                                                formPanel = window.query('.form')[0];

                                            formPanel.getForm().submit({
                                                waitMsg: 'Please wait...',
                                                success: function (form, action) {
                                                    var obj = Ext.decode(action.response.responseText);
                                                    if (obj.success) {
                                                        var combo = knitkitWindow.down('websitescombo');
                                                        combo.store.load({
                                                            callback: function (records, operation, succes) {
                                                                for (i = 0; i < records.length; i++) {
                                                                    if (records[i].data.id == obj.website.id) {
                                                                        combo.select(records[i]);

                                                                        knitkitModule.selectWebsite(records[i]);
                                                                        window.close();

                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                },
                                                failure: function (form, action) {
                                                    Ext.Msg.alert("Error", "Error creating website");
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
                },
                {
                    text: 'Import Website',
                    iconCls: 'icon-website-import',
                    handler: function (btn) {
                        Ext.create("Ext.window.Window", {
                            modal: true,
                            layout: 'fit',
                            width: 375,
                            title: 'Import Website',
                            height: 120,
                            plain: true,
                            buttonAlign: 'center',
                            items: new Ext.FormPanel({
                                labelWidth: 110,
                                frame: false,
                                fileUpload: true,
                                bodyStyle: 'padding:5px 5px 0',
                                url: '/knitkit/erp_app/desktop/site/import',
                                defaults: {
                                    width: 320
                                },
                                items: [
                                    {
                                        xtype: 'fileuploadfield',
                                        fieldLabel: 'Upload Website',
                                        buttonText: 'Upload',
                                        buttonOnly: false,
                                        allowBlank: false,
                                        name: 'website_data'
                                    }
                                ]
                            }),
                            buttons: [
                                {
                                    text: 'Submit',
                                    listeners: {
                                        'click': function (button) {
                                            var knitkitModule = compassDesktop.getModule('knitkit-win'),
                                                knitkitWindow = compassDesktop.desktop.getWindow('knitkit'),
                                                window = button.findParentByType('window'),
                                                formPanel = window.query('.form')[0];

                                            formPanel.getForm().submit({
                                                waitMsg: 'Please wait...',
                                                success: function (form, action) {
                                                    var obj = Ext.decode(action.response.responseText);
                                                    if (obj.success) {
                                                        var combo = knitkitWindow.down('websitescombo');
                                                        combo.store.load({
                                                            callback: function (records, operation, succes) {
                                                                for (i = 0; i < records.length; i++) {
                                                                    if (records[i].data.id == obj.website.id) {
                                                                        combo.select(records[i]);

                                                                        knitkitModule.selectWebsite(records[i]);
                                                                        window.close();

                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        Ext.Msg.alert("Error", obj.message);
                                                    }
                                                },
                                                failure: function (form, action) {
                                                    var obj = Ext.decode(action.response.responseText);
                                                    if (obj != null) {
                                                        Ext.Msg.alert("Error", obj.message);
                                                    }
                                                    else {
                                                        Ext.Msg.alert("Error", "Error importing website");
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
                            ]
                        }).show();
                    }
                },
                {
                    xtype: 'menuseparator'
                },
                Compass.ErpApp.Desktop.Applications.Knitkit.editWebsiteMenuItem(true),
                Compass.ErpApp.Desktop.Applications.Knitkit.configureWebsiteMenuItem(true),
                Compass.ErpApp.Desktop.Applications.Knitkit.exportWebsiteMenuItem(true),
                Compass.ErpApp.Desktop.Applications.Knitkit.websitePublicationsMenuItem(true),
                Compass.ErpApp.Desktop.Applications.Knitkit.websitePublishMenuItem(true),
                Compass.ErpApp.Desktop.Applications.Knitkit.websiteInquiresMenuItem(true),
                {
                    text: 'Delete Website',
                    itemId: 'deleteWebsiteMenuItem',
                    disabled: true,
                    iconCls: 'icon-delete',
                    handler: function () {
                        var knitkitModule = compassDesktop.getModule('knitkit-win'),
                            knitkitWindow = compassDesktop.desktop.getWindow('knitkit'),
                            websiteId = knitkitModule.currentWebsite.id;

                        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this Website?', function (btn) {
                            if (btn == 'no') {
                                return false;
                            }
                            else if (btn == 'yes') {
                                Ext.Ajax.request({
                                    url: '/knitkit/erp_app/desktop/site/delete',
                                    method: 'POST',
                                    params: {
                                        website_id: websiteId
                                    },
                                    success: function (response) {
                                        var obj = Ext.decode(response.responseText);
                                        if (obj.success) {
                                            var combo = knitkitWindow.down('websitescombo');
                                            combo.store.load({
                                                callback: function (records, operation, succes) {
                                                    if (records.length > 0) {
                                                        combo.select(records.first());

                                                        knitkitModule.selectWebsite(records.first());
                                                    }
                                                    else {
                                                        knitkitModule.clearWebsite()
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            Ext.Msg.alert('Error', 'Error deleting Website');
                                        }
                                    },
                                    failure: function (response) {
                                        Ext.Msg.alert('Error', 'Error deleting Website');
                                    }
                                });
                            }
                        });
                    }
                }
            ]
        }
    }
};

// Articles
Compass.ErpApp.Desktop.Applications.Knitkit.ArticlesMenu = function () {
    return {
        text: 'Articles',
        iconCls: 'icon-documents',
        handler: function () {
            var centerRegion = Ext.getCmp('knitkitCenterRegion');

            Ext.create('widget.window', {
                modal: true,
                title: 'Articles',
                width: 800,
                height: 500,
                layout: 'fit',
                items: [
                    {
                        xtype: 'knitkit_articlesgridpanel',
                        centerRegion: centerRegion
                    }
                ]
            }).show();
        }
    }
};

// New Section
Compass.ErpApp.Desktop.Applications.Knitkit.newSectionMenuItem = {
    text: 'Add Section',
    iconCls: 'icon-add',
    listeners: {
        'click': function () {
            if (currentUser.hasCapability('create', 'WebsiteSection')) {
                var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first(),
                    knitkitSiteContentsTreePanel = westRegion.down('#knitkitSiteContentsTreePanel'),
                    knitkitWin = compassDesktop.getModule('knitkit-win'),
                    websiteId = knitkitWin.currentWebsite.id;

                Ext.create("Ext.window.Window", {
                    model: true,
                    layout: 'fit',
                    title: 'New Section',
                    buttonAlign: 'center',
                    items: Ext.create("Ext.form.Panel", {
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
                                    ['Blog', 'Blog'],
                                    ['OnlineDocumentSection', 'Online Document Section']
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
                                name: 'website_id',
                                value: websiteId
                            }
                        ]
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
                                                knitkitSiteContentsTreePanel.getRootNode().appendChild(obj.node);
                                                window.close();
                                            }
                                            else {
                                                Ext.Msg.alert("Error", obj.msg);
                                            }
                                        },
                                        failure: function (form, action) {
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
                            handler: function (btn) {
                                btn.up('window').close();
                            }
                        }
                    ]
                }).show();
            }
            else {
                Ext.Msg.alert('Error', 'Your do not have permission to perform this action');
            }

        }
    }
};

Compass.ErpApp.Desktop.Applications.Knitkit.SectionsMenu = function () {
    return {
        text: 'Sections / Pages',
        iconCls: 'icon-ia',
        disabled: true,
        itemId: 'sectionsPagesMenuItem',
        menu: {
            xtype: 'menu',
            items: [
                Compass.ErpApp.Desktop.Applications.Knitkit.newSectionMenuItem
            ]
        }
    }
};

// New Theme
Compass.ErpApp.Desktop.Applications.Knitkit.newThemeMenuItem = {
    text: 'New Theme',
    iconCls: 'icon-add',
    handler: function (btn) {
        var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first(),
            themesTreePanel = westRegion.down('#themesTreePanel'),
            knitkitWin = compassDesktop.getModule('knitkit-win'),
            websiteId = knitkitWin.currentWebsite.id;

        Ext.create("Ext.window.Window", {
            layout: 'fit',
            modal: true,
            title: 'New Theme',
            width: 360,
            plain: true,
            buttonAlign: 'center',
            items: Ext.create('widget.form', {
                labelWidth: 110,
                frame: false,
                bodyStyle: 'padding:5px 5px 0',
                fileUpload: true,
                url: '/knitkit/erp_app/desktop/theme/new',
                defaults: {
                    width: 320
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'website_id',
                        value: websiteId
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Name *',
                        allowBlank: false,
                        name: 'name'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Theme ID *',
                        allowBlank: false,
                        name: 'theme_id'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Version',
                        allowBlank: true,
                        name: 'version'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Author',
                        allowBlank: true,
                        name: 'author'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'HomePage',
                        allowBlank: true,
                        name: 'homepage'
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: 'Summary',
                        allowBlank: true,
                        name: 'summary'
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

                            var loading = new Ext.LoadMask(window, {msg: 'Please wait...'});
                            loading.show();

                            formPanel.getForm().submit({
                                reset: true,
                                success: function (form, action) {
                                    loading.hide();
                                    window.close();

                                    var obj = Ext.decode(action.response.responseText);
                                    if (obj.success) {
                                        themesTreePanel.getStore().load({
                                            node: themesTreePanel.getRootNode()
                                        });
                                    }
                                },
                                failure: function (form, action) {
                                    loading.hide();

                                    Ext.Msg.alert("Error", "Error creating theme");
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
};

// Upload Theme
Compass.ErpApp.Desktop.Applications.Knitkit.uploadThemeMenuItem = {
    text: 'Upload',
    iconCls: 'icon-theme-upload',
    handler: function (btn) {
        var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first(),
            themesTreePanel = westRegion.down('#themesTreePanel'),
            knitkitWin = compassDesktop.getModule('knitkit-win'),
            websiteId = knitkitWin.currentWebsite.id;

        Ext.create("Ext.window.Window", {
            modal: true,
            title: 'New Theme',
            buttonAlign: 'center',
            items: Ext.create('widget.form', {
                frame: false,
                bodyStyle: 'padding:5px 5px 0',
                fileUpload: true,
                url: '/knitkit/erp_app/desktop/theme/new',
                items: [
                    {
                        xtype: 'hidden',
                        name: 'website_id',
                        value: websiteId
                    },
                    {
                        xtype: 'fileuploadfield',
						width: '350px',
                        fieldLabel: 'Upload Theme',
                        buttonText: 'Upload',
                        buttonOnly: false,
                        allowBlank: true,
                        name: 'theme_data'
                    }
                ]
            }),
            buttons: [
                {
                    text: 'Submit',
                    listeners: {
                        'click': function (button) {
                            var window = this.up('window'),
                                form = window.query('form')[0].getForm();

                            if (form.isValid()) {
                                form.submit({
                                    waitMsg: 'Creating theme...',
                                    success: function (form, action) {
                                        var obj = Ext.decode(action.response.responseText);
                                        if (obj.success) {
                                            themesTreePanel.getStore().load({
                                                node: themesTreePanel.getRootNode()
                                            });
                                        }
                                        window.close();
                                    },
                                    failure: function (form, action) {
                                        Ext.Msg.alert("Error", "Error creating theme");
                                    }
                                });
                            }
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
};

Compass.ErpApp.Desktop.Applications.Knitkit.ThemeMenu = function () {
    return {
        text: 'Themes',
        iconCls: 'icon-theme',
        disabled: true,
        itemId: 'themeMenuItem',
        menu: {
            xtype: 'menu',
            items: [
                Compass.ErpApp.Desktop.Applications.Knitkit.newThemeMenuItem,
                Compass.ErpApp.Desktop.Applications.Knitkit.uploadThemeMenuItem
            ]
        }
    }
};

// New Navigation / Menu
Compass.ErpApp.Desktop.Applications.Knitkit.newNavigationMenuItem = {
    text: 'New Menu',
    iconCls: 'icon-add',
    handler: function (btn) {
        if (currentUser.hasCapability('create', 'WebsiteNav')) {
            var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first(),
                tree = westRegion.down('#knitkitMenuTreePanel');

            Ext.create("Ext.window.Window", {
                modal: true,
                title: 'New Menu',
                buttonAlign: 'center',
                items: Ext.create("Ext.form.Panel", {
                    labelWidth: 50,
                    frame: false,
                    bodyStyle: 'padding:5px 5px 0',
                    url: '/knitkit/erp_app/desktop/website_nav',
                    defaults: {
                        width: 300
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Menu name: ',
                            width: 320,
                            allowBlank: false,
                            name: 'name'
                        },
                        {
                            xtype: 'hidden',
                            name: 'website_id',
                            itemId: 'websiteId'
                        }
                    ]
                }),
                buttons: [
                    {
                        text: 'Submit',
                        listeners: {
                            'click': function (button) {
                                var window = button.findParentByType('window'),
                                    formPanel = window.query('form')[0],
                                    knitkitWin = compassDesktop.getModule('knitkit-win'),
                                    websiteId = knitkitWin.currentWebsite.id;

                                formPanel.down('#websiteId').setValue(websiteId);

                                formPanel.getForm().submit({
                                    waitMsg: 'Please wait...',
                                    success: function (form, action) {
                                        var obj = Ext.decode(action.response.responseText);
                                        if (obj.success) {
                                            tree.getRootNode().appendChild(obj.node);
                                            window.close();
                                        }
                                        else {
                                            Ext.Msg.alert("Error", obj.msg);
                                        }
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
                        handler: function (btn) {
                            btn.up('window').close();
                        }
                    }
                ]
            }).show();
        }
        else {
            Ext.Msg.alert('Error', 'Your do not have permission to perform this action');
        }
    }
};

Compass.ErpApp.Desktop.Applications.Knitkit.NavigationMenu = function () {
    return {
        text: 'Navigation',
        iconCls: 'icon-menu',
        itemId: 'navigationMenuItem',
        disabled: true,
        menu: {
            xtype: 'menu',
            items: [
                Compass.ErpApp.Desktop.Applications.Knitkit.newNavigationMenuItem
            ]
        }
    }
};

// New Hosts
Compass.ErpApp.Desktop.Applications.Knitkit.newHostMenuItem = {
    text: 'New Host',
    iconCls: 'icon-add',
    handler: function (btn) {
        var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first(),
            tree = westRegion.down('#knitkitHostListPanel'),
            knitkitWin = compassDesktop.getModule('knitkit-win'),
            websiteId = knitkitWin.currentWebsite.id;

        Ext.create("Ext.window.Window", {
            modal: true,
            title: 'Add Host',
            buttonAlign: 'center',
            items: Ext.create("Ext.form.Panel", {
                labelWidth: 50,
                frame: false,
                bodyStyle: 'padding:5px 5px 0',
                url: '/knitkit/erp_app/desktop/website_host',
                defaults: {
                    width: 300
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Host',
                        name: 'host',
                        allowBlank: false
                    },
                    {
                        xtype: 'hidden',
                        name: 'website_id',
                        value: websiteId
                    }
                ]
            }),
            buttons: [
                {
                    text: 'Submit',
                    listeners: {
                        'click': function (button) {
                            var window = button.findParentByType('window');
                            var formPanel = window.query('form')[0];

                            formPanel.getForm().submit({
                                waitMsg: 'Please wait...',
                                success: function (form, action) {
                                    var obj = Ext.decode(action.response.responseText);
                                    if (obj.success) {
                                        window.close();
                                        tree.getRootNode().appendChild(obj.node);
                                    }
                                    else {
                                        Ext.Msg.alert("Error", obj.msg);
                                    }
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert("Error", "Error adding Host");
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
};

Compass.ErpApp.Desktop.Applications.Knitkit.HostsMenu = function () {
    return {
        text: 'Hosts',
        iconCls: 'icon-gear',
        itemId: 'hostsMenuItem',
        disabled: true,
        menu: {
            xtype: 'menu',
            items: [
                Compass.ErpApp.Desktop.Applications.Knitkit.newHostMenuItem
            ]
        }
    }
};


Compass.ErpApp.Desktop.Applications.Knitkit.TemplateMenu = function () {
    return {
        text: 'Templates',
        iconCls: 'icon-website',
        itemId: 'templatesMenuItem',
        menu: {
            xtype: 'menu',
            items: [
                {
                    text: 'Template Import',
                    iconCls: 'icon-website-import',
                    handler: function (btn) {
                        var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first(),
                            themesTreePanel = westRegion.down('#themesTreePanel'),
                            knitkitWin = compassDesktop.getModule('knitkit-win')

                        Ext.create("Ext.window.Window", {
                            modal: true,
                            title: 'Import Template',
                            buttonAlign: 'center',
                            items: Ext.create('widget.form', {
                                frame: false,
                                bodyStyle: 'padding:5px 5px 0',
                                fileUpload: true,
                                url: '/knitkit/erp_app/desktop/site/importtemplate',
                                items: [

                                    {
                                        xtype: 'fileuploadfield',
                                        width: '350px',
                                        fieldLabel: 'Upload Template',
                                        buttonText: 'Upload',
                                        buttonOnly: false,
                                        allowBlank: true,
                                        name: 'website_data'
                                    }
                                ]
                            }),
                            buttons: [
                                {
                                    text: 'Submit',
                                    listeners: {
                                        'click': function (button) {
                                            var knitkitModule = compassDesktop.getModule('knitkit-win'),
                                                knitkitWindow = compassDesktop.desktop.getWindow('knitkit'),
                                                window = button.findParentByType('window'),
                                                formPanel = window.query('.form')[0];

                                            formPanel.getForm().submit({

                                                waitMsg: 'Please wait...',
                                                success: function (form, action) {

                                                    var obj = Ext.decode(action.response.responseText);
                                                    if (obj.success) {
                                                        var combo = knitkitWindow.down('websitescombo');
                                                        combo.store.load({
                                                            callback: function (records, operation, succes) {
                                                                for (i = 0; i < records.length; i++) {
                                                                    if (records[i].data.id == obj.website.id) {
                                                                        combo.select(records[i]);

                                                                        knitkitModule.selectWebsite(records[i]);
                                                                        window.close();

                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        Ext.Msg.alert("Error", obj.message);
                                                    }
                                                },
                                                failure: function (form, action) {
                                                    var obj = Ext.decode(action.response.responseText);
                                                    if (obj != null) {
                                                        Ext.Msg.alert("Error", obj.message);
                                                    }
                                                    else {
                                                        Ext.Msg.alert("Error", "Error importing template");
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
                            ]
                        }).show();
                    }
                },
                {
                    itemId: 'exportTemplateMenuItem',
                    text: 'Export Current Site and Active Theme as Template',
                    disabled: true,
                    iconCls: 'icon-website-export',
                    handler: function () {
                        var knitkitWin = compassDesktop.getModule('knitkit-win'),
                        websiteId = knitkitWin.currentWebsite.id;
                        ifrm = document.createElement("IFRAME");
                        ifrm.setAttribute("src", '/knitkit/erp_app/desktop/site/exporttemplate?website_id=' + websiteId);
                        ifrm.style.width = 0+"px";
                        ifrm.style.height = 0+"px";
                        document.body.appendChild(ifrm);
                    }
                }
            ]
        }
    }
};
