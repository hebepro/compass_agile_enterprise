
var store = Ext.create('Ext.data.TreeStore', {
    proxy:{
        type:'ajax',
        url:'/knitkit/erp_app/desktop/site/build_menu_tree',
        timeout:90000
    },
    root:{
        text:'Menus and Navigation',
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

Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.MenuTreePanel", {
    extend:"Ext.tree.Panel",
    id:'knitkitMenuTreePanel',
    itemId:'knitkitMenuTreePanel',
    alias:'widget.knitkit_menutreepanel',
    header: false,
    rootVisible: false,

    store: store,

    selectWebsite : function ( websiteId, websiteName ) {

        var hostUrl = "/knitkit/erp_app/desktop/site/build_menu_tree?id=" + websiteId

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

            items = Compass.ErpApp.Desktop.Applications.Knitkit.addMenuOptions(self, items, record);

            if (record.data['isMenuRoot']) {
                if (currentUser.hasCapability('create','WebsiteNav')) {
                    items.push({
                        text:'Add Menu',
                        iconCls:'icon-add',
                        handler:function (btn) {
                            var addMenuWindow = Ext.create("Ext.window.Window", {
                                layout:'fit',
                                width:375,
                                title:'New Menu',
                                height:120,
                                plain:true,
                                buttonAlign:'center',
                                items:Ext.create("Ext.form.Panel", {
                                    labelWidth:50,
                                    frame:false,
                                    bodyStyle:'padding:5px 5px 0',
                                    url:'/knitkit/erp_app/desktop/website_nav/new',
                                    defaults:{
                                        width:300
                                    },
                                    items:[
                                        {
                                            xtype:'textfield',
                                            fieldLabel:'Menu name: ',
                                            width: 320,
                                            allowBlank:false,
                                            name:'name'
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
                                                //self.setWindowStatus('Creating menu...');
                                                formPanel.getForm().submit({
                                                    reset:true,
                                                    success:function (form, action) {
                                                        //self.clearWindowStatus();
                                                        var obj = Ext.decode(action.response.responseText);
                                                        if (obj.success) {
                                                            record.appendChild(obj.node);
                                                        }
                                                        else {
                                                            Ext.Msg.alert("Error", obj.msg);
                                                        }
                                                    },
                                                    failure:function (form, action) {
                                                        //self.clearWindowStatus();
                                                        var obj = Ext.decode(action.response.responseText);
                                                        Ext.Msg.alert("Error", obj.msg);
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        text:'Close',
                                        handler:function () {
                                            addMenuWindow.close();
                                        }
                                    }
                                ]
                            });
                            addMenuWindow.show();
                        }
                    });
                }
            }
            else if (record.data['isWebsiteNav']) {
                if (currentUser.hasCapability('edit','WebsiteNav')) {
                    items.push({
                        text:'Update',
                        iconCls:'icon-edit',
                        handler:function (btn) {
                            var updateMenuWindow = Ext.create("Ext.window.Window", {
                                layout:'fit',
                                width:375,
                                title:'Update Menu',
                                height:120,
                                plain:true,
                                buttonAlign:'center',
                                items:new Ext.FormPanel({
                                    labelWidth:50,
                                    frame:false,
                                    bodyStyle:'padding:5px 5px 0',
                                    url:'/knitkit/erp_app/desktop/website_nav/update',
                                    defaults:{
                                        width:375
                                    },
                                    items:[
                                        {
                                            xtype:'textfield',
                                            fieldLabel:'Name',
                                            width: 320,
                                            value:record.data.text,
                                            id:'knitkit_website_nav_update_name',
                                            allowBlank:false,
                                            name:'name'
                                        },
                                        {
                                            xtype:'hidden',
                                            name:'website_nav_id',
                                            value:record.data.websiteNavId
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
                                                //self.setWindowStatus('Creating menu...');
                                                formPanel.getForm().submit({
                                                    reset:false,
                                                    success:function (form, action) {
                                                        //self.clearWindowStatus();
                                                        var obj = Ext.decode(action.response.responseText);
                                                        if (obj.success) {
                                                            var newText = Ext.getCmp('knitkit_website_nav_update_name').getValue();
                                                            record.set('text', newText);
                                                            record.commit();
                                                        }
                                                        else {
                                                            Ext.Msg.alert("Error", obj.msg);
                                                        }
                                                    },
                                                    failure:function (form, action) {
                                                        //self.clearWindowStatus();
                                                        var obj = Ext.decode(action.response.responseText);
                                                        Ext.Msg.alert("Error", obj.msg);
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        text:'Close',
                                        handler:function () {
                                            updateMenuWindow.close();
                                        }
                                    }
                                ]
                            });
                            updateMenuWindow.show();
                        }
                    });
                }

                if (currentUser.hasCapability('delete','WebsiteNav')) {
                    items.push({
                        text:'Delete',
                        iconCls:'icon-delete',
                        handler:function (btn) {
                            Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this menu?', function (btn) {
                                if (btn == 'no') {
                                    return false;
                                }
                                else if (btn == 'yes') {
                                    //self.setWindowStatus('Deleting menu...');
                                    Ext.Ajax.request({
                                        url:'/knitkit/erp_app/desktop/website_nav/delete',
                                        method:'POST',
                                        params:{
                                            id:record.data.websiteNavId
                                        },
                                        success:function (response) {
                                            //self.clearWindowStatus();
                                            var obj = Ext.decode(response.responseText);
                                            if (obj.success) {
                                                record.remove(true);
                                            }
                                            else {
                                                Ext.Msg.alert('Error', 'Error deleting menu');
                                            }
                                        },
                                        failure:function (response) {
                                            //self.clearWindowStatus();
                                            Ext.Msg.alert('Error', 'Error deleting menu');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
            else if (record.data['isWebsiteNavItem']) {
                items = Compass.ErpApp.Desktop.Applications.Knitkit.addWebsiteNavItemOptions(self, items, record);
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