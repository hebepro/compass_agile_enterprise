Ext.ns('Compass.ErpApp.Desktop.Applications.SecurityManagement.CommonWidget').properties = {

  available_grid: {
    itemId: 'available',
    titleAlign: 'center',
    style: {
      marginRight: '10px',
      borderColor: '#537697',
      borderStyle: 'solid'          
    },
    width: 450,
    height: 450,
    region: 'west'
  },

  selected_grid: {
    itemId: 'selected',
    titleAlign: 'center',
    style: {
      marginLeft: '10px',
      borderColor: '#537697',
      borderStyle: 'solid'
    },
    width: 450,
    height: 450,
    region: 'east'
  },

  assignment: {
    itemId: 'assignment',
    cls: 'assignment',
    layout: 'table',
    autoScroll: true,
    height: 600,
    bodyPadding: 10,
    style: {
      marginLeft: '18%',
      marginTop: '1%'
    }
  }
};
