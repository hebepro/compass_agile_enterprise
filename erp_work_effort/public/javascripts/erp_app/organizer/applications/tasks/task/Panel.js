Ext.define("Compass.ErpApp.Organizer.Applications.Tasks.Panel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.taskpanel',
    title: 'Add Task',
    layout: 'border',
    /*items: [
     {
     xtype: 'form',
     region: 'center',
     border: false,
     width: 500,
     buttonAlign: 'center',
     layout: {
     type: 'vbox',
     align: 'stretch',
     pack: 'center',
     padding: 20
     },
     items: [
     {
     fieldLabel: 'Project',
     xtype: 'combo',
     name: 'project',
     itemId: 'project',
     forceSelection: false,
     displayField: 'description',
     valueField: 'id',
     store: {
     fields: ['description', 'id'],
     proxy: {
     type: 'ajax',
     url: '/erp_work_effort/erp_app/organizer/tasks/work_efforts/projects',
     reader: {
     type: 'json',
     root: 'projects'
     }
     }
     }
     },
     {
     fieldLabel: 'Description',
     xtype: 'textfield',
     name: 'description',
     itemId: 'description',
     allowBlank: false
     },
     {
     fieldLabel: 'Start Date',
     xtype: 'datefield',
     name: 'start_date',
     itemId: 'startDate',
     allowBlank: false
     },
     {
     fieldLabel: 'End Date',
     xtype: 'datefield',
     name: 'end_date',
     itemId: 'endDate',
     allowBlank: false
     },
     {
     fieldLabel: 'Effort',
     xtype: 'numberfield',
     name: 'effort',
     itemId: 'effort',
     allowBlank: false
     },
     {
     fieldLabel: 'Parent Task',
     xtype: 'combo',
     name: 'parent_task',
     itemId: 'parentTask',
     forceSelection: false,
     displayField: 'description',
     valueField: 'id',
     store: {
     fields: ['description', 'id'],
     proxy: {
     type: 'ajax',
     url: '/erp_work_effort/erp_app/organizer/tasks/work_efforts/tasks',
     reader: {
     type: 'json',
     root: 'tasks'
     }
     }
     }
     },
     {
     fieldLabel: 'Dependent On',
     xtype: 'combo',
     name: 'dependency',
     itemId: 'dependency',
     forceSelection: true,
     displayField: 'description',
     valueField: 'id',
     store: {
     fields: ['description', 'id'],
     proxy: {
     type: 'ajax',
     url: '/erp_work_effort/erp_app/organizer/tasks/work_efforts/tasks',
     reader: {
     type: 'json',
     root: 'tasks'
     }
     }
     }
     },
     ,
     {
     xtype: 'hidden',
     id: 'workEffortId'
     }
     ],
     buttons: [
     {
     text: 'Save',
     handler: function (btn) {
     var form = btn.up('addtaskform').down('form');

     if (form.isValid()) {
     if (form.down('#assignmentTypeRole').checkboxCmp.getValue()) {
     if (Ext.isEmpty(form.down('#roleType').getValue())) {
     Ext.Msg.alert("Error", 'If assigning to a role a role must be selected');
     return false;
     }
     }

     if (form.down('#assignmentTypeParty').checkboxCmp.getValue()) {
     if (Ext.isEmpty(form.down('#assignedPartyId').getValue())) {
     Ext.Msg.alert("Error", 'If assigning to a person a person must be selected');
     return false;
     }
     }

     var workEffortId = form.down('#workEffortId').getValue(),
     method = null;

     if (Ext.isEmpty(workEffortId)) {
     method = 'POST';
     }
     else {
     method = 'PUT';
     }

     form.submit({
     clientValidation: true,
     url: '/erp_work_effort/erp_app/organizer/tasks/work_efforts',
     method: method,
     waitMsg: 'Please Wait...',
     success: function (form, action) {
     btn.up('addtaskform').close();
     },
     failure: function (form, action) {
     switch (action.failureType) {
     case Ext.form.action.Action.CLIENT_INVALID:
     Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
     break;
     case Ext.form.action.Action.CONNECT_FAILURE:
     Ext.Msg.alert('Failure', 'Ajax communication failed');
     break;
     case Ext.form.action.Action.SERVER_INVALID:
     Ext.Msg.alert('Failure', action.result.message);
     }
     }
     });
     }
     }
     },
     {
     text: 'Cancel',
     handler: function (btn) {
     btn.up('addtaskform').close();
     }
     }*/


    initComponent: function () {
        var me = this;

        me.taskForm = Ext.create('widget.taskform', {
            region: 'center',
            bodyPadding: '10px',
            width: 800,
            height: '50%'
        });

        // add some custom field
        me.taskForm.add({
                xtype: 'fieldset',
                itemId: 'assignmentTypeRole',
                checkboxToggle: true,
                checkboxName: 'assignment_type_role',
                title: 'Assign To Role',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        fieldLabel: 'Role',
                        xtype: 'combo',
                        name: 'role_type',
                        itemId: 'roleType',
                        forceSelection: true,
                        displayField: 'description',
                        valueField: 'id',
                        store: {
                            fields: ['description', 'id'],
                            proxy: {
                                type: 'ajax',
                                url: '/erp_work_effort/erp_app/organizer/tasks/work_efforts/role_types',
                                reader: {
                                    type: 'json',
                                    root: 'role_types'
                                }
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'assignmentTypeParty',
                checkboxToggle: true,
                checkboxName: 'assignment_type_party',
                title: 'Assign To Person',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'partysearchfield',
                        name: 'assigned_party_id',
                        itemId: 'assignedPartyId',
                        fieldLabel: 'Worker',
                        partyRole: 'worker'
                    }
                ]
            });

        me.items = [
            me.taskForm,
            {
                xtype: 'tabpanel',
                height: '50%',
                region: 'south',
                items: [
                    {
                        xtype: 'panel',
                        title: 'Predecessors'
                    }
                ]
            }
        ];

        me.callParent(arguments);
    }

});