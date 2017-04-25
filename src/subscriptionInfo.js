export class SubscriptionInfo {
    constructor(detailsSelector, jsonSelector) {
        this._detailsElement = document.querySelector(detailsSelector);
        this._jsonElement = document.querySelector(jsonSelector);
    }

    _hide() {
        this._detailsElement.style.display = 'none';
        return this;
    }

    _show() {
        this._detailsElement.style.display = 'block';
        return this;
    }

    _text(text) {
        this._jsonElement.textContent = JSON.stringify(text);
        return this;
    }

    updateSubscription(subscription) {
        if (Notification.permission === 'denied') {
            this._hide();
        } else if (subscription) {
            this._text(subscription)
                ._show();
        } else {
            this._hide();
        }
    }
}