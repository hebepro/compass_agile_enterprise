var store = Ext.create('Ext.data.TreeStore', {
    proxy:{
        type:'ajax',
        url:'/knitkit/erp_app/desktop/site/build_host_hash',
        timeout:90000
    },
    root:{
        text:'Host Information',
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
            store.getRootNode().expandChildren();
        }
    }
});

Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.HostListPanel", {
    extend:"Ext.tree.Panel",
    id:'knitkitHostListPanel',
    itemId: 'knitkitHostListPanel',
    alias:'widget.knitkit_configpanel',
    header: false,
    rootVisible: false,

    store: store,

    selectWebsite : function ( websiteId, websiteName ) {

        var hostUrl = "/knitkit/erp_app/desktop/site/build_host_hash?id=" + websiteId

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
        'itemcontextmenu':function (view, record, htmlItem, index, e) {
            e.stopEvent();
            var items = [];

            items = Compass.ErpApp.Desktop.Applications.Knitkit.addHostOptions(self, items, record);

            if (record.data['isHostRoot']) {
                if (currentUser.hasCapability('create','WebsiteHost')) {
                    items.push({
                        text:'Add Host',
                        iconCls:'icon-add',
                        listeners:{
                            'click':function () {
                                var addHostWindow = Ext.create("Ext.window.Window", {
                                    layout:'fit',
                                    width:310,
                                    title:'Add Host',
                                    height:100,
                                    plain:true,
                                    buttonAlign:'center',
                                    items:Ext.create("Ext.form.Panel", {
                                        labelWidth:50,
                                        frame:false,
                                        bodyStyle:'padding:5px 5px 0',
                                        width:425,
                                        url:'/knitkit/erp_app/desktop/site/add_host',
                                        defaults:{
                                            width:225
                                        },
                                        items:[
                                            {
                                                xtype:'textfield',
                                                fieldLabel:'Host',
                                                name:'host',
                                                allowBlank:false
                                            },
                                            {
                                                xtype:'hidden',
                                                name:'id',
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
                                                    self.setWindowStatus('Adding Host...');
                                                    formPanel.getForm().submit({
                                                        reset:true,
                                                        success:function (form, action) {
                                                            self.clearWindowStatus();
                                                            var obj = Ext.decode(action.response.responseText);
                                                            if (obj.success) {
                                                                addHostWindow.close();
                                                                record.appendChild(obj.node);
                                                            }
                                                            else {
                                                                Ext.Msg.alert("Error", obj.msg);
                                                            }
                                                        },
                                                        failure:function (form, action) {
                                                            self.clearWindowStatus();
                                                            Ext.Msg.alert("Error", "Error adding Host");
                                                        }
                                                    });
                                                }
                                            }
                                        },
                                        {
                                            text:'Close',
                                            handler:function () {
                                                addHostWindow.close();
                                            }
                                        }
                                    ]
                                });
                                addHostWindow.show();
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