# watchmen-plugin-slack

A plugin for [watchmen](https://github.com/iloire/watchmen) to send Slack
notifications on service events via
[node-slack](https://www.npmjs.com/package/node-slack).

## Slack Incoming Webhook

https://api.slack.com/incoming-webhooks

Grab your URL from here:

https://my.slack.com/services/new/incoming-webhook/

Make sure your channel matches configuration for this plugin.


The default username is `AutoBot`

## Service Object
```
service.slack_notification_events='service-back latency-warning new-outage'
service.slack_notification_url='GET INCOMING WEBOOK URL FROM SLACK'
service.slack_notification_channel='#notifications'
service.slack_notification_username='Wise'
```
