const createObserver = () => {
  let observers = [];

  const subscribe = (component) => {
    observers.push(component);
  };

  const unsubscribe = (component) => {
    observers = observers.filter((subscriber) => subscriber !== component);
  };

  const notify = () => {
    observers.forEach((observer) => observer.render());
  };

  return {
    subscribe,
    unsubscribe,
    notify,
  };
};

export default createObserver;
