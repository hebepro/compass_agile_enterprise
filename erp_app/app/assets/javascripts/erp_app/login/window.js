// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require_self

Ext.define("Compass.ErpApp.Login.Window", {
    extend: "Ext.window.Window",
    alias: "compass.erpapp.login.window",
    requires: ["Ext.Window"],
    layout: 'fit',
    width: 400,
    defaultButton: 'login',
    buttonAlign: 'center',
    closable: false,
    plain: true,
    ui: 'main-login-window',
    submitForm: function () {
        var form = this.query('form')[0];
        var basicForm = form.getForm();
        var loginTo = form.getValues().loginTo;
        if (basicForm.isValid()) {
            basicForm.submit({
                waitMsg: 'Authenticating User...',
                success: function (form, action) {
                    var result = Ext.decode(action.response.responseText);
                    if (result.success) {
                        window.history.forward(1);
                        window.location = loginTo;
                    }
                    else {
                        Ext.Msg.alert("Error", result.errors['reason']);
                    }
                },
                failure: function (form, action) {
                    var result = Ext.decode(action.response.responseText);

                    if(result['errors']){
                        Ext.Msg.alert("Error", result.errors['reason']);
                    }
                    else{
                        Ext.Msg.alert("Error", "Login failed. Try again");
                    }
                }
            });
        }
    },
    constructor: function (config) {
        this.applicationContainerCombo = Ext.create('Ext.form.field.ComboBox', {
            width: 375,
            fieldLabel: 'Login To',
            allowBlank: false,
            forceSelection: true,
            editable: false,
            id: 'loginTo',
            name: 'loginTo',
            store: config.appContainers
        });

        var formPanel = Ext.create("Ext.FormPanel", {
            labelWidth: 75,
            frame: false,
            bodyStyle: 'padding:5px 5px 0',
            url: '/session/sign_in',
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'error_message',
                    text: config.message
                },
                this.applicationContainerCombo,
                {
                    xtype: 'textfield',
                    fieldLabel: 'Username or Email Address',
                    width: 375,
                    allowBlank: false,
                    id: 'login',
                    name: 'login',
                    listeners: {
                        'specialkey': function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                this.up('window').submitForm();
                            }
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Password',
                    inputType: 'password',
                    width: 375,
                    allowBlank: false,
                    id: 'password',
                    name: 'password',
                    listeners: {
                        'specialkey': function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                this.up('window').submitForm();
                            }
                        }
                    }
                }
            ]
        });

        config = Ext.apply({
            title: 'Compass AE Single Sign On' || config['title'],
            items: formPanel,
            buttons: [
                {
                    text: 'Submit',
                    listeners: {
                        'click': function (button) {
                            this.up('window').submitForm();
                        }
                    }
                }
            ]
        }, config);
        this.callParent([config]);
    },
    initComponent: function () {
        this.callParent(arguments);
        this.applicationContainerCombo.setValue(this.initialConfig.selectedAppContainerValue);
    }
});