function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    const applicationServerPublicKey = 'BF0pIYKpq6AmswREC0pFUmGZzRGH-DZiwkTV518vM9ItyexkL8XrU9xogW_TbdjvVBxVElUR0colok3Op30Xh1o';
    let isSubscribed;
    let serviceWorker;
    const pushButton = document.getElementById('ToggleButton');

    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function (worker) {
            serviceWorker = worker;
            initialisePush();
            console.log('Service Worker Registered');
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        });

    function initialisePush() {
        pushButton.addEventListener('click', function () {
            pushButton.disabled = true;
            if (isSubscribed) {
                unsubscribeUser();
            } else {
                subscribeUser();
            }
        });
        serviceWorker.pushManager.getSubscription()
            .then(function (subscription) {
                isSubscribed = !(subscription === null);

                updateSubscriptionOnServer(subscription);

                if (isSubscribed) {
                    console.log('User IS subscribed.');
                } else {
                    const subscriptionDetails = document.querySelector('.js-subscription-details');
                    subscriptionDetails.style.display = 'none';
                    console.log('User is NOT subscribed.');
                }

                updateButton();
            });
    }

    function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function (subscription) {
                console.log('User is subscribed.');

                updateSubscriptionOnServer(subscription);

                isSubscribed = true;

                updateButton();
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
                updateButton();
            });
    }

    function updateButton() {
        if (Notification.permission === 'denied') {
            pushButton.textContent = 'Push Messaging Blocked.';
            pushButton.disabled = true;
            updateSubscriptionOnServer(null);
            return;
        }

        if (isSubscribed) {
            pushButton.textContent = 'Disable Push Messaging';
        } else {
            pushButton.textContent = 'Enable Push Messaging';
        }

        pushButton.disabled = false;
    }

    function updateSubscriptionOnServer(subscription) {
        // TODO: Send subscription to application server

        const subscriptionJson = document.querySelector('.js-subscription-json');
        const subscriptionDetails = document.querySelector('.js-subscription-details');

        if (subscription) {
            subscriptionJson.textContent = JSON.stringify(subscription);
            subscriptionDetails.style.display = 'block';
        } else {
            subscriptionDetails.style.display = 'none';
        }
    }

    function unsubscribeUser() {
        serviceWorker.pushManager.getSubscription()
            .then(function (subscription) {
                if (subscription) {
                    return subscription.unsubscribe();
                }
            })
            .catch(function (error) {
                console.log('Error unsubscribing', error);
            })
            .then(function () {
                updateSubscriptionOnServer(null);

                console.log('User is unsubscribed.');
                isSubscribed = false;

                updateButton();
            });
    }
}