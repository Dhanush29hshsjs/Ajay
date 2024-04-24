sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'elipogroupapp',
            componentId: 'GroupsList',
            contextPath: '/Groups'
        },
        CustomPageDefinitions
    );
});