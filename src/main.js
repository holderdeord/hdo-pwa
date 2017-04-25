import {Button} from './button';
import {SubscriptionInfo} from './subscriptionInfo';
import {Page} from './page';

if ('serviceWorker' in navigator && 'PushManager' in window) {
    const button = new Button('#ToggleButton');
    const subscriptionInfo = new SubscriptionInfo('.js-subscription-details', '.js-subscription-json');
    navigator.serviceWorker.register('./service-worker.js')
        .then(serviceWorker => new Page(serviceWorker, button, subscriptionInfo))
        .catch(error => console.warn(error));
}