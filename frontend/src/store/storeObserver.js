const createObserver = () => {
  let observers = [];

  const unsubscribe = (component) => {
    observers = observers.filter((subscriber) => subscriber !== component);
  };

  const subscribe = (component) => {
    observers.push(component);
    return () => unsubscribe(component);
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
