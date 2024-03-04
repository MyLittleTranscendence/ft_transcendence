const createObserver = () => {
  let observers = [];

  const unsubscribe = (component) => {
    observers = observers.filter((subscriber) => subscriber !== component);
  };

  const subscribe = (component) => {
    observers.push(component);
    component.removeObservers.push(() => unsubscribe(component));
  };

  const notify = () => {
    observers.forEach((observer) => observer.render());
  };

  return {
    subscribe,
    notify,
  };
};

export default createObserver;
