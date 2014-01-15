Ext.define('Ext.ux.GoogleMapPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.googlemappanel',
    autoDestroy: true,

    initComponent: function () {
        var me = this;

        me.addEvents(
            /*
             * @event mapready
             * Fires when map is ready
             * @param {Ext.ux.GoogleMapPanel} this
             * @param {google.maps.Map} map
             */
            'mapready'
        );

        var defConfig = {
            plain: true,
            zoomLevel: 3,
            yaw: 180,
            pitch: 0,
            zoom: 0,
            mapType: 'hybrid'
        };

        this.googleMapTypes = {
            'hybrid': google.maps.MapTypeId.HYBRID,
            'satellite': google.maps.MapTypeId.SATELLITE,
            'terrain': google.maps.MapTypeId.TERRAIN,
            'roadmap': google.maps.MapTypeId.ROADMAP
        };

        Ext.applyIf(this, defConfig);

        this.callParent(arguments);
    },

    afterRender: function () {

        var wh = this.ownerCt.getSize();

        Ext.applyIf(this, wh);

        this.callParent();

        this.gmap = new google.maps.Map(this.body.dom, {
            zoom: this.zoomLevel,
            mapTypeId: this.googleMapTypes[this.mapType]
        });

        this.onMapReady();
        this.fireEvent('mapready', this, this.gmap);
    },

    onMapReady: function () {
        this.addDropPins(this.dropPins);
    },

    getMap: function () {

        return this.gmap;

    },

    getCenter: function () {

        return this.getMap().getCenter();

    },

    addDropPins: function (dropPins) {

        if (Ext.isArray(dropPins)) {
            for (var i = 0; i < dropPins.length; i++) {
                this.addDropPin(dropPins[i]);
            }
        }

    },

    addDropPin: function (dropPin) {
        var self = this;
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({
            'address': dropPin.address
        }, function (results, status) {
            if (status != google.maps.GeocoderStatus.OK) {
                Ext.MessageBox.alert('Error', 'Code ' + status + ' Error Returned');
            } else {
                if (dropPin['center'])
                    self.getMap().setCenter(results[0].geometry.location);

                new google.maps.Marker({
                    map: self.getMap(),
                    animation: google.maps.Animation.DROP,
                    position: results[0].geometry.location,
                    title: dropPin['title']
                });
            }

        });
    }
});
