﻿//  This view is intended to house all of the player controls (play, pause, etc) as well as the StreamView
define([
    'text!../template/rightPane.htm',
    'streamView',
    'repeatButtonView',
    'shuffleButtonView',
    'radioButtonView',
    'playPauseButtonView',
    'previousButtonView',
    'nextButtonView',
    'volumeControlView',
    'timeProgressAreaView',
    'streamItems'
], function(RightPaneTemplate, StreamView, RepeatButtonView, ShuffleButtonView, RadioButtonView, PlayPauseButtonView, PreviousButtonView, NextButtonView, VolumeControlView, TimeProgressAreaView, StreamItems) {
    'use strict';

    var RightPaneView = Backbone.View.extend({
        
        className: 'right-pane',

        template: _.template(RightPaneTemplate),
        
        streamView: null,
        radioButtonView: null,
        shuffleButtonView: null,
        repeatButtonView: null,
        playPauseButtonView: null,
        previousButtonView: null,
        nextButtonView: null,
        volumeControlView: null,
        timeProgressAreaView: null,
        toggleVideoDisplayButton: null,
        activeFolder: null,
        
        events: {
            'click button#toggleVideoDisplay': 'toggleVideoDisplay',
            'click button#saveStream': 'saveStreamAsPlaylist',
            'click button#clearStream': 'clearStream'
        },
        
        render: function() {
            this.$el.html(this.template());

            var topBar = this.$el.children('.top-bar');

            topBar.after(this.timeProgressAreaView.render().el);
            
            var topBarCenterGroup = topBar.children('.center-group');

            topBarCenterGroup.before(this.volumeControlView.render().el);

            topBarCenterGroup.append(this.previousButtonView.render().el);
            topBarCenterGroup.append(this.playPauseButtonView.render().el);
            topBarCenterGroup.append(this.nextButtonView.render().el);

            var contextButtons = this.$el.find('.context-buttons');

            contextButtons.before(this.streamView.render().el);

            var leftGroupContextButtons = contextButtons.children('.left-group');

            leftGroupContextButtons.append(this.shuffleButtonView.render().el);
            leftGroupContextButtons.append(this.repeatButtonView.render().el);
            leftGroupContextButtons.append(this.radioButtonView.render().el);

            return this;
        },
        
        initialize: function (options) {

            if (options.activeFolder == null) throw "RightPaneView expects to be initialized with an activeFolder";

            this.activeFolder = options.activeFolder;
            
            this.streamView = new StreamView({
                model: options.activeFolder
            });
            
            //  TODO: mmm... wat? I know the models are hosted on the background page, but there's gotta be a better way to do this.
            this.radioButtonView = new RadioButtonView({
                model: chrome.extension.getBackgroundPage().RadioButton
            });
            
            this.repeatButtonView = new RepeatButtonView({
                model: chrome.extension.getBackgroundPage().RepeatButton
            });

            this.shuffleButtonView = new ShuffleButtonView({
                model: chrome.extension.getBackgroundPage().ShuffleButton
            });
            
            this.previousButtonView = new PreviousButtonView({
                model: chrome.extension.getBackgroundPage().PreviousButton
            });
            
            this.playPauseButtonView = new PlayPauseButtonView({
                model: chrome.extension.getBackgroundPage().PlayPauseButton
            });
            
            this.nextButtonView = new NextButtonView({
                model: chrome.extension.getBackgroundPage().NextButton
            });

            //  TODO: Maybe pass Player in as a model here?
            this.volumeControlView = new VolumeControlView();
            this.timeProgressAreaView = new TimeProgressAreaView();

        },

        toggleVideoDisplay: function (event) {
            $(event.currentTarget).toggleClass('enabled');
        },
        
        //  TODO: Create a prompt here which will allow the user to provide a name instead of defaulting to 'Playlist'
        saveStreamAsPlaylist: function() {
            this.activeFolder.addPlaylistWithVideos('Playlist', StreamItems.pluck('video'));
        },
        
        //  TODO: Do I want some sort of prompt on this saying hey you're about to delete X are you sure you want to continue?
        clearStream: function() {
            StreamItems.clear();
        }

    });

    return RightPaneView;
})