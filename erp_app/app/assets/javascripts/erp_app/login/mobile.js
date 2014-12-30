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

Ext.ns('Compass.ErpApp.Mobile');
Compass.ErpApp.Mobile.Applications = {};
Compass.ErpApp.Mobile.Base = {};
Compass.ErpApp.Mobile.Utility = {};

Ext.application({
    name: 'compass_ae_mobile_login',
    useLoadMask: true,

    launch: function () {
        Ext.create("Ext.form.Panel", {
            fullscreen: true,
            defaults: {
                xtype: 'textfield'
            },
            items: [
                {
                    xtype:'container',
                    height:200,
                    cls: 'login-logo'
                },
                {
                    label: 'Username or Email Address',
                    labelAlign: 'top',
                    name: 'login',
                    required: true
                },
                {
                    xtype: 'passwordfield',
                    labelAlign: 'top',
                    label: 'Password',
                    name: 'password',
                    required: true
                },
                {
                    xtype: 'button',
                    text: 'Login',
                    flex: 1,
                    scope: this,
                    style: 'margin:0.1em',
                    handler: function (btn) {
                        var form = btn.up('formpanel');
                        form.setMasked({
                            xtype: 'loadmask',
                            message: 'Authenticating User...'
                        });
                        form.submit({
                            url: '/session/sign_in',
                            method: 'POST',
                            success: function (form, result) {
                                form.setMasked(false);
                                window.location = Compass.ErpApp.Mobile.LoginTo;
                            },
                            failure: function (form, result) {
                                Ext.Msg.alert("Error", "Could not authenticate .");
                            }
                        });
                    }
                }
            ]
        });
    }
});