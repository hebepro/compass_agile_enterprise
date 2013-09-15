Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsDataView", {
    extend: "Ext.view.View",
    alias: 'widget.knitkit_imageassetsdataview',

    constructor: function (config) {
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
                fields: ['name', 'url', 'shortName']
            }),
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{url}" title="{name}" alt="{name}" class="thumb-img"></div>',
                '<span>{shortName}</span></div>',
                '</tpl>'),
            listeners:{
                'itemcontextmenu': function (view, record, htmlitem, index, e, options) {
                    e.stopEvent();
                    var contextMenu = Ext.create("Ext.menu.Menu", {
                        items: [
                            {
                                text: 'Edit with Pixlr',
                                iconCls: 'icon-picture',
                                handler: function (btn) {
                                    pixlr.overlay.show({
                                        referrer: 'CompassAE',
                                        exit: 'http://localhost:3000/pixlr/finish_edit',
                                        image: 'http://1goat2chickens.com/sites/1goat2chickens/images/goat.png?1332205567',
                                        title: record.get('name'),
                                        method: 'GET',
                                        locktarget: true,
                                        locktitle: true,
                                        locktype: true,
                                        service: 'express'
                                    })
                                }
                            }
                        ]
                    });
                    contextMenu.showAt(e.xy);
                }
            }
        }, config);

        this.callParent([config]);
    }
});