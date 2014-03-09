Compass.ErpApp.Desktop.Applications.Knitkit.addWebsiteOptions = function (self, items, record) {

    if (currentUser.hasCapability('edit', 'Website')) {
        items.push({
            text: 'Update Website',
            iconCls: 'icon-edit',
            listeners: {
                'click': function () {

                }
            }
        });
    }

    return items;
};