Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.SplashScreen", {
    extend: "Ext.panel.Panel",
    alias: 'widget.knitkit_splash_screen',
    title: 'Startup',
    closable: true,
    items: [
        {
            html: "<div style='margin: 15px 50px 5px 50px;'><hr /><h2 style='margin: 3px 0px 0px 0px; color: #555; text-align: center'>Website Builder Home</h2><hr /></div>"
        },

        {
            xtype: 'image',
            style: 'padding-left: 50%; margin-left: -300px;',
            src: '/images/knitkit/splash/splash.png'
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
                            src: '/images/knitkit/splash/images/browse-site.png',
                            height: 80,
                            width: 80,
                            style:{
                                margin: '0px 0px 5px 10px;',
                                cursor: 'pointer'
                            },
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        var currentWebsite = compassDesktop.getModule('knitkit-win').currentWebsite;
                                        if(currentWebsite){
                                            window.open(currentWebsite.url,'_blank');
                                        }
                                        else{
                                            Ext.Msg.alert('Error', 'No website selected');
                                        }

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
                            src: '/images/knitkit/splash/images/find-themes.png',
                            height: 80,
                            width: 80,
                            style:{
                                margin: '0px 0px 5px 10px;',
                                cursor: 'pointer'
                            },
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        var cr = this.findParentByType('knitkit_centerregion');

                                        cr.setWindowStatus('Finding themes...');
                                        cr.openIframeInTab('Find Themes', 'http://themes.compassagile.com');
                                        cr.clearWindowStatus();


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
                            src: '/images/knitkit/splash/images/tutorials.png',
                            height: 80,
                            width: 80,
                            style:{
                                margin: '0px 0px 5px 10px;',
                                cursor: 'pointer'
                            },
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        var cr = this.findParentByType('knitkit_centerregion');

                                        cr.setWindowStatus('Retrieving Docs...');
                                        cr.openIframeInTab('Tutorials', 'http://tutorials.compassagile.com');
                                        cr.clearWindowStatus();

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Learn more!</p>"
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


