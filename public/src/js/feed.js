
var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if(deferredPrompt){
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult){
      console.log(choiceResult.outcome);

      if(choiceResult.outcome === 'dismissed'){
        console.log('User cancelled installation') ;
      }else{
        console.log('User added to home screeen');
      }
    });

    deferredPrompt = null;
  }

  //how to unregister a service worker
  // if('serviceWorker' in navigator){
  //   navigator.serviceWorker.getRegistrations()
  //   .then(function(registrations){
  //     for(var i = 0 ; i < registrations.length; i++){
  //       registerations[i].unregister();
  //     }
  //   })
  // }

  
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);



//saving asset to cache to run offline at the frontend  (user)
//using the caches available in the javascript files
function onSaveButtonClicked(){
  if ('caches' in window){
    caches.open('user-requested')
    .then(function(cache){
      cache.add('url') // the url to be cached;
      cache.add('images to be cached')  //the item to be cached
    });
  }
}


// cache then network stragedy 

var url = 'http://httpbin.org/get' ;
var networkDataRecieved = false;

fetch(url)
.then(function(res){
  return res.json()
})
.then(function(data){
  networkDataRecieved = true;
  console.log('from web..' , data)
})

if('caches' in window){
  caches.match(url)
  .then(function(response){
    if(response){
      return response.json();
    }
  }).then(function(data){
    console.log('from cache' ,data);
    if(!networkDataRecieved){
      
    }
  })
}