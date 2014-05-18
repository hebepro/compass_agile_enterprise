var siteContentsStore = Ext.create('Ext.data.TreeStore', {
    proxy: {
        type: 'ajax',
        url: '/knitkit/erp_app/desktop/site/build_content_tree',
        timeout: 90000
    },
    root: {
        text: 'Sections/Web Pages',
        iconCls: 'icon-ia',
        expanded: true
    },
    fields: [
        'objectType',
        'text',
        'iconCls',
        'parentItemId',
        'isBlog',
        'display_title',
        'leaf',
        'isSection',
        'isDocument',
        'contentInfo',
        'content_area',
        'isSecured',
        'url',
        'path',
        'inMenu',
        'hasLayout',
        'siteId',
        'type',
        'name',
        'title',
        'subtitle',
        'websiteId',
        'isSectionRoot',
        'siteName',
        'internal_identifier',
        'configurationId',
        'renderWithBaseLayout',
        'roles',
        'useMarkdown',
        'parentItemId',
        // if an article is part of a blog then you can edit the excerpt
        'canEditExcerpt',
        {name: 'createdAt', mapping: 'created_at', type: 'date'},
        {name: 'updatedAt', mapping: 'updated_at', type: 'date'}
    ],
    listeners: {
        'load': function (store, node, records) {
            store.getRootNode().expandChildren(true);
        }
    }
});

var pluginItems = [];

pluginItems.push({
    ptype: 'treeviewdragdrop'
});

var viewConfigItems = {
    markDirty: false,
    plugins: pluginItems,
    listeners: {
        'beforedrop': function (dom, data, overModel, dropPosition, dropHandlers, options) {
            var record = data.records.first();

            if(record.get('objectType') == 'Article'){
                if(overModel.get('isSection')){
                    return false;
                }
            }
        },
        'drop': function (dom, data, overModel, dropPosition, options) {
            var positionArray = [],
                record = data.records.first(),
                result = true,
                counter = 0;

            if(record.get('isSection')){
                // if the record is modified and the parentId has changed we need to change
                // the section parent
                if(record.modified && record.modified.parentId){
                    Ext.Ajax.request({
                        url: '/knitkit/erp_app/desktop/position/change_section_parent',
                        method: 'PUT',
                        params:{
                            section_id: record.get('id').split('_')[1],
                            parent_id: record.get('parentId').split('_')[1]
                        },
                        success: function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (!obj.success) {
                                Ext.Msg.alert("Error", obj.message);
                                result = false;
                            }
                        },
                        failure: function (response) {
                            Ext.Msg.alert('Error', 'Error saving positions.');
                            result = false;
                        }
                    });
                }
                else{
                    overModel.parentNode.eachChild(function (node) {
                        if(node.get('isSection')){
                            positionArray.push({
                                id: node.data.id.split('_')[1],
                                position: counter
                            });
                            counter++;
                        }
                    });

                    Ext.Ajax.request({
                        url: '/knitkit/erp_app/desktop/position/update_section_position',
                        method: 'PUT',
                        jsonData: {
                            position_array: positionArray
                        },
                        success: function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (!obj.success) {
                                Ext.Msg.alert("Error", obj.message);
                                result = false;
                            }
                        },
                        failure: function (response) {
                            Ext.Msg.alert('Error', 'Error saving positions.');
                            result = false;
                        }
                    });
                }
            }
            // this is an article
            else{
                if(record.modified && record.modified.parentId){
                    result = false;
                }
                else{
                    overModel.parentNode.eachChild(function (node) {
                        positionArray.push({
                            id: node.get('id'),
                            position: counter
                        });
                        counter++;
                    });

                    Ext.Ajax.request({
                        url: '/knitkit/erp_app/desktop/position/update_article_position',
                        method: 'PUT',
                        jsonData: {
                            position_array: positionArray
                        },
                        params:{
                            section_id: record.parentNode.get('id').split('_')[1]
                        },
                        success: function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (!obj.success) {
                                Ext.Msg.alert("Error", obj.message);
                                result = false;
                            }
                        },
                        failure: function (response) {
                            Ext.Msg.alert('Error', 'Error saving positions.');
                            result = false;
                        }
                    });
                }
            }

            return result;
        }
    }
};

