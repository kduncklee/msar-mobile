type EventCallback = (data: any) => void;

class MsarEventEmitter {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const eventCallbacks = this.events[event];
    if (eventCallbacks) {
      const index = eventCallbacks.indexOf(callback);
      if (index !== -1) {
        eventCallbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any): void {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(data);
      });
    }
  }
}

const msarEventEmitter = new MsarEventEmitter();
export default msarEventEmitter;
