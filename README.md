# NATS Streaming Server test app

Small project to learn how to use NATS streaming server, built with node.js/ts

`npm run publish` - run event publisher
`npm run listen` - run event listener

Type `rs` in terminal windows running publisher or listener to restart.

## Port-forwarding

To access the NATS pod locally, setup  port-forwarding on the local NATS pod e.g. running on command line:

```
kubectl port-forward nats-depl-6fc6ff8448-dpjmk 4222:4222
```

Expose whatever ports are set up in the k8s deployment config (in this case, 4222 and 8222)

Navigate to `http://localhost:[monitoring_port]/streaming` to view stats on running NATS server

To view subscriptions, navigate to http://localhost:8222/streaming/channelsz?subs=1

Running `npm run publish` after port-forwarding is setup, the test app will work
