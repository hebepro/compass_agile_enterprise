Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.SplashScreen", {
    extend: "Ext.panel.Panel",
    alias: 'widget.knitkit_splash_screen',
    title: 'Startup',
    closable: true,
    items: [
        {
            html: "<div style='margin: 15px 50px 5px 50px;'><h2 style='margin: 3px 0px 10px 0px; color: #2fb3d4; text-align: center'>Website Builder Home</h2></div>"
        },

        {
            xtype: 'image',
            style: 'padding-left: 50%; margin-left: -258px;',
            src: '/assets/knitkit/splash/splash.png'
        },

        {
            html: "<div style='margin: 15px 50px 5px 50px;'><p style='margin: 0px; color: #222; text-align: center; font-size: 16px; font-weight: 300;'>Click on the shortcuts below to get started.</p></div>"
        },

        {
            xtype: 'panel',
            layout: 'column',
            style: 'width: 480px; margin-top: 0px; padding-top: 5px; margin-left: auto; margin-right: auto;',
            items: [

                {
                    xtype: 'panel',
                    height: 140,
                    width: 150,
                    style:{
                        margin: '0px 0px 5px 10px;',
                        cursor: 'pointer'
                    },
                    bodyStyle: '',
                    border: false,
                    bodyBorder: false,
                    overCls: 'shortcut-hover',
                    items: [

                        {
                            xtype: 'image',
                            src: '/assets/knitkit/splash/images/browse_db_105x105.png',
                            height: 115,
                            width: 115,
                            style: 'background-color: #fff; margin-left: 15px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        var cr = this.findParentByType('applicationmanagementcenterregion');

                                        cr.setWindowStatus('Opening CompassAE Console...');
                                        cr.addConsolePanel();
                                        cr.clearWindowStatus();

                                    }, component);

                                    component.getEl().on('mouseover', function () {
                                            component.setSrc('/assets/knitkit/splash/images/browse_db_105x105-active.png');
                                        }
                                    );
                                    component.getEl().on('mouseout', function () {
                                            component.setSrc('/assets/knitkit/splash/images/browse_db_105x105.png');
                                        }
                                    );
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #fff; margin: 0px 0px 0px 0px; text-align: center'>Open a console</p>"
                        }
                    ]
                },

                {
                    xtype: 'panel',
                    height: 140,
                    width: 150,
                    style:{
                        margin: '0px 0px 5px 10px;',
                        cursor: 'pointer'
                    },
                    bodyStyle: '',
                    border: false,
                    bodyBorder: false,
                    overCls: 'shortcut-hover',
                    items: [

                        {
                            xtype: 'image',
                            src: '/assets/knitkit/splash/images/console_105x105.png',
                            height: 115,
                            width: 115,
                            style: 'background-color: #fff; margin-left: 15px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        var cr = this.findParentByType('applicationmanagementcenterregion');

                                        cr.setWindowStatus('Opening CompassAE Console...');
                                        cr.addConsolePanel();
                                        cr.clearWindowStatus();

                                    }, component);

                                    component.getEl().on('mouseover', function () {
                                            component.setSrc('/assets/knitkit/splash/images/console_105x105-active.png');
                                        }
                                    );
                                    component.getEl().on('mouseout', function () {
                                            component.setSrc('/assets/knitkit/splash/images/console_105x105.png');
                                        }
                                    );
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #fff; margin: 0px 0px 0px 0px; text-align: center'>Open a console</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    height: 140,
                    width: 150,
                    style:{
                        margin: '0px 0px 5px 10px;',
                        cursor: 'pointer'
                    },
                    bodyStyle: '',
                    border: false,
                    bodyBorder: false,
                    overCls: 'shortcut-hover',
                    items: [

                        {
                            xtype: 'image',
                            src: '/assets/knitkit/splash/images/learn_more_105x105.png',
                            height: 115,
                            width: 115,
                            style: 'background-color: #fff; margin-left: 15px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        var cr = this.findParentByType('applicationmanagementcenterregion');

                                        cr.setWindowStatus('Opening CompassAE Console...');
                                        cr.addConsolePanel();
                                        cr.clearWindowStatus();

                                    }, component);

                                    component.getEl().on('mouseover', function () {
                                            component.setSrc('/assets/knitkit/splash/images/learn_more_105x105-active.png');
                                        }
                                    );
                                    component.getEl().on('mouseout', function () {
                                            component.setSrc('/assets/knitkit/splash/images/learn_more_105x105.png');
                                        }
                                    );
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #fff; margin: 0px 0px 0px 0px; text-align: center'>Open a console</p>"
                        }
                    ]
                }

            ]
        }
    ],
    constructor: function (config) {

        var self = this;

        config = Ext.apply({
            //placeholder
        }, config);

        self.callParent(config);
    }
});


