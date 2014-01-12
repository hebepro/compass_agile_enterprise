Ext.define("Compass.ErpApp.Organizer.Applications.Tasks.TaskGanttPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.taskganttpanel',
    title: 'Gantt',
    layout: 'fit',

    initComponent: function () {
        var me = this;

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            model: 'Gnt.model.Task',
            proxy: {
                type: 'ajax',
                method: 'GET',
                url: '/erp_work_effort/erp_app/organizer/tasks/gantt_tasks',
                reader: {
                    type: 'json',
                    root: 'tasks'
                }
            }
        });

        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/erp_work_effort/erp_app/organizer/tasks/gantt_dependencies',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'dependencies'
                }
            }
        });

        var gantt = Ext.create('Gnt.panel.Gantt', {
//            leftLabelField    : 'Name',
            highlightWeekends: true,
            loadMask: true,
            rowHeight: 30,
            resizeConfig: {
                showDuration: false
            },

            dockedItems:[
                {
                    xtype: 'toolbar',
                    items:[
                        {
                            text: 'Add new task',
                            iconCls: 'icon-add',
                            handler: function () {
                                var newTask = new taskStore.model({
                                    Name: 'New task',
                                    leaf: true,
                                    PercentDone: 0
                                });
                                taskStore.getRootNode().appendChild(newTask);
                            }
                        },
                        {
                            enableToggle: true,
                            id: 'demo-readonlybutton',
                            text: 'Read only mode',
                            pressed: false,
                            handler: function () {
                                gantt.setReadOnly(this.pressed);
                            }
                        }
                    ]
                }
            ],

            lockedGridConfig: { forceFit: true },

            viewConfig: {
                focusedItemCls: 'row-focused',
                selectedItemCls: 'row-selected',
                trackOver: false
            },

            enableProgressBarResize: true,
            enableDependencyDragDrop: true,
            //snapToIncrement : true,
            cascadeChanges: false,
            startDate: new Date(2013, 10, 19),
            endDate: Sch.util.Date.add(new Date(2013, 13, 19), Sch.util.Date.WEEK, 10),
            viewPreset: 'weekAndDayLetter',

            eventRenderer: function (taskRecord) {
                return {
                    ctcls: taskRecord.get('Id') // Add a CSS class to the task element
                };
            },

            tooltipTpl: new Ext.XTemplate(
                '<ul class="taskTip">',
                '<li><strong>Task:</strong>{Name}</li>',
                '<li><strong>Start:</strong>{[values._record.getDisplayStartDate("y-m-d")]}</li>',
                '<li><strong>Duration:</strong> {Duration}d</li>',
                '<li><strong>Progress:</strong>{PercentDone}%</li>',
                '</ul>'
            ).compile(),


            // Setup your static columns
            columns: [
                {
                    xtype: 'namecolumn',
                    width: 200
                },
                {
                    xtype : 'startdatecolumn',
                    resizable: true,
                    sortable: false
                },
                {
                    xtype : 'enddatecolumn',
                    hidden : true
                },
                {
                    xtype : 'durationcolumn',
                    tdCls : 'sch-column-duration',
                    menuDisabled: true,
                },
                {
                    xtype : 'percentdonecolumn',
                    width : 50,
                    hideable: false
                }
            ],

            taskStore: taskStore,
            dependencyStore: dependencyStore,

            listeners: {

                // Setup a time header tooltip after rendering
                render: function (view) {
                    var header = view.getSchedulingView().headerCt;

                    view.tip = Ext.create('Ext.tip.ToolTip', {
                        // The overall target element.
                        target: header.id,
                        // Each grid row causes its own separate show and hide.
                        delegate: '.sch-simple-timeheader',
                        showDelay: 0,
                        trackMouse: true,
                        anchor: 'bottom',

                        //to see different date formats, see http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date
                        dateFormat: 'Y-m-d',
                        //dateFormat: 'Y-m-d, g:i a',
                        renderTo: Ext.getBody(),
                        listeners: {
                            // Change content dynamically depending on which element triggered the show.
                            beforeshow: function (tip) {
                                var el = Ext.get(tip.triggerElement),
                                    position = el.getXY(),
                                    date = view.getSchedulingView().getDateFromXY(position);

                                //update the tip with date
                                tip.update(Ext.Date.format(date, tip.dateFormat));
                            }
                        }
                    });
                }
            }
        });

        me.items = [gantt];

        me.callParent();

    }
});
