export class Button {
    constructor(buttonSelector) {
        this.element = document.querySelector(buttonSelector);
        this.isDisabled = true;
        this._events = {
            subscribe: [],
            unSubscribe: []
        };

        this.element.addEventListener('click', (...rest) => {
            this.isDisabled = !this.isDisabled;
            this._trigger(this.isDisabled ? 'unSubscribe' : 'subscribe', ...rest)
        });
    }

    _disable(isDisabled = true) {
        this.element.disabled = isDisabled;
        return this;
    }

    on(eventName, eventListener) {
        this._events[eventName].push(eventListener);
        return this;
    }

    _text(text) {
        this.element.textContent = text;
        return this;
    }

    _trigger(eventName, ...rest) {
        this._events[eventName].forEach(eventListener => eventListener([this, ...rest]));
        return this;
    }

    updateSubscription(isSubscribed) {
        if (Notification.permission === 'denied') {
            this._text('Push Messaging Blocked.')._disable();
            return;
        }
        this._text(isSubscribed ? 'Disable Push Messaging' : 'Enable Push Messaging')
            ._disable(false);
    }
}