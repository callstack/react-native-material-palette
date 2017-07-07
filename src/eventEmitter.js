/* @flow */

type Subscriber = (value: mixed) => void;

export default function createEventEmitter(initialValue: *) {
  let subscribers: Subscriber[] = [];
  let currentValue = initialValue;

  return {
    publish(value: *) {
      currentValue = value;
      subscribers.forEach((subscriber: Subscriber) => subscriber(currentValue));
    },

    subscribe(newSubscriber: Subscriber) {
      subscribers.push(newSubscriber);
      newSubscriber(currentValue);

      return () => {
        subscribers = subscribers.filter(
          (subscriber: Subscriber) => subscriber !== newSubscriber,
        );
      };
    },
  };
}
