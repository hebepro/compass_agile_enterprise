Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.SplashScreen",{
    extend:"Ext.panel.Panel",
    alias:'widget.knitkit_splash_screen',
    title: 'Startup',
    items: [
        {
            html: "<div style='margin: 15px 50px 5px 50px;'><hr /><h2 style='margin: 3px 0px 0px 0px; color: #555; text-align: center'>Website Builder Home</h2><hr /></div>"
        },
        {
            xtype: 'panel',
            layout: 'column',
            style: 'width: 480px; margin-top: 20px; margin-left: auto; margin-right: auto;',
            items: [
                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/knitkit/splash/images/add-site.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        alert('Add a site');

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Add a website</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/knitkit/splash/images/browse-site.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        alert('Add a site');

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>View the current site in a browser</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/knitkit/splash/images/find-themes.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        alert('Add a site');

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Find themes</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/knitkit/splash/images/adjust-site.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        alert('Add a site');

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Delete or rename the sample site</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/knitkit/splash/images/settings.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        alert('Settings');

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Delete or rename the sample site</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/knitkit/splash/images/tutorials.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        alert('Tutorials');

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Delete or rename the sample site</p>"
                        }
                    ]
                }
            ]
        }
    ]
});