Ext.define("Compass.ErpApp.Desktop.Applications.SiteContentsTreePanel", {

    extend: "Ext.tree.Panel",
    id: 'knitkitSiteContentsTreePanel',
    itemId: 'knitkitSiteContentsTreePanel',
    alias: 'widget.knitkit_sitecontentstreepanel',
    header: false,

    viewConfig: viewConfigItems,
    store: siteContentsStore,
    enableDD: true,

    editSectionLayout: function (sectionName, sectionId, websiteId) {
        var self = this;

        Ext.Ajax.request({
            url: '/knitkit/erp_app/desktop/section/get_layout',
            method: 'POST',
            params: {
                id: sectionId
            },
            success: function (response) {
                self.initialConfig['centerRegion'].editSectionLayout(
                    sectionName,
                    websiteId,
                    sectionId,
                    response.responseText,
                    [
                        {
                            text: 'Insert Content Area',
                            handler: function (btn) {
                                var codeMirror = btn.findParentByType('codemirror');
                                Ext.MessageBox.prompt('New File', 'Please enter content area name:', function (btn, text) {
                                    if (btn == 'ok') {
                                        codeMirror.insertContent('<%=render_content_area(:' + text + ')%>');
                                    }

                                });
                            }
                        }
                    ]);
            },
            failure: function (response) {
                Ext.Msg.alert('Error', 'Error loading section layout.');
            }
        });
    },

    clearWebsite: function () {
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

    listeners: {
        'itemclick': function (view, record, htmlItem, index, e) {
            var self = this;
            e.stopEvent();
            if (record.data['isSection']) {
                self.initialConfig['centerRegion'].openIframeInTab(record.data.text, record.data['url']);
            }
            else if (record.data['objectType'] === "Article") {
                var url = '/knitkit/erp_app/desktop/articles/show/' + record.data.id

                Ext.Ajax.request({
                    url: url,
                    method: 'GET',
                    extraParams: {
                        id: record.data.id
                    },
                    timeout: 90000,
                    success: function (response) {
                        var article = Ext.decode(response.responseText);
                        self.initialConfig['centerRegion'].editContent(record.data.text, record.data.id, article.body_html, record.data['siteId'], 'article');
                    }
                });
            }
            else if (record.data['isDocument']) {
                var contentInfo = record.data['contentInfo'];
                if (record.data['useMarkdown']) {
                    self.initialConfig['centerRegion'].editDocumentationMarkdown(
                        contentInfo.title,
                        record.data['siteId'],
                        contentInfo.id,
                        contentInfo.body_html,
                        []
                    );
                }
                else {
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
        'itemcontextmenu': function (view, record, htmlItem, index, e) {
            e.stopEvent();
            var items = [];

            if (!Compass.ErpApp.Utility.isBlank(record.data['url'])) {
                items.push({
                    text: 'View In Web Navigator',
                    iconCls: 'icon-globe',
                    listeners: {
                        'click': function () {
                            var webNavigator = window.compassDesktop.getModule('web-navigator-win');
                            webNavigator.createWindow(record.data['url']);
                        }
                    }
                });
            }

            if (record.isRoot() && record.hasChildNodes()) {
                items = [
                    Compass.ErpApp.Desktop.Applications.Knitkit.newSectionMenuItem,
                    Compass.ErpApp.Desktop.Applications.Knitkit.editWebsiteMenuItem(false),
                    Compass.ErpApp.Desktop.Applications.Knitkit.configureWebsiteMenuItem(false),
                    Compass.ErpApp.Desktop.Applications.Knitkit.exportWebsiteMenuItem(false),
                    Compass.ErpApp.Desktop.Applications.Knitkit.websitePublicationsMenuItem(false),
                    Compass.ErpApp.Desktop.Applications.Knitkit.websitePublishMenuItem(false),
                    Compass.ErpApp.Desktop.Applications.Knitkit.websiteInquiresMenuItem(false)
                ];
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

            if (items.length != 0) {
                var contextMenu = Ext.create("Ext.menu.Menu", {
                    items: items
                });
                contextMenu.showAt(e.xy);
            }
        }
    },

    initComponent: function (config) {
        config = Ext.apply({
        }, config);

        this.callParent([config]);
    }
});