Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.WestRegion", {
    extend: "Ext.panel.Panel",
    id: 'knitkitWestRegion',
    alias: 'widget.knitkit_westregion',
    layout: 'accordion',

    setWindowStatus: function (status) {
        this.findParentByType('statuswindow').setStatus(status);
    },

    clearWindowStatus: function () {
        this.findParentByType('statuswindow').clearStatus();
    },

    publish: function (node) {
        var self = this;
        var publishWindow = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.PublishWindow', {
            baseParams: {
                id: node.id.split('_')[1]
            },
            url: '/knitkit/erp_app/desktop/site/publish',
            listeners: {
                'publish_success': function (window, response) {
                    if (response.success) {
                        self.getPublications(node);
                    }
                    else {
                        Ext.Msg.alert('Error', 'Error publishing Website');
                    }
                },
                'publish_failure': function (window, response) {
                    Ext.Msg.alert('Error', 'Error publishing Website');
                }
            }
        });

        publishWindow.show();
    },

    changeSecurity: function (node, updateUrl, id) {
        Ext.Ajax.request({
            url: '/knitkit/erp_app/desktop/available_roles',
            method: 'POST',
            success: function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    Ext.create('widget.knikit_selectroleswindow', {
                        baseParams: {
                            id: id,
                            site_id: node.get('siteId')
                        },
                        url: updateUrl,
                        currentRoles: node.get('roles'),
                        availableRoles: obj.availableRoles,
                        listeners: {
                            success: function (window, response) {
                                node.set('roles', response.roles);
                                if (response.secured) {
                                    node.set('iconCls', 'icon-section_lock');
                                }
                                else {
                                    if(node.get('isBlog')){
                                        node.set('iconCls', 'icon-blog');
                                    }
                                    else{
                                        node.set('iconCls', 'icon-section');
                                    }
                                }
                                node.set('isSecured', response.secured);
                                node.commit();
                            },
                            failure: function () {
                                Ext.Msg.alert('Error', 'Could not update security');
                            }
                        }
                    }).show();
                }
                else {
                    Ext.Msg.alert('Error', 'Could not load available roles');
                }
            },
            failure: function (response) {
                Ext.Msg.alert('Error', 'Could not load available roles');
            }
        });
    },

    selectWebsite: function (website) {
        var siteContentsPanel = Ext.ComponentQuery.query('#knitkitSiteContentsTreePanel').first();
        siteContentsPanel.selectWebsite(website);

        var themePanel = Ext.ComponentQuery.query('#themesTreePanel').first();
        themePanel.selectWebsite(website);

        var menuPanel = Ext.ComponentQuery.query('#knitkitMenuTreePanel').first();
        menuPanel.selectWebsite(website);

        var hostPanel = Ext.ComponentQuery.query('#knitkitHostListPanel').first();
        hostPanel.selectWebsite(website);
    },

    clearWebsite: function(){
        var siteContentsPanel = Ext.ComponentQuery.query('#knitkitSiteContentsTreePanel').first();
        siteContentsPanel.clearWebsite();

        var themePanel = Ext.ComponentQuery.query('#themesTreePanel').first();
        themePanel.clearWebsite();

        var menuPanel = Ext.ComponentQuery.query('#knitkitMenuTreePanel').first();
        menuPanel.clearWebsite();

        var hostPanel = Ext.ComponentQuery.query('#knitkitHostListPanel').first();
        hostPanel.clearWebsite();
    },

    initComponent: function () {

        var siteContentsPanel = Ext.create('Ext.panel.Panel', {
            title: 'Site Contents',
            autoScroll: true,
            items: [
                {
                    xtype: 'knitkit_sitecontentstreepanel',
                    centerRegion: this.initialConfig['module'].centerRegion,
                    header: false
                }
            ]
        });

        var themesPanel = Ext.create('Ext.panel.Panel', {
            title: 'Visual Theme Files',
            autoScroll: true,
            items: [
                {
                    xtype: 'knitkit_themestreepanel',
                    centerRegion: this.initialConfig['module'].centerRegion,
                    header: false
                }
            ]

        });

        var menuPanel = Ext.create('Ext.panel.Panel', {
            title: 'Menus and Navigation',
            autoScroll: true,
            items: [
                {
                    xtype: 'knitkit_menutreepanel'
                }
            ]
        });

        var configPanel = Ext.create('Ext.panel.Panel', {
            title: 'Hosts',
            autoScroll: true,
            items: [
                {
                    xtype: 'knitkit_hostspanel'
                }
            ]

        });

        this.items = [siteContentsPanel, themesPanel, menuPanel, configPanel];

        this.callParent(arguments);
    },

    constructor: function (config) {
        config = Ext.apply({

            region: 'west',
            split: true,
            width: 300,
            collapsible: true

        }, config);

        this.callParent([config]);
    }
});