# ClueConCoffee
Work done during the ClueCon 2016 Hack-a-Thon.

## Coffee
Thanks to [Flowroute](https://www.flowroute.com/) and inspired by [RFC2324](https://www.ietf.org/rfc/rfc2324.txt) we have made it possible to order coffee by the push of a button.

Thanks to mosquitto.org for putting up an open MQTT server.


### Setup

The ClueConCoffee project runs on an RPi Model 3. It utilises a green and a red
diode, and a button for user interaction.

It uses the FlowRoute API for sending text messages to the cold-brew
coffee-service at ClueCon 2016. The communication flow it two-way, so to get a
response from FlowRoute, we use an open MQTT server and a small service for
translating the HTTP POST callback from FlowRoute to an MQTT event. That way,
the RPi can subscribe to a specific topic to get notified on a response text
message.
