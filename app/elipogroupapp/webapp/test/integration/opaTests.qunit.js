sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'elipogroupapp/test/integration/FirstJourney',
		'elipogroupapp/test/integration/pages/GroupsList',
		'elipogroupapp/test/integration/pages/GroupsObjectPage'
    ],
    function(JourneyRunner, opaJourney, GroupsList, GroupsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('elipogroupapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheGroupsList: GroupsList,
					onTheGroupsObjectPage: GroupsObjectPage
                }
            },
            opaJourney.run
        );
    }
);