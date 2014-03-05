var siteContentsStore = Ext.create('Ext.data.TreeStore', {
    proxy:{
        type:'ajax',
        url:'/knitkit/erp_app/desktop/site/build_content_tree',
        timeout:90000
    },
    root:{
        text:'Sections/Web Pages',
        iconCls: 'icon-ia',
        expanded:true
    },
    fields:[
        'objectType',
        'text',
        'iconCls',
        'parentItemId',
        'isBlog',
        'display_title',
        'leaf',
        'canAddMenuItems',
        'isWebsiteNavItem',
        'isSection',
        'isDocument',
        'contentInfo',
        'isHost',
        'isSecured',
        'url',
        'path',
        'inMenu',
        'hasLayout',
        'siteId',
        'type',
        'isWebsite',
        'name',
        'title',
        'subtitle',
        'isHostRoot',
        'websiteHostId',
        'host',
        'websiteId',
        'isSectionRoot',
        'isWebsiteNav',
        'isMenuRoot',
        'linkToType',
        'linkedToId',
        'websiteNavItemId',
        'siteName',
        'websiteNavId',
        'internal_identifier',
        'configurationId',
        'renderWithBaseLayout',
        'publication_comments_enabled',
        'roles',
        'useMarkdown'
    ],
    listeners:{
        'load':function(store, node, records){
            store.getRootNode().expandChildren(true);
        }
    }
});

var pluginItems = [];

pluginItems.push({
    ptype:'treeviewdragdrop'
});

var viewConfigItems = {
    markDirty:false,
    plugins:pluginItems,
    listeners:{
        'beforedrop':function (node, data, overModel, dropPosition, dropFunction, options) {
            if (overModel.data['isWebsiteNavItem']) {
                return true;
            }
            else if (overModel.data['isSection']) {
                if (overModel.parentNode.data['isSectionRoot']) {
                    return true;
                }
            }
            else if (overModel.data['isDocument']) {
                return true;
            }
            return false;
        },
        'drop':function (node, data, overModel, dropPosition, options) {
            var positionArray = [];
            var counter = 0;
            var dropNode = data.records[0];

            if (dropNode.data['isWebsiteNavItem']) {
                overModel.parentNode.eachChild(function (node) {
                    positionArray.push({
                        id:node.data.websiteNavItemId,
                        position:counter,
                        klass:'WebsiteNavItem'
                    });
                    counter++;
                });
            }
            else {
                overModel.parentNode.eachChild(function (node) {
                    positionArray.push({
                        id:node.data.id.split('_')[1],
                        position:counter,
                        klass:'WebsiteSection'
                    });
                    counter++;
                });
            }

            Ext.Ajax.request({
                url:'/knitkit/erp_app/desktop/position/update',
                method:'PUT',
                jsonData:{
                    position_array:positionArray
                },
                success:function (response) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {

                    }
                    else {
                        Ext.Msg.alert("Error", obj.message);
                    }
                },
                failure:function (response) {
                    Ext.Msg.alert('Error', 'Error saving positions.');
                }
            });
        }
    }
};

