Ext.define('Compass.ErpApp.Shared.RowEditingOverride', {
    override: 'Ext.grid.plugin.RowEditing',
    startEdit: function (record, columnHeader) {
        var me = this,
            editor = me.getEditor(),
            context;

        if (Ext.isEmpty(columnHeader)) {
            columnHeader = me.grid.getTopLevelVisibleColumnManager().getHeaderAtIndex(0);
        }

        if (editor.beforeEdit() !== false) {
            context = me.callSuper([record, columnHeader]);
            if (context) {
                me.context = context;

                // If editing one side of a lockable grid, cancel any edit on the other side.
                if (me.lockingPartner) {
                    me.lockingPartner.cancelEdit();
                }
                editor.startEdit(context.record, context.column, context);
                me.fireEvent('editstarted', editor);
                me.editing = true;
                return true;
            }
        }
        return false;
    }
});