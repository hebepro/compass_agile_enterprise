Ext.define("KnitkitMobile.view.Main", {
    extend: 'Ext.ux.slidenavigation.View',
    itemId: 'slideContainer',

    requires: [
        'Ext.Container',
        'Ext.MessageBox',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.event.publisher.Dom'
    ],

    config: {
        style: 'font-size:14px;',

        fullscreen: true,

        /**
         *  Any component within the container with an 'x-toolbar' class
         *  will be draggable.  To disable draggin all together, set this
         *  to false.
         */
        slideSelector: 'x-container',

        /**
         *  Time in milliseconds to animate the closing of the container
         *  after an item has been clicked on in the list.
         */
        selectSlideDuration: 200,

        /**
         *  Enable content masking when container is open.
         *
         *  @since 0.2.0
         */
        itemMask: true,

        /**
         *  Define the default slide button config.  Any item that has
         *  a `slideButton` value that is either `true` or a button config
         *  will use these values at the default.
         */
        slideButtonDefaults: {
            selector: 'toolbar'
        },

        /**
         *  This allows us to configure how the actual list container
         *  looks.  Here we've added a custom search field and have
         *  modified the width.
         */
        list: {
            maxDrag: 400,
            //width: (Ext.os.is.iOS ? 300 : 250),
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',
                    ui: 'light',
                    title: {
                        title: 'Menu',
                        centered: true,
                        width: 200,
                        left: 0
                    }
                }
            ]

        },

        /**
         *  Example of how to re-order the groups.
         */
        /*groups: {
            'Pages': 1,
            'Account': 2
        },*/

        /**
         *  These are the default values to apply to the items within the
         *  container.
         */
        defaults: {
            style: 'background: #fff',
            xtype: 'container'
        },

        items: [
            {
                title: 'Intro to Paradine',
                slideButton: true,
                items: [
                    {
                        xtype: 'toolbar',
                        title: 'Intro to Paradine',
                        docked: 'top'
                    },
                    {
                        xtype: 'panel',
                        scrollable: true,
                        bodyPadding: '5px',
                        html: 'test'
                    }
                ]
            }
        ]
    }
});