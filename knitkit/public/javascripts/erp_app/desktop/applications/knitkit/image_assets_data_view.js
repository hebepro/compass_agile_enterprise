Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsDataView", {
    extend: "Ext.view.View",
    alias: 'widget.knitkit_imageassetsdataview',
	
    constructor: function (config) {
        var self = this;

        listeners = config.listeners || {};
		
		listeners['render'] = function(view){
			cancel = function(e) {
			      if (e.preventDefault) { e.preventDefault(); }
			      return false;
			    };
			
			if(window.FileReader) { 
				var viewElement = this.getEl();
				
				Compass.ErpApp.Utility.addEventHandler(viewElement.dom, 'dragover', function(){
					viewElement.setStyle('border', 'solid 1px red');
				});
				Compass.ErpApp.Utility.addEventHandler(viewElement.dom, 'dragenter', function(){
					viewElement.setStyle('border', 'solid 1px red');
				});
				Compass.ErpApp.Utility.addEventHandler(viewElement.dom, 'dragleave', function(){
					viewElement.setStyle('border', 'none');
				});
				Compass.ErpApp.Utility.addEventHandler(viewElement.dom, 'drop', function(e){
					console.log('here')
					
					e = e || window.event; // get window.event if e argument missing (in IE)   
				    if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.
					
					 /*var dt    = e.dataTransfer;
					 var files = dt.files;
					 for (var i=0; i<files.length; i++) {
					   var file = files[i];
					   var reader = new FileReader();
					    Compass.ErpApp.Utility.addEventHandler(reader, 'loadend', function(e, file) {
						    var bin           = this.result; 
						    console.log(bin)
						    
						    var newFile       = document.createElement('div');
						    newFile.innerHTML = 'Loaded : '+file.name+' size '+file.size+' B';
						    list.appendChild(newFile);  
						    var fileNumber = list.getElementsByTagName('div').length;
						    status.innerHTML = fileNumber < files.length 
						                     ? 'Loaded 100% of file '+fileNumber+' of '+files.length+'...' 
						                     : 'Done loading. processed '+fileNumber+' files.';

						    var img = document.createElement("img"); 
						    img.file = file;   
						    img.src = bin;
						    list.appendChild(img);
						}.bindToEventHandler(file));

    				    reader.readAsDataURL(file);
					 }*/
					
					 return false;
				})
			}
			else{
				
			}
		}

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
                        handler: function(){
                            var imgTagHtml = '<img';
                            if (record.get('width') && record.get('height')) {
                                imgTagHtml += (' width="' + record.get('width') + '" height="' + record.get('height') + '"');
                            }
                            imgTagHtml += ' alt="' + record.get('name') + '" src="/download/' + record.get('name') + '?path=' + record.get('downloadPath') + '" >';
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
    }
});