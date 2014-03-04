Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.WestRegion", {
    extend:"Ext.tab.Panel",
    id:'knitkitWestRegion',
    alias:'widget.knitkit_westregion',

    setWindowStatus:function (status) {
        this.findParentByType('statuswindow').setStatus(status);
    },

    clearWindowStatus:function () {
        this.findParentByType('statuswindow').clearStatus();
    },

    getArticles:function (node) {
        this.contentsCardPanel.removeAll(true);
        var xtype = 'knitkit_' + node.data.type.toLowerCase() + 'articlesgridpanel';
        this.contentsCardPanel.add({
            xtype:xtype,
            title:node.data.siteName + ' - ' + node.data.text + ' - Articles',
            sectionId:node.data.id.split('_')[1],
            centerRegion:this.initialConfig['module'].centerRegion,
            siteId:node.data.siteId
        });
        this.contentsCardPanel.getLayout().setActiveItem(this.contentsCardPanel.items.length - 1);
    },

    getPublications:function (node) {
        this.contentsCardPanel.removeAll(true);
        this.contentsCardPanel.add({
            xtype:'knitkit_publishedgridpanel',
            title:node.data.siteName + ' Publications',
            siteId:node.data.id.split('_')[1],
            centerRegion:this.initialConfig['module'].centerRegion
        });
        this.contentsCardPanel.getLayout().setActiveItem(this.contentsCardPanel.items.length - 1);
    },

    exportSite:function (id) {
        var self = this;
        self.setWindowStatus('Exporting Website...');
        window.open('/knitkit/erp_app/desktop/site/export?id=' + id, 'mywindow', 'width=400,height=200');
        self.clearWindowStatus();
    },

    deleteSite:function (node) {
        var self = this;
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this Website?', function (btn) {
            if (btn == 'no') {
                return false;
            }
            else if (btn == 'yes') {
                self.setWindowStatus('Deleting Website...');
                Ext.Ajax.request({
                    url:'/knitkit/erp_app/desktop/site/delete',
                    method:'POST',
                    params:{
                        id:node.data.id.split('_')[1]
                    },
                    success:function (response) {
                        self.clearWindowStatus();
                        var obj = Ext.decode(response.responseText);
                        if (obj.success) {
                            node.removeAll();
							node.remove();
                        }
                        else {
                            Ext.Msg.alert('Error', 'Error deleting Website');
                        }
                    },
                    failure:function (response) {
                        self.clearWindowStatus();
                        Ext.Msg.alert('Error', 'Error deleting Website');
                    }
                });
            }
        });
    },

    publish:function (node) {
        var self = this;
        var publishWindow = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.PublishWindow',{
            baseParams:{
                id:node.id.split('_')[1]
            },
            url:'/knitkit/erp_app/desktop/site/publish',
            listeners:{
                'publish_success':function (window, response) {
                    if (response.success) {
                        self.getPublications(node);
                    }
                    else {
                        Ext.Msg.alert('Error', 'Error publishing Website');
                    }
                },
                'publish_failure':function (window, response) {
                    Ext.Msg.alert('Error', 'Error publishing Website');
                }
            }
        });

        publishWindow.show();
    },

    editSectionLayout:function (sectionName, sectionId, websiteId) {
        var self = this;
        self.selectWebsite(websiteId);
        self.setWindowStatus('Loading section template...');
        Ext.Ajax.request({
            url:'/knitkit/erp_app/desktop/section/get_layout',
            method:'POST',
            params:{
                id:sectionId
            },
            success:function (response) {
                self.initialConfig['centerRegion'].editSectionLayout(
                    sectionName,
                    websiteId,
                    sectionId,
                    response.responseText,
                    [
                        {
                            text:'Insert Content Area',
                            handler:function (btn) {
                                var codeMirror = btn.findParentByType('codemirror');
                                Ext.MessageBox.prompt('New File', 'Please enter content area name:', function (btn, text) {
                                    if (btn == 'ok') {
                                        codeMirror.insertContent('<%=render_content_area(:' + text + ')%>');
                                    }

                                });
                            }
                        }
                    ]);
                self.clearWindowStatus();
            },
            failure:function (response) {
                self.clearWindowStatus();
                Ext.Msg.alert('Error', 'Error loading section layout.');
            }
        });
    },

    changeSecurity:function (node, updateUrl, id) {
        Ext.Ajax.request({
            url:'/knitkit/erp_app/desktop/available_roles',
            method:'POST',
            success:function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    Ext.create('widget.knikit_selectroleswindow',{
                        baseParams:{
                            id:id,
                            site_id:node.get('siteId')
                        },
                        url: updateUrl,
                        currentRoles:node.get('roles'),
                        availableRoles:obj.availableRoles,
                        listeners:{
                            success:function(window, response){
                                node.set('roles', response.roles);
                                if (response.secured) {
                                    node.set('iconCls', 'icon-document_lock');
                                }
                                else {
                                    node.set('iconCls', 'icon-document');
                                }
                                node.set('isSecured', response.secured);
                                node.commit();
                            },
                            failure:function(){
                                Ext.Msg.alert('Error', 'Could not update security');
                            }
                        }
                    }).show();
                }
                else {
                    Ext.Msg.alert('Error', 'Could not load available roles');
                }
            },
            failure:function (response) {
                Ext.Msg.alert('Error', 'Could not load available roles');
            }
        });
    },

    selectWebsite:function (websiteId, websiteName) {

        var siteContentsPanel = Ext.ComponentQuery.query('#knitkitSiteContentsTreePanel').first();
        siteContentsPanel.selectWebsite(websiteId, websiteName);

        var eastRegion = Ext.ComponentQuery.query('#knitkitEastRegion').first();
        eastRegion.fileAssetsPanel.selectWebsite(websiteId, websiteName);
        eastRegion.imageAssetsPanel.selectWebsite(websiteId, websiteName);

        var themePanel = Ext.ComponentQuery.query('#themesTreePanel').first();
        themePanel.selectWebsite(websiteId, websiteName);

        Compass.ErpApp.Shared.FileManagerTree.extraPostData = {
            website_id:websiteId
        };

        var menuPanel = Ext.ComponentQuery.query('#knitkitMenuTreePanel').first();
        menuPanel.selectWebsite(websiteId, websiteName);

        var hostPanel = Ext.ComponentQuery.query('#knitkitHostListPanel').first();
        hostPanel.selectWebsite(websiteId, websiteName);

    },

    updateWebsiteConfiguration:function (rec) {
        var configurationWindow = Ext.create("Ext.window.Window", {
            layout:'fit',
            width:600,
            title:'Configuration',
            height:400,
            autoScroll:true,
            plain:true,
            items:[
                {
                    xtype:'sharedconfigurationpanel',
                    configurationId:rec.get('configurationId')
                }
            ]
        });

        configurationWindow.show();
    },

    initComponent:function () {

        var self = this;

        this.contentsCardPanel = Ext.create('Ext.Panel',{
            layout:'card',
            region:'south',
            header: false,
            split:true,
            height:200,
            collapsible:true,
            collapsed: false
        });

        var tbarItems = [];

        if (currentUser.hasCapability('create','Website')) {
            tbarItems.push({
                    text:'New Website',
                    iconCls:'icon-add',
                    handler:function (btn) {
                        var addWebsiteWindow = Ext.create("Ext.window.Window", {
                            title:'New Website',
                            plain:true,
                            buttonAlign:'center',
                            items:new Ext.FormPanel({
                                labelWidth:110,
                                frame:false,
                                bodyStyle:'padding:5px 5px 0',
                                url:'/knitkit/erp_app/desktop/site/new',
                                defaults:{
                                    width:225
                                },
                                items:[
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Name',
                                        allowBlank:false,
                                        name:'name'
                                    },
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Host',
                                        allowBlank:false,
                                        name:'host'
                                    },
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Title',
                                        allowBlank:false,
                                        name:'title'
                                    },
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Sub Title',
                                        allowBlank:true,
                                        name:'subtitle'
                                    }
                                ]
                            }),
                            buttons:[
                                {
                                    text:'Submit',
                                    listeners:{
                                        'click':function (button) {
                                            var window = button.findParentByType('window');
                                            var formPanel = window.query('.form')[0];
                                            self.setWindowStatus('Creating website...');
                                            formPanel.getForm().submit({
                                                success:function (form, action) {
                                                    self.clearWindowStatus();
                                                    var obj = Ext.decode(action.response.responseText);
                                                    if (obj.success) {
                                                        self.siteContentsTree.getStore().load();
                                                        addWebsiteWindow.close();
                                                    }
                                                },
                                                failure:function (form, action) {
                                                    self.clearWindowStatus();
                                                    Ext.Msg.alert("Error", "Error creating website");
                                                }
                                            });
                                        }
                                    }
                                },
                                {
                                    text:'Close',
                                    handler:function () {
                                        addWebsiteWindow.close();
                                    }
                                }
                            ]
                        });
                        addWebsiteWindow.show();
                    }
                }
            );
        }

        if (currentUser.hasCapability('import','Website')) {
            tbarItems.push({
                text:'Import Website',
                iconCls:'icon-globe',
                handler:function (btn) {
                    var importWebsiteWindow = Ext.create("Ext.window.Window", {
                        layout:'fit',
                        width:375,
                        title:'Import Website',
                        height:100,
                        plain:true,
                        buttonAlign:'center',
                        items:new Ext.FormPanel({
                            labelWidth:110,
                            frame:false,
                            fileUpload:true,
                            bodyStyle:'padding:5px 5px 0',
                            url:'/knitkit/erp_app/desktop/site/import',
                            defaults:{
                                width:225
                            },
                            items:[
                                {
                                    xtype:'fileuploadfield',
                                    fieldLabel:'Upload Website',
                                    buttonText:'Upload',
                                    buttonOnly:false,
                                    allowBlank:false,
                                    name:'website_data'
                                }
                            ]
                        }),
                        buttons:[
                            {
                                text:'Submit',
                                listeners:{
                                    'click':function (button) {
                                        var window = button.findParentByType('window');
                                        var formPanel = window.query('form')[0];
                                        self.setWindowStatus('Importing website...');
                                        formPanel.getForm().submit({
                                            success:function (form, action) {
                                                self.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.success) {
                                                    self.siteContentsTree.getStore().load();
                                                    importWebsiteWindow.close();
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                            },
                                            failure:function (form, action) {
                                                self.clearWindowStatus();
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
                                text:'Close',
                                handler:function () {
                                    importWebsiteWindow.close();
                                }
                            }
                        ]
                    });
                    importWebsiteWindow.show();
                }
            });
        }

        var contentPanel = Ext.create('Ext.panel.Panel', {
            title: 'Site Contents',

            items:[this.siteContentsTree],
            tbar:{
                items:tbarItems
            }

        });

        var siteContentsPanel = Ext.create('Ext.panel.Panel', {
            title: 'Site Contents',
            autoScroll: true,
            items: [
                {
                    xtype:'knitkit_sitecontentstreepanel',
                    centerRegion:this.initialConfig['module'].centerRegion,
                    header: false
                }]
        });

        var themesPanel = Ext.create('Ext.panel.Panel', {
            title: 'Visual Theme Files',
            autoScroll: true,
            items: [
                {
                    xtype:'knitkit_themestreepanel',
                    centerRegion:this.initialConfig['module'].centerRegion,
                    header: false
                }]

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
            title: 'Configuration',
            autoScroll: true,
            items: [
                {
                    xtype: 'knitkit_configpanel'
                }
            ]

        });

        var layout = Ext.create('Ext.panel.Panel',{
            layout: 'accordion',
            title:'Websites',
            items:[siteContentsPanel, themesPanel, menuPanel, configPanel]

        });

        this.items = [layout,
            {
                xtype:'knitkit_articlesgridpanel',
                centerRegion:this.initialConfig['module'].centerRegion
            }];

        this.callParent(arguments);
        this.setActiveTab(0);
    },

    constructor:function (config) {
        config = Ext.apply({
            region:'west',
            split:true,
            width:310,
            collapsible:true
        }, config);

        this.callParent([config]);
    }
});