Ext.define("Compass.ErpApp.Desktop.Applications.ThemesTreePanel", {
    extend: "Compass.ErpApp.Shared.FileManagerTree",
    alias: 'widget.knitkit_themestreepanel',
    itemId: 'themesTreePanel',

    clearWebsite: function(){
        var store = this.getStore();
        store.getProxy().extraParams = {};
        store.load();
    },

    selectWebsite: function (website) {
        var store = this.getStore();
        store.getProxy().extraParams = {
            website_id: website.id
        };
        store.load();
    },

    updateThemeActiveStatus: function (themeId, siteId, active) {
        var self = this;
        self.initialConfig['centerRegion'].setWindowStatus('Updating Status...');
        Ext.Ajax.request({
            url: '/knitkit/erp_app/desktop/theme/change_status',
            method: 'POST',
            params: {
                theme_id: themeId,
                website_id: siteId,
                active: active
            },
            success: function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    self.initialConfig['centerRegion'].clearWindowStatus();
                    self.getStore().load({
                        node: self.getRootNode()
                    });
                }
                else {
                    Ext.Msg.alert('Error', 'Error updating status');
                    self.initialConfig['centerRegion'].clearWindowStatus();
                }
            },
            failure: function (response) {
                self.initialConfig['centerRegion'].clearWindowStatus();
                Ext.Msg.alert('Error', 'Error updating status');
            }
        });
    },

    deleteTheme: function (themeId) {
        var self = this;
        self.initialConfig['centerRegion'].setWindowStatus('Deleting theme...');
        Ext.Ajax.request({
            url: '/knitkit/erp_app/desktop/theme/delete',
            method: 'POST',
            params: {
                theme_id: themeId
            },
            success: function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    self.initialConfig['centerRegion'].clearWindowStatus();
                    self.getStore().load({
                        node: self.getRootNode()
                    });
                }
                else {
                    Ext.Msg.alert('Error', 'Error deleting theme');
                    self.initialConfig['centerRegion'].clearWindowStatus();
                }
            },
            failure: function (response) {
                self.initialConfig['centerRegion'].clearWindowStatus();
                Ext.Msg.alert('Error', 'Error deleting theme');
            }
        });
    },

    exportTheme: function (themeId) {
        var self = this;
        self.initialConfig['centerRegion'].setWindowStatus('Exporting theme...');
        window.open('/knitkit/erp_app/desktop/theme/export?id=' + themeId, 'mywindow', 'width=400,height=200');
        self.initialConfig['centerRegion'].clearWindowStatus();
    },

    constructor: function (config) {
        var self = this;

        config = Ext.apply({
            autoLoadRoot: true,
            rootVisible: true,
            multiSelect: true,
            title: 'Themes',
            rootText: 'Themes',
            handleRootContextMenu: true,
            controllerPath: '/knitkit/erp_app/desktop/theme',
            autoDestroy: true,
            allowDownload: true,
            addViewContentsToContextMenu: true,
            standardUploadUrl: '/knitkit/erp_app/desktop/theme/upload_file',
            url: '/knitkit/erp_app/desktop/theme/index',
            fields: [
                {name: 'isTheme'},
                {name: 'isActive'},
                {name: 'siteId'},
                {name: 'text'},
                {name: 'id'},
                {name: 'url'},
                {name: 'leaf'},
                {name: 'handleContextMenu'},
                {name: 'contextMenuDisabled'}
            ],
            containerScroll: true,
            listeners: {
                'load': function (store) {
                    store.getRootNode().expandChildren();
                    store.getRootNode().eachChild(function (child) {
                        child.expandChildren();
                    });
                },
                'showImage': function (fileManager, node, themeId) {
                    var themeId = null;
                    var themeNode = node;
                    while (themeId == null && !Compass.ErpApp.Utility.isBlank(themeNode.parentNode)) {
                        if (themeNode.data.isTheme) {
                            themeId = themeNode.data.id;
                        }
                        else {
                            themeNode = themeNode.parentNode;
                        }
                    }
                    self.initialConfig['centerRegion'].showImage(node, themeId);
                },
                'contentLoaded': function (fileManager, node, content) {
                    var themeId = null;
                    var themeNode = node;
                    while (themeId == null && !Compass.ErpApp.Utility.isBlank(themeNode.parentNode)) {
                        if (themeNode.data.isTheme) {
                            themeId = themeNode.data.id;
                        }
                        else {
                            themeNode = themeNode.parentNode;
                        }
                    }
                    self.initialConfig['centerRegion'].editTemplateFile(node, content, [], themeId);
                },
                'handleContextMenu': function (fileManager, node, e) {
                    if(node.isRoot()){
                        items = [Compass.ErpApp.Desktop.Applications.Knitkit.newThemeMenuItem];

                        var contextMenu = new Ext.menu.Menu({
                            items: items
                        });
                        contextMenu.showAt(e.xy);
                        return false;
                    }
                    else if (node.data['isTheme']) {
                        var items = [];
                        if (node.data['isActive']) {
                            items.push({
                                text: 'Deactivate',
                                iconCls: 'icon-delete',
                                listeners: {
                                    'click': function () {
                                        self.updateThemeActiveStatus(node.data.id, node.data['siteId'], false);
                                    }
                                }
                            });
                        }
                        else {
                            items.push({
                                text: 'Activate',
                                iconCls: 'icon-add',
                                listeners: {
                                    'click': function () {
                                        self.updateThemeActiveStatus(node.data.id, node.data['siteId'], true);
                                    }
                                }
                            });
                        }
                        items.push({
                            text: 'Delete Theme',
                            iconCls: 'icon-delete',
                            listeners: {
                                'click': function () {
                                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this theme?', function (btn) {
                                        if (btn == 'no') {
                                            return false;
                                        }
                                        else if (btn == 'yes') {
                                            self.deleteTheme(node.data.id);
                                        }
                                    });
                                }
                            }
                        });
                        items.push({
                            text: 'Export',
                            iconCls: 'icon-document_out',
                            listeners: {
                                'click': function () {
                                    self.exportTheme(node.data.id);
                                }
                            }
                        });
                        var contextMenu = new Ext.menu.Menu({
                            items: items
                        });
                        contextMenu.showAt(e.xy);
                        return false;
                    }
                }
            }
        }, config);

        this.callParent([config]);
    }
});