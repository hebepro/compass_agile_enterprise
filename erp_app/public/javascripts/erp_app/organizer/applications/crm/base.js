Ext.ns("Compass.ErpApp.Organizer.Applications.Crm");
/**
 * Method to setup organizer application
 * @param {config} Object containing (organizerLayout : reference to main layout container)
 */
Compass.ErpApp.Organizer.Applications.Crm.Base = function (config) {
    this.setup = function () {
        config.organizerLayout.addApplication({
            title: 'CRM',
            id: 'crmTaskTabPanel',
            tabs: [
                {
                    xtype: 'crmpartygrid',
                    applicationContainerId: 'crmTaskTabPanel',
                    itemId: 'customersPanel',
                    partyRelationships: [
                        {
                            title: 'Employees',
                            allowedPartyType: 'Individual',
                            relationshipType: 'employee_customer',
                            toRoleType: 'customer',
                            fromRoleType: 'employee'
                        }
                    ]
                }
            ],
            menuItems: [
                {
                    title: 'Customers',
                    tabItemId: 'customersPanel',
                    imgSrc: '/images/erp_app/organizer/applications/crm/customer_360_64x64.png'
                }
            ]

        });
    };
};

