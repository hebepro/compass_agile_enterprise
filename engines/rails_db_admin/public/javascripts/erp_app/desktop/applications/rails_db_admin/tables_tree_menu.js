Ext.define("Compass.ErpApp.Desktop.Applications.RailsDbAdmin.TablesMenuTreePanel",{
    extend:"Ext.Panel",
    alias:'widget.railsdbadmin_tablestreemenu',
    initComponent: function() {
        var self = this;
        this.store = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: './rails_db_admin/base/tables'
            },
            root: {
                text: 'Tables',
                expanded: true,
                draggable:false,
                iconCls:'icon-content'
            },
            fields:[
                {name:'leaf'},
                {name:'iconCls'},
                {name:'text'},
                {name:'id'},
                {name:'isTable'}
            ]
        });

        var menuTree = new Ext.tree.TreePanel({
            store:this.store,
            animate:true,
            autoScroll:false,
            frame:false,
            height:650,
            border: false,
            listeners:{
                'itemcontextmenu':function(view, record, item, index, e){
                    e.stopEvent();
                    if(!record.data['isTable']){
                        return false;
                    }
                    else{
                        var contextMenu = new Ext.menu.Menu({
                            items:[
                            {
                                text:"Select Top 50",
                                iconCls:'icon-settings',
                                listeners:{
                                    scope:record,
                                    'click':function(){
                                        self.initialConfig.module.selectTopFifty(this.data.id);
                                    }
                                }
                            },
                            {
                                text:"Edit Table Data",
                                iconCls:'icon-edit',
                                listeners:{
                                    scope:record,
                                    'click':function(){
                                        self.initialConfig.module.getTableData(this.data.id);
                                    }
                                }
                            }
                            ]
                        });
                        contextMenu.showAt(e.xy);
                    }
                }
            }
        });

        this.treePanel = menuTree;
        this.items = [menuTree];
        Compass.ErpApp.Desktop.Applications.RailsDbAdmin.TablesMenuTreePanel.superclass.initComponent.call(this, arguments);
    },

    constructor : function(config) {
        config = Ext.apply({
            title:'Tables',
            autoScroll:true
        }, config);
        Compass.ErpApp.Desktop.Applications.RailsDbAdmin.TablesMenuTreePanel.superclass.constructor.call(this, config);
    }
});