Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit", {
    extend: "Ext.ux.desktop.Module",
    id: 'knitkit-win',
    alias:'widget.knitkit_mainui',

    /**
     * @cfg {Int} currentWebsiteId
     * The id of the current Website being edited
     */
    currentWebsiteId: null,

    /**
     * @cfg {String} currentWebsiteName
     * The name of the current Website being edited
     */
    currentWebsiteName: null,

    init: function () {
        this.launcher = {
            text: 'KnitKit',
            iconCls: 'icon-knitkit',
            handler: this.createWindow,
            scope: this
        }
    },

    initComponent: function () {
        var me = this;

        me.addEvents(
            /*
             * @event websiteselected
             * Fires when a website is selected
             * @param {Compass.ErpApp.Desktop.Applications.Knitkit} this
             * @param {id} Id of the selected website
             */
            'websiteselected'
        );
    },

    selectWebsite:function (websiteId, websiteName) {

        me = this;
        me.fireEvent('websiteselected', me, websiteId, websiteName);

        this.currentWebsiteId = websiteId;
        this.currentWebsiteName = websiteName;

        var eastRegion = Ext.ComponentQuery.query('#knitkitEastRegion').first();
        eastRegion.fileAssetsPanel.selectWebsite(websiteId, websiteName);
        eastRegion.imageAssetsPanel.selectWebsite(websiteId, websiteName);

        var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first();
        westRegion.selectWebsite(websiteId, websiteName);

        Compass.ErpApp.Shared.FileManagerTree.extraPostData = {
            website_id:websiteId
        };
    },

    createWindow: function () {
        var knitkitModule = this;
        //***********************************************************
        //Might get rid of this or make it an option you can select
        var title = 'KnitKit-' + currentUser.description
        //***********************************************************
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('knitkit');
        if (!win) {
            var centerRegion = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.CenterRegion');
            this.centerRegion = centerRegion;


            var tbarItems = [];


            if (currentUser.hasCapability('create','Website')) {
                tbarItems.push(
                    {
                        text: 'Main Menu',
                        menu: {
                            xtype: 'menu',
                            items: [
                                {
                                text: 'Websites',
                                iconCls:'icon-globe',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
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
                                                            width:360
                                                        },
                                                        items:[
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'Name *',
                                                                width: 320,
                                                                allowBlank:false,
                                                                name:'name'
                                                            },
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'Host *',
                                                                width: 320,
                                                                allowBlank:false,
                                                                name:'host'
                                                            },
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'Title *',
                                                                width: 320,
                                                                allowBlank:false,
                                                                name:'title'
                                                            },
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'Sub Title',
                                                                width: 320,
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
                                                                    //self.setWindowStatus('Creating website...');
                                                                    formPanel.getForm().submit({
                                                                        success:function (form, action) {
                                                                            //self.clearWindowStatus();
                                                                            var obj = Ext.decode(action.response.responseText);
                                                                            if (obj.success) {
                                                                                debugger
                                                                                var westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first();
                                                                                westRegion.selectWebsite(websiteId, websiteName);
                                                                                addWebsiteWindow.close();
                                                                            }
                                                                        },
                                                                        failure:function (form, action) {
                                                                            //self.clearWindowStatus();
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
                                        },
                                        {
                                            text:'Import Website',
                                            iconCls:'icon-globe',
                                            handler:function (btn) {
                                                var importWebsiteWindow = Ext.create("Ext.window.Window", {
                                                    layout:'fit',
                                                    width:375,
                                                    title:'Import Website',
                                                    height:120,
                                                    plain:true,
                                                    buttonAlign:'center',
                                                    items:new Ext.FormPanel({
                                                        labelWidth:110,
                                                        frame:false,
                                                        fileUpload:true,
                                                        bodyStyle:'padding:5px 5px 0',
                                                        url:'/knitkit/erp_app/desktop/site/import',
                                                        defaults:{
                                                            width:320
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
                                                                    //self.setWindowStatus('Importing website...');
                                                                    formPanel.getForm().submit({
                                                                        success:function (form, action) {
                                                                            //self.clearWindowStatus();
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
                                                                            //self.clearWindowStatus();
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
                                        }]
                                    }
                                },
                                {
                                text: 'Themes',
                                iconCls: 'icon-picture',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            text:'Add',
                                            iconCls:'icon-add',
                                            handler:function(btn){

                                                var sitesJsonStore = Ext.create("Ext.data.Store",{
                                                    proxy:{
                                                        url:'/knitkit/erp_app/desktop/site/index',
                                                        type:'ajax',
                                                        reader:{
                                                            type:'json',
                                                            root:'sites'
                                                        }
                                                    },
                                                    fields: [
                                                        {
                                                            name:'name'
                                                        },
                                                        {
                                                            name:'id'
                                                        }
                                                    ]
                                                });

                                                sitesJsonStore.load();
                                                var addThemeWindow = Ext.create("Ext.window.Window",{
                                                    layout:'fit',
                                                    width:375,
                                                    title:'New Theme',
                                                    plain: true,
                                                    buttonAlign:'center',
                                                    items: new Ext.FormPanel({
                                                        labelWidth: 110,
                                                        frame:false,
                                                        bodyStyle:'padding:5px 5px 0',
                                                        fileUpload: true,
                                                        url:'/knitkit/erp_app/desktop/theme/new',
                                                        defaults: {
                                                            width: 225
                                                        },
                                                        items: [
                                                            {
                                                                xtype:'combo',
                                                                hiddenName:'site_id',
                                                                name:'site_id',
                                                                store: sitesJsonStore,
                                                                forceSelection:true,
                                                                editable:false,
                                                                fieldLabel:'Website',
                                                                emptyText:'Select Site...',
                                                                typeAhead: false,
                                                                displayField:'name',
                                                                valueField:'id',
                                                                allowBlank:false
                                                            },
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'Name',
                                                                allowBlank:false,
                                                                name:'name'
                                                            },
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'Theme ID',
                                                                allowBlank:false,
                                                                name:'theme_id'
                                                            },
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'Version',
                                                                allowBlank:true,
                                                                name:'version'
                                                            },
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'Author',
                                                                allowBlank:true,
                                                                name:'author'
                                                            },
                                                            {
                                                                xtype:'textfield',
                                                                fieldLabel:'HomePage',
                                                                allowBlank:true,
                                                                name:'homepage'
                                                            },
                                                            {
                                                                xtype:'textarea',
                                                                fieldLabel:'Summary',
                                                                allowBlank:true,
                                                                name:'summary'
                                                            }
                                                        ]
                                                    }),
                                                    buttons: [{
                                                        text:'Submit',
                                                        listeners:{
                                                            'click':function(button){
                                                                var window = button.findParentByType('window');
                                                                var formPanel = window.query('form')[0];
                                                                self.initialConfig['centerRegion'].setWindowStatus('Creating theme...');
                                                                formPanel.getForm().submit({
                                                                    reset:true,
                                                                    success:function(form, action){
                                                                        self.initialConfig['centerRegion'].clearWindowStatus();
                                                                        var obj = Ext.decode(action.response.responseText);
                                                                        if(obj.success){
                                                                            self.getStore().load({
                                                                                node:self.getRootNode()
                                                                            });
                                                                        }
                                                                    },
                                                                    failure:function(form, action){
                                                                        self.initialConfig['centerRegion'].clearWindowStatus();
                                                                        Ext.Msg.alert("Error", "Error creating theme");
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    },{
                                                        text: 'Close',
                                                        handler: function(){
                                                            addThemeWindow.close();
                                                        }
                                                    }]
                                                });
                                                addThemeWindow.show();
                                            }
                                        },
                                        {
                                            text: 'Import Theme'
                                        }]
                                    }
                                }]
                        }
                    }
                );
            }

            tbarItems.push(
                {
                    iconCls: 'btn-save-light',
                    text: 'Save',
                    handler: function (btn) {
                        centerRegion.saveCurrent();
                    }
                },
                {
                    iconCls: 'btn-save-all-light',
                    text: 'Save All',
                    handler: function (btn) {
                        centerRegion.saveAll();
                    }
                },
                {
                    text: 'Select website'
                },
                {
                    xtype: 'websitescombo',
                    width: 250,
                    listeners:{
                        'select':function(combo, record, index){
                            var websiteData = record[0].data;
                            knitkitModule.selectWebsite(websiteData.id, websiteData.name)
                        },
                        render:function(combo){
                            combo.getStore().load();
                        }
                    }
                });

            tbarItems.push('->',
                {
                    iconCls: 'btn-left-panel',
                    handler: function (btn) {
                        var panel = btn.up('window').down('knitkit_westregion');
                        if (panel.collapsed) {
                            panel.expand();
                        }
                        else {
                            panel.collapse(Ext.Component.DIRECTION_LEFT);
                        }
                    }
                },
                {
                    iconCls: 'btn-right-panel',
                    handler: function (btn) {
                        var panel = btn.up('window').down('knitkit_eastregion');
                        if (panel.collapsed) {
                            panel.expand();
                        }
                        else {
                            panel.collapse(Ext.Component.DIRECTION_RIGHT);
                        }
                    }
                },
                {
                    iconCls: 'btn-left-right-panel',
                    handler: function (btn) {
                        var east = btn.up('window').down('knitkit_eastregion');
                        var west = btn.up('window').down('knitkit_westregion');
                        if (west.collapsed || east.collapsed) {
                            west.expand();
                            east.expand();
                        }
                        else if (!west.collapsed && !east.collapsed) {
                            var task = new Ext.util.DelayedTask(function () {
                                west.collapse(Ext.Component.DIRECTION_LEFT);
                            });
                            east.collapse(Ext.Component.DIRECTION_RIGHT);
                            task.delay(400);

                        }
                    }
                });

            win = desktop.createWindow({
                id: 'knitkit',
                title: title,
                autoDestroy: true,
                width: 1200,
                height: 550,
                maximized: true,
                iconCls: 'icon-knitkit-light',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                layout: 'border',
                tbar: {
                    ui: 'ide-main',
                    items: tbarItems
                },
                items: [
                    this.centerRegion,
                    {
                        xtype: 'knitkit_eastregion',
                        header: false,
                        module: this
                    },
                    {
                        xtype: 'knitkit_westregion',
                        header: false,
                        centerRegion: this.centerRegion,
                        module: this
                    }
                ]
            });
        }
        win.show();
    }
});
