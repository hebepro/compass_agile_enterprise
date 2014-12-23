Ext.define("Compass.ErpApp.Desktop.Applications.RailsDbAdmin.SplashScreen", {
    title: 'Startup',
    extend: "Ext.panel.Panel",
    alias: 'widget.railsdbadmin_splash_screen',
    autoScroll: true,
    items: [
        {
            html: "<div style='margin: 15px 50px 5px 50px;'><hr /><h2 style='margin: 3px 0px 0px 0px; color: #555; text-align: center'>Database Navigator</h2><hr /></div>"
        },
        {
            xtype: 'image',
            style: 'padding-left: 50%; margin-left: -400px;',
            src: '/assets/splash/splash.png'   // src: 'http://placehold.it/800x250'
        },
        {
            html: "<div style='margin: 15px 50px 5px 50px;'><p style='margin: 0px; color: #222; text-align: center; font-size: 16px; font-weight: 300;'>Click on the shortcuts below to get started.</p></div>"
        },
        {
            xtype: 'panel',
            layout: 'column',
            style: 'width: 480px; margin-top: 0px; margin-left: auto; margin-right: auto;',
            items: [

                {
                    xtype: 'panel',
                    height: 140,
                    width: 140,
                    style:{
                        margin: '0px 0px 5px 10px;',
                        cursor: 'pointer'
                    },
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/assets/splash/images/data-model-icon.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {
                                        var module = compassDesktop.getModule('rails_db_admin-win');

                                        module.setWindowStatus('Retrieving Docs...');
                                        module.openIframeInTab('Data Models', 'http://documentation.compassagile.com');
                                        module.clearWindowStatus();

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Browse the DB models</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    height: 140,
                    width: 140,
                    style:{
                        margin: '0px 0px 5px 10px;',
                        cursor: 'pointer'
                    },
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/assets/splash/images/console-icon.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {
                                        var module = compassDesktop.getModule('rails_db_admin-win');

                                        module.addConsolePanel();
                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Open a console</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    height: 140,
                    width: 140,
                    style:{
                        margin: '0px 0px 5px 10px;',
                        cursor: 'pointer'
                    },
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/assets/knitkit/splash/images/tutorials.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {
                                        var module = compassDesktop.getModule('rails_db_admin-win');

                                        module.setWindowStatus('Retrieving Docs...');
                                        module.openIframeInTab('Tutorials', 'http://tutorials.compassagile.com');
                                        module.clearWindowStatus();

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Learn More!</p>"
                        }
                    ]
                }
            ]
        }
    ]

});