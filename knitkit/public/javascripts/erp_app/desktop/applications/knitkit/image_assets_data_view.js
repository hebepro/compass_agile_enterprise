Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsDataView", {
    extend: "Ext.view.View",
    alias: 'widget.knitkit_imageassetsdataview',
    directory: null,
    websiteId: null,
    constructor: function (config) {
        var self = this;

        listeners = config.listeners || {};

        listeners['render'] = function (view) {
            var store = view.getStore();

            if (window.FileReader) {
                var viewElement = this.getEl();

                Compass.ErpApp.Utility.addEventHandler(viewElement.dom, 'dragover', function (e) {
                    viewElement.setStyle('border', 'solid 1px red');
                    e.preventDefault()
                });
                Compass.ErpApp.Utility.addEventHandler(viewElement.dom, 'dragenter', function () {
                    viewElement.setStyle('border', 'solid 1px red');
                });
                Compass.ErpApp.Utility.addEventHandler(viewElement.dom, 'dragleave', function () {
                    viewElement.setStyle('border', 'none');
                });
                Compass.ErpApp.Utility.addEventHandler(viewElement.dom, 'drop', function (e) {
                    e.preventDefault();

                    var dt = e.dataTransfer,
                        files = dt.files;

                    for (var i = 0; i < files.length; i++) {
                        var file = files[i],
                            reader = new FileReader();

                        var loadMask = new Ext.LoadMask(self, {msg:"Please wait..."});
                        loadMask.show();

                        Compass.ErpApp.Utility.addEventHandler(reader, 'loadend', function (e, file) {
                            var bin = this.result;

                            Ext.Ajax.request({
                                headers: {'Content-Type': file.type},
                                url: config['uploadUrl'],
                                jsonData: bin,
                                params:{
                                    name: file.name,
                                    directory: self.directory,
                                    website_id: self.websiteId,
                                    is_drag_drop: true
                                },
                                success: function(result){
                                    loadMask.hide();
                                    resultObj = Ext.JSON.decode(result.responseText);
                                    if(resultObj.success){
                                        store.load({
                                            params:{
                                                directory: self.directory
                                            }
                                        });
                                        self.fireEvent('imageuploaded', self);
                                    }
                                    else{
                                        Ext.Msg.alert('Error', 'Could not upload image');
                                    }
                                },
                                failure: function(result){
                                    loadMask.hide();
                                    Ext.Msg.alert('Error', 'Could not upload image');
                                }
                            });
                        }.bindToEventHandler(file));

                        reader.readAsDataURL(file);
                    }

                    viewElement.setStyle('border', 'none');

                    return false;
                })
            }
            else {

            }
        };

        listeners['itemcontextmenu'] = function (view, record, htmlitem, index, e, options) {
            e.stopEvent();
            var hostUrl = window.location.protocol,
                saveUrl = null,
                exitUrl = null;

            hostUrl = hostUrl.concat("//");
            hostUrl = hostUrl.concat(window.location.hostname);
            hostUrl = hostUrl.concat((window.location.port ? ':' + window.location.port : ''));

            saveUrl = hostUrl.concat("/erp_app/pixlr/save");
            exitUrl = hostUrl.concat("/erp_app/pixlr/exit");

            var contextMenu = Ext.create("Ext.menu.Menu", {
                items: [
                    {
                        text: 'Edit with Pixlr',
                        iconCls: 'icon-picture',
                        handler: function (btn) {
                            pixlr.overlay.show({
                                referrer: 'CompassAE',
                                exit: exitUrl,
                                target: saveUrl,
                                image: record.get('url'),
                                title: record.get('id') + ':' + record.get('name'),
                                method: 'GET',
                                locktarget: true,
                                locktitle: true,
                                locktype: true,
                                service: 'express'
                            }, function () {
                                view.getStore().load();
                            });
                        }
                    },
                    {
                        text: 'Insert Image At Cursor',
                        iconCls: 'icon-add',
                        handler: function () {
                            var imgTagHtml = '<img';
                            if (record.get('width') && record.get('height')) {
                                imgTagHtml += (' width="' + record.get('width') + '" height="' + record.get('height') + '"');
                            }
                            imgTagHtml += ' alt="' + record.get('name') + '" src="' + record.get('url') + '" >';
                            self.module.centerRegion.insertHtmlIntoActiveCkEditorOrCodemirror(imgTagHtml);
                        }
                    }
                ]
            });
            contextMenu.showAt(e.xy);
        };

        config = Ext.apply({
            autoDestroy: true,
            style: 'overflow:auto',
            itemSelector: 'div.thumb-wrap',
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: config['url'],
                    reader: {
                        type: 'json',
                        root: 'images'
                    }
                },
                fields: ['name', 'url', 'shortName', 'id', 'downloadPath', 'height', 'width']
            }),
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{url}" title="{name}" alt="{name}" class="thumb-img"></div>',
                '<span>{shortName}</span></div>',
                '</tpl>'),
            listeners: listeners
        }, config);

        this.callParent([config]);
    },

    initComponent: function () {
        this.callParent(arguments);

        this.addEvents(
            /**
             * @event save
             * Fired when image is uploaded.
             * @param {Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsDataView} This component
             */
            'imageuploaded'
        );
    }
});