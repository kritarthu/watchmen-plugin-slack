/*jslint node: true */
'use strict';

var merge = require('merge');
var Slack = require('node-slack');
require('dotenv').load({ silent: true });

function handleEvent(eventName) {
  return function(service, data) {

    var slack = new Slack(service.slack_notification_url);
    var defaultOptions = {
      channel: '#samsclub_automation',
      username: 'Autobot'
    };

    var notifications = service.slack_notification_events.split(',');
    for (var i = 0; i < notifications.length; i++) {
     notifications[i] = notifications[i].trim();
    }

    console.log('Slack notifications are turned on for:');
    console.log(notifications);
    if(service.slack_notification_channel) {
      defaultOptions.channel = service.slack_notification_channel;
    }
    if(service.slack_notification_username) {
      defaultOptions.username = service.slack_notification_username;
    }
    if (notifications.indexOf(eventName) === -1) {
      return;
    }

    var friendlyNames = {
      'latency-warning': 'Latency Warning',
      'new-outage':      'New Outage',
      'current-outage':  'Current Outage',
      'service-back':    'Service Back',
      'service-error':   'Service Error',
      'service-ok':      'Service OK'
    };

    var error = '';
    var color = "#36a64f";
    if(friendlyNames[eventName]=='New Outage') {
      error = data.error
      color = "#c70606"
    } else if(friendlyNames[eventName]=='Latency Warning') {
      color = "#c79806"
    }

    var options = {
        "text": "Change is service status",
        "attachments": [
            {
                "fallback": "Required plain-text summary of the attachment.",
                "color": color,
                "author_name": service.slack_notification_username,
                "author_icon": "https://cdn3.iconfinder.com/data/icons/basic-mobile-part-3/512/transformer-128.png",
                "title": service.name,
                "title_link": "http://monitoring.samsclubtools.walmart.com:8000/services",
                "fields": [
                    {
                        "title": "Status",
                        "value": "["+friendlyNames[eventName]+"] "+ error,
                        "short": false
                    },
    				        {
                        "title": "URL",
                        "value": service.url,
                        "short": false
                    }
                ]
    		    }
        ]
    }
    slack.send(merge(defaultOptions, options));
  };
}

function SlackPlugin(watchmen) {
  watchmen.on('latency-warning', handleEvent('latency-warning'));
  watchmen.on('new-outage',      handleEvent('new-outage'));
  watchmen.on('current-outage',  handleEvent('current-outage'));
  watchmen.on('service-back',    handleEvent('service-back'));
  watchmen.on('service-error',   handleEvent('service-error'));
  watchmen.on('service-ok',      handleEvent('service-ok'));
}

exports = module.exports = SlackPlugin;
