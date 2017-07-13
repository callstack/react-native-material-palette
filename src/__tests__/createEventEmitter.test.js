/* @flow */

import createEventEmitter from '../createEventEmitter';

describe('createEventEmitter', () => {
  it('should return object with publish and subscribe methods', () => {
    const eventEmitter = createEventEmitter();
    expect(eventEmitter.publish).toBeDefined();
    expect(eventEmitter.subscribe).toBeDefined();
  });

  it('should provide initial value when listener subscribes', () => {
    const eventEmitter = createEventEmitter('data');
    eventEmitter.subscribe((data: string) => {
      expect(data).toBe('data');
    });
  });

  it('should allow listeners to subscribe and be notified with new values', (done: () => void) => {
    const eventEmitter = createEventEmitter();
    let initial = true;
    eventEmitter.subscribe((data: string) => {
      if (!initial) {
        expect(data).toBe('data');
        done();
      }
      initial = initial ? !initial : initial;
    });
    eventEmitter.publish('data');
  });

  it('should provide listeners with unsubscribe function', () => {
    const eventEmitter = createEventEmitter();
    const handler = jest.fn();
    const unsubscribe = eventEmitter.subscribe(handler);
    unsubscribe();
    eventEmitter.publish('data');
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