Ext.define("Compass.ErpApp.Desktop.Applications.SiteContentsTreePanel",{

    extend:"Ext.tree.Panel",
    id:'knitkitSiteContentsTreePanel',
    itemId:'knitkitSiteContentsTreePanel',
    alias:'widget.knitkit_sitecontentstreepanel',
    header: false,

    viewConfig:viewConfigItems,
    store:siteContentsStore,
    enableDD:true,

    editSectionLayout:function (sectionName, sectionId, websiteId) {
        var self = this;
        self.selectWebsite(websiteId);
        //self.setWindowStatus('Loading section template...');
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
                //self.clearWindowStatus();
            },
            failure:function (response) {
                //self.clearWindowStatus();
                Ext.Msg.alert('Error', 'Error loading section layout.');
            }
        });
    },

    selectWebsite : function ( websiteId, websiteName ) {

        var hostUrl = "/knitkit/erp_app/desktop/site/build_content_tree?id=" + websiteId

        var store = this.getStore();
        store.setProxy(
            {
                method: 'GET',
                type: 'ajax',
                url: hostUrl,
                timeout: 60000
            }
        );
        store.load();
    },

    listeners:{
        'itemclick':function (view, record, htmlItem, index, e) {
            var self = this;
            e.stopEvent();
            if (record.data['isSection']) {

                //self.initialConfig['centerRegion'].setWindowStatus('Retrieving Docs...');
                self.initialConfig['centerRegion'].openIframeInTab( record.data.text, record.data['url']);
                //self.initialConfig['centerRegion'].clearWindowStatus();

            }
            else if (record.data['objectType'] === "Article") {

                var self = this;
                var url = '/knitkit/erp_app/desktop/articles/show/' +  record.data.id

                Ext.Ajax.request({
                    url: url,
                    method: 'GET',
                    extraParams:{
                        id: record.data.id
                    },
                    timeout:90000,
                    success: function (response) {
                        var article = Ext.decode(response.responseText);
                        self.initialConfig['centerRegion'].editContent(record.data.text, record.data.id, article.body_html, record.data['siteId'], 'article');
                    }
                });
            }
            else if (record.data['isDocument']) {
                var contentInfo = record.data['contentInfo'];
                if(record.data['useMarkdown']){
                    self.initialConfig['centerRegion'].editDocumentationMarkdown(
                        contentInfo.title,
                        record.data['siteId'],
                        contentInfo.id,
                        contentInfo.body_html,
                        []
                    );
                }
                else{
                    self.initialConfig['centerRegion'].editContent(
                        record.data['contentInfo'].title,
                        record.data['contentInfo'].id,
                        record.data['contentInfo'].body_html,
                        record.data['siteId'],
                        'article'
                    );
                }
            }
        },
        'itemcontextmenu':function (view, record, htmlItem, index, e) {
            e.stopEvent();
            var items = [];

            if (!Compass.ErpApp.Utility.isBlank(record.data['url'])) {
                items.push({
                    text:'View In Web Navigator',
                    iconCls:'icon-globe',
                    listeners:{
                        'click':function () {
                            var webNavigator = window.compassDesktop.getModule('web-navigator-win');
                            webNavigator.createWindow(record.data['url']);
                        }
                    }
                });
            }
            if (record.data['isDocument']) {
                items = Compass.ErpApp.Desktop.Applications.Knitkit.addDocumentOptions(self, items, record);
            }
            if (record.data['objectType'] === "Article") {

                items = Compass.ErpApp.Desktop.Applications.Knitkit.addArticleOptions(self, items, record);
            }
            if (record.data['isSection']) {
                items = Compass.ErpApp.Desktop.Applications.Knitkit.addSectionOptions(self, items, record);
            }
            else if (record.data['isWebsite']) {
                items = Compass.ErpApp.Desktop.Applications.Knitkit.addWebsiteOptions(self, items, record);
            }
            else if (record.data['isSectionRoot']) {
                if (currentUser.hasCapability('create','WebsiteSection')) {
                    items.push({
                        text:'Add Section',
                        iconCls:'icon-add',
                        listeners:{
                            'click':function () {
                                var addSectionWindow = Ext.create("Ext.window.Window", {
                                    layout:'fit',
                                    width:375,
                                    title:'New Section',
                                    plain:true,
                                    buttonAlign:'center',
                                    items:Ext.create("Ext.form.Panel", {
                                        labelWidth:110,
                                        frame:false,
                                        bodyStyle:'padding:5px 5px 0',
                                        url:'/knitkit/erp_app/desktop/section/new',
                                        defaults:{
                                            width:225
                                        },
                                        items:[
                                            {
                                                xtype:'textfield',
                                                fieldLabel:'Title',
                                                allowBlank:false,
                                                name:'title'
                                            },
                                            {
                                                xtype:'textfield',
                                                fieldLabel:'Internal ID',
                                                allowBlank:true,
                                                name:'internal_identifier'
                                            },
                                            {
                                                xtype:'combo',
                                                forceSelection:true,
                                                store:[
                                                    ['Page', 'Page'],
                                                    ['Blog', 'Blog'],
                                                    ['OnlineDocumentSection', 'Online Document Section']
                                                ],
                                                value:'Page',
                                                fieldLabel:'Type',
                                                name:'type',
                                                allowBlank:false,
                                                triggerAction:'all'
                                            },
                                            {
                                                xtype:'radiogroup',
                                                fieldLabel:'Display in menu?',
                                                name:'in_menu',
                                                columns:2,
                                                items:[
                                                    {
                                                        boxLabel:'Yes',
                                                        name:'in_menu',
                                                        inputValue:'yes',
                                                        checked:true
                                                    },

                                                    {
                                                        boxLabel:'No',
                                                        name:'in_menu',
                                                        inputValue:'no'
                                                    }
                                                ]
                                            },
                                            {
                                                xtype:'radiogroup',
                                                fieldLabel:'Render with Base Layout?',
                                                name:'render_with_base_layout',
                                                columns:2,
                                                items:[
                                                    {
                                                        boxLabel:'Yes',
                                                        name:'render_with_base_layout',
                                                        inputValue:'yes',
                                                        checked:true
                                                    },

                                                    {
                                                        boxLabel:'No',
                                                        name:'render_with_base_layout',
                                                        inputValue:'no'
                                                    }
                                                ]
                                            },
                                            {
                                                xtype:'hidden',
                                                name:'website_id',
                                                value:record.data.websiteId
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
                                                    //self.setWindowStatus('Creating section...');
                                                    formPanel.getForm().submit({
                                                        reset:true,
                                                        success:function (form, action) {
                                                            //self.clearWindowStatus();
                                                            var obj = Ext.decode(action.response.responseText);
                                                            if (obj.success) {
                                                                record.appendChild(obj.node);
                                                                addSectionWindow.close();
                                                            }
                                                            else {
                                                                Ext.Msg.alert("Error", obj.msg);
                                                            }
                                                        },
                                                        failure:function (form, action) {
                                                            self.clearWindowStatus();
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
                                            text:'Close',
                                            handler:function () {
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
            }
            if (items.length != 0) {
                var contextMenu = Ext.create("Ext.menu.Menu", {
                    items:items
                });
                contextMenu.showAt(e.xy);
            }
        }
    },

    initComponent:function (config) {
        config = Ext.apply({
        }, config);

        this.callParent([config]);
    }
});