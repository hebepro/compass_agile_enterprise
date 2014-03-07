// Website
Compass.ErpApp.Desktop.Applications.Knitkit.websiteMenu = function () {
    return {
        text: 'Websites',
        iconCls: 'icon-globe',
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
                            plain: true,
                            buttonAlign: 'center',
                            items: Ext.create('widget.form', {
                                labelWidth: 110,
                                frame: false,
                                bodyStyle: 'padding:5px 5px 0',
                                url: '/knitkit/erp_app/desktop/site/new',
                                defaults: {
                                    width: 360
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Name *',
                                        width: 320,
                                        allowBlank: false,
                                        name: 'name'
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Host *',
                                        width: 320,
                                        allowBlank: false,
                                        name: 'host'
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Title *',
                                        width: 320,
                                        allowBlank: false,
                                        name: 'title'
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Sub Title',
                                        width: 320,
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
                    iconCls: 'icon-globe',
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
                {
                    text: 'Export Website',
                    iconCls: 'icon-gear',
                    itemId: 'exportWebsiteMenuItem',
                    disabled: true,
                    handler: function () {
                        var knitkitWin = compassDesktop.getModule('knitkit-win'),
                            websiteId = knitkitWin.currentWebsite.id;

                        window.open('/knitkit/erp_app/desktop/site/export?website_id=' + websiteId, '_blank');
                    }
                },
                {
                    text: 'Configure Website',
                    iconCls: 'icon-gear',
                    itemId: 'configureWebsiteMenuItem',
                    disabled: true,
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
                },
                {
                    text: 'Website Publications',
                    itemId: 'websitePublicationsMenuItem',
                    disabled: true,
                    iconCls: 'icon-history',
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
                },
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
}

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
}

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
}

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
}

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
            plain: true,
            buttonAlign: 'center',
            items: Ext.create('widget.form', {
                labelWidth: 110,
                frame: false,
                bodyStyle: 'padding:5px 5px 0',
                fileUpload: true,
                url: '/knitkit/erp_app/desktop/theme/new',
                defaults: {
                    width: 225
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'website_id',
                        value: websiteId
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Name',
                        allowBlank: false,
                        name: 'name'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Theme ID',
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
    iconCls: 'icon-upload',
    handler: function (btn) {
        var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first(),
            themesTreePanel = westRegion.down('#themesTreePanel'),
            knitkitWin = compassDesktop.getModule('knitkit-win'),
            websiteId = knitkitWin.currentWebsite.id;

        Ext.create("Ext.window.Window", {
            layout: 'fit',
            width: 375,
            title: 'New Theme',
            plain: true,
            buttonAlign: 'center',
            items: Ext.create('widget.form', {
                labelWidth: 110,
                frame: false,
                bodyStyle: 'padding:5px 5px 0',
                fileUpload: true,
                url: '/knitkit/erp_app/desktop/theme/new',
                defaults: {
                    width: 225
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'site_id',
                        value: websiteId
                    },
                    {
                        xtype: 'fileuploadfield',
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
    var themeWidget = function () {
        var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first(),
            themesTreePanel = westRegion.down('#themesTreePanel'),
            knitkitWin = compassDesktop.getModule('knitkit-win'),
            websiteId = knitkitWin.currentWebsite.id;

        var themesJsonStore = Ext.create("Ext.data.Store", {
            autoLoad: false,
            proxy: {
                url: '/knitkit/erp_app/desktop/theme/available_themes',
                type: 'ajax',
                params: {
                    site_id: websiteId
                },
                reader: {
                    type: 'json',
                    root: 'themes'
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

        var widgetsJsonStore = Ext.create("Ext.data.Store", {
            proxy: {
                url: '/knitkit/erp_app/desktop/theme/available_widgets',
                type: 'ajax',
                reader: {
                    type: 'json',
                    root: 'widgets'
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

        Ext.create("Ext.window.Window", {
            layout: 'fit',
            width: 375,
            title: 'Theme Widget',
            plain: true,
            buttonAlign: 'center',
            items: Ext.create('widget.form', {
                labelWidth: 110,
                frame: false,
                bodyStyle: 'padding:5px 5px 0',
                fileUpload: true,
                url: '/knitkit/erp_app/desktop/theme/theme_widget',
                defaults: {
                    width: 300
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'site_id',
                        value: websiteId
                    },
                    {
                        xtype: 'combo',
                        hiddenName: 'theme_id',
                        name: 'theme_id',
                        store: themesJsonStore,
                        forceSelection: true,
                        editable: false,
                        fieldLabel: 'Theme',
                        emptyText: 'Select Theme...',
                        typeAhead: false,
                        mode: 'remote',
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false,
                        listeners: {
                            'select': function (combo, records, opts) {
                                this.next().enable();
                                widgetsJsonStore.setExtraParam("theme_id", records[0].get("id"));
                                widgetsJsonStore.load();
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        hiddenName: 'widget_id',
                        name: 'widget_id',
                        store: widgetsJsonStore,
                        forceSelection: true,
                        editable: false,
                        disabled: true,
                        fieldLabel: 'Widget',
                        emptyText: 'Select Widget...',
                        typeAhead: false,
                        mode: 'remote',
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false
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
                                    waitMsg: 'Generating layout files for widget...',
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
                                        Ext.Msg.alert("Error", "Error generating layouts");
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

    return {
        text: 'Themes',
        iconCls: 'icon-picture',
        disabled: true,
        itemId: 'themeMenuItem',
        menu: {
            xtype: 'menu',
            items: [
                Compass.ErpApp.Desktop.Applications.Knitkit.newThemeMenuItem,
                Compass.ErpApp.Desktop.Applications.Knitkit.uploadThemeMenuItem,
                {
                    text: 'Theme Widget',
                    iconCls: 'icon-picture',
                    handler: function (btn) {
                        themeWidget();
                    }
                }
            ]
        }
    }
}

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
        iconCls: 'icon-index',
        itemId: 'navigationMenuItem',
        disabled: true,
        menu: {
            xtype: 'menu',
            items: [
                Compass.ErpApp.Desktop.Applications.Knitkit.newNavigationMenuItem
            ]
        }
    }
}

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
}