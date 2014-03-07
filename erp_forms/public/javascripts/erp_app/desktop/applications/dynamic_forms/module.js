Ext.define("Compass.ErpForms.DynamicForms.DynamicFormPanel",{
    extend:"Ext.form.Panel",
    alias:'widget.dynamic_form_panel',

    // CALLBACK USAGE EXAMPLE:
    // 'afterrender':function(panel){
    //     panel.query('dynamic_form_panel').first().addListener('afterupdate', function(){
    //         console.log('afterupdate');
    //     });
    // } 
    initComponent: function() {
        this.callParent(arguments);
        this.addEvents(
          'aftercreate',
          'afterupdate'
        );
    },

    constructor : function(config) {
        this.callParent([config]);
    }
});

Ext.define("Compass.ErpApp.Desktop.Applications.DynamicForms",{
    extend:"Ext.ux.desktop.Module",
    id:'dynamic_forms-win',
    init : function(){
        this.launcher = {
            text: 'Dynamic Forms',
            iconCls:'icon-form',
            handler: this.createWindow,
            scope: this
        };
    },

    createWindow : function(){
       var desktop = this.app.getDesktop();
        var win = desktop.getWindow('dynamic_forms');
        this.centerRegion = new Compass.ErpApp.Desktop.Applications.DynamicForms.CenterRegion();                
        if(!win){

            var tbarItems = [];

            tbarItems.push(

            );

            win = desktop.createWindow({
                id: 'dynamic_forms',
                title:'Dynamic Forms',
                //maximized:true,
                width: 1200,
                height: 600,
                iconCls: 'icon-form-light',
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                layout: 'border',
                tbar: {
                    ui: 'ide-main',
                    items: tbarItems
                },
                items:[this.centerRegion,{
                    xtype:'dynamic_forms_westregion',
                    centerRegion:this.centerRegion,
                    module:this
                }]
            });
        }
        win.show();
    }
});
