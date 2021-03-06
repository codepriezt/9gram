var deferredPrompt;

if(!window.Promise){
    window.Promise = Promise;
}


if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/service-worker.js').then(function(){
        console.log('service worker registered');
    });
}


window.addEventListener('beforeinstallprompt' , function(event){
    console.log('before installed prompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});