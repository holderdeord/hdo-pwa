import {Cryptography} from './crypto';

export class Page {
    constructor(serviceWorker, button, subscriptionInfo) {
        this.serviceWorker = serviceWorker;
        this.button = button;
        this.subscriptionInfo = subscriptionInfo;

        this._setupSubscription();
        button.on('subscribe', () => this._subscribeUser())
            .on('unSubscribe', () => this._unSubscribeUser());
    }

    _setupSubscription() {
        this.serviceWorker.pushManager
            .getSubscription()
            .then(subscription => {
                this.subscriptionInfo.updateSubscription(subscription);
                this.button.updateSubscription(!(subscription === null));
            });
    }

    _subscribeUser() {
        const applicationServerPublicKey = 'BF0pIYKpq6AmswREC0pFUmGZzRGH-DZiwkTV518vM9ItyexkL8XrU9xogW_TbdjvVBxVElUR0colok3Op30Xh1o';
        const applicationServerKey = Cryptography.urlB64ToUInt8Array(applicationServerPublicKey);
        this.serviceWorker.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey
            })
            .then(subscription => {
                console.log('User is subscribed.');
                this.subscriptionInfo.updateSubscription(subscription);
                this.button.updateSubscription(true);
            })
            .catch(error => {
                console.error('Failed to subscribe the user: ', error);
                this.button.updateSubscription(false);
            });
    }

    _unSubscribeUser() {
        this.serviceWorker.pushManager
            .getSubscription()
            .then(subscription => {
                if (subscription) {
                    subscription.unsubscribe();
                }
                console.log('User is unsubscribed.');
                this.button.updateSubscription(false);
                this.subscriptionInfo.updateSubscription(null);
            })
            .catch(error => console.error('Error unsubscribing', error));
    }
}