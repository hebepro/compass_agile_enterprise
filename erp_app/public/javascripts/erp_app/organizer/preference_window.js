Ext.define("Compass.ErpApp.Organizer.PreferencesWindow", {
    extend: "Ext.window.Window",
    alias: "widget.organizer_preferenceswindow",
    title: 'Preferences',
    height: 450,
    width: 500,
    layout: 'fit',

    setup: function () {
        this.organizerPreferenceForm.setup();
    },

    buildPreferenceForm: function (form, preferenceTypes) {
        var self = this;
        form.removeAll(true);

        Ext.each(preferenceTypes, function (preferenceType) {
            var store = [];
            Ext.each(preferenceType.preference_options, function (option) {
                store.push([option.value, option.description])
            });

            if (preferenceType.internal_identifier == 'desktop_background') {
                form.add({
                    xtype: 'combo',
                    fieldLabel: preferenceType.description,
                    editable: false,
                    forceSelection: true,
                    id: preferenceType.internal_identifier + '_id',
                    width: 150,
                    triggerAction: 'all',
                    store: store,
                    name: preferenceType.internal_identifier,
                    listeners: {
                        scope: self,
                        'select': function (combo) {
                            self.wallpaperImageChange(combo.getValue());
                        }
                    }
                });
            }
            else {
                form.add({
                    xtype: 'combo',
                    editable: false,
                    forceSelection: true,
                    id: preferenceType.internal_identifier + '_id',
                    fieldLabel: preferenceType.description,
                    name: preferenceType.internal_identifier,
                    valueField: 'field1',
                    width: 150,
                    triggerAction: 'all',
                    store: store
                });
            }

        });
    },

    initComponent: function () {
        var me = this;

        me.organizerPreferenceForm = Ext.create('Compass.ErpApp.Shared.Preferences.Form', {
            title: 'Preferences',
            url: '/erp_app/organizer/update_preferences',
            setupPreferencesUrl: '/erp_app/organizer/setup_preferences',
            loadPreferencesUrl: '/erp_app/organizer/get_preferences',
            defaults: {
                width: 150
            },
            listeners: {
                'beforeAddItemsToForm': function (form, preferenceTypes) {
                    return true;
                },
                'beforeSetPreferences': function (form, preferences) {
                    //self.setPreferences(preferences);
                },
                'afterUpdate': function (form, preferences) {
                    Compass.ErpApp.Utility.promptReload();
                    return false;
                }
            }
        });

        me.tabPanel = Ext.create('Ext.tab.Panel', {
            items: [
                this.organizerPreferenceForm,
                {
                    xtype: 'sharedpreferencesapplicationmanagementpanel',
                    updatePreferencesUrl: '/erp_app/organizer/application_management/update',
                    setupPreferencesUrl: '/erp_app/organizer/application_management/setup',
                    loadPreferencesUrl: '/erp_app/organizer/application_management/preferences',
                    applicationsUrl: '/erp_app/organizer/application_management/current_user_applications'
                }
            ]
        });

        me.items = [this.tabPanel];

        this.callParent();
    }
});