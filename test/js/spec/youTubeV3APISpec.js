﻿define([
    'youTubeV3API'
], function (YouTubeV3API) {
    'use strict';

    describe('YouTubeV3API', function () {

        it('Should be able to get related video information', function() {
            var relatedVideoInformation = null;

            runs(function() {
                YouTubeV3API.getRelatedVideoInformation({
                    videoId: 'CxHFnVCZDRo',
                    success: function (response) {
                        relatedVideoInformation = response;
                        
                        var videos = _.map(relatedVideoInformation.items, function (info) {
                            return {
                                id: info.id.videoId,
                                title: info.snippet.title
                            };
                        });
                        console.log("V3:");
                        //console.table(videos);

                    }
                });
            });

            waitsFor(function () {
                return relatedVideoInformation !== null;
            }, "RelatedVideoInformation should be set", 2000);

        });

        it('Should be able to get auto-generated playlist data', function () {

            var autoGeneratedPlaylistData = null;
            runs(function () {
                YouTubeV3API.getAutoGeneratedPlaylistData('ALYL4kY05133rTMhTulSaXKj_Y6el9q0JH', function (response) {
                    autoGeneratedPlaylistData = response.results;
                });
            }, 500);

            waitsFor(function () {
                return autoGeneratedPlaylistData !== null;
            }, "The autoGeneratedPlaylistData should be set", 2000);

            runs(function () {
                expect(autoGeneratedPlaylistData.length).toBeGreaterThan(0);
                expect(autoGeneratedPlaylistData.length).toBeLessThan(51);
            });

        });

        it('Should be able to get an auto-generated playlist\'s title', function () {

            var autoGeneratedPlaylistTitle = null;
            runs(function () {
                YouTubeV3API.getAutoGeneratedPlaylistTitle('ALYL4kY05133rTMhTulSaXKj_Y6el9q0JH', function (response) {
                    autoGeneratedPlaylistTitle = response;
                });
            }, 500);

            waitsFor(function () {
                return autoGeneratedPlaylistTitle !== null;
            }, "The autoGeneratedPlaylistTitle should be set", 2000);

            runs(function () {
                expect(autoGeneratedPlaylistTitle).not.toEqual('');
                expect(autoGeneratedPlaylistTitle).toEqual('Top Tracks for Kendrick Lamar');
            });

        });

        xit('Should be able to login to YouTube', function () {
            YouTubeV3API.doYouTubeLogin();
        });

    });

});