var CACHE_STATIC = 'static-v5'
var CACHE_DYNAMIC = 'dynamic'
var STATIC_FILES = [  '/',
'/index.html',
'/offline.html',
'/src/js/app.js',
'/src/js/feed.js',
'/src/js/fetch.js',
'/src/js/material.min.js',
'/src/js/promise.js',
'/src/css/app.css',
'/src/css/feed.css',
'/src/css/help.css',
'https://fonts.googleapis.com/css?family=Roboto:400,700',
'https://fonts.googleapis.com/icon?family=Material+Icons',
'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
'/help'
]


self.addEventListener('install',function(event){
    console.log('[service worker] installing service worker', event) ;
    event.waitUntil(
        caches.open(CACHE_STATIC)
        .then(function (cache){
            console.log('[service worker ] precaching app shell');
            cache.addAll(STATIC_FILES)
            
        })
    ) 
    
});

//helper function for trimming cache
function trimCache(cacheName , maxItems){
    cache.open(cacheName)
    .then(function(cache){
        return cache.keys()
        .then(function(keys){
            if(keys.length > maxItems){
                cache.delete(keys[0])
                .then(trimCache(cacheName ,maxItems))
            }
        })
    })
    
}

self.addEventListener('activate' , function(event){ 
    console.log('[Service Worker]...Activating service Workers',event)
    event.waitUntil(
        caches.keys()
        .then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if(key != CACHE_STATIC  && key !== CACHE_DYNAMIC){
                        console.log('[service worker] removing old cache....', key);
                        return caches.delete(key);
                }
            }))
        })
    );
    return self.clients.claim()
});

//instead of using thr repExp method of checking if a string is in an array.. can easily  create a loop to check

function isInArray(string , array){
    for(var i=0 ; i < array.length ;i++){
        if(array[i] === string){
            return true;
        }
    }
    return false;
}

//cache then network stradegy
self.addEventListener('fetch' , function(event){
    var url = 'https://httpbin.org/get';

    if(event.request.url.indexOf(url) > -1){
        event.respondWith(
            caches.open(CACHE_DYNAMIC)
            .then(function(cache){
                return fetch(event.request)
                    .then(function(res){
                        cache.put(event.request , res.clone());
                        return res;
                    })
    
            })
        );
    }else if(isInArray(event.request.url , STATIC_FILES)){
        event.respondWith(
         caches.match(event.request)
     );   
    }else{
        event.respondWith(
                    caches.match(event.request)
                    .then(function(response){
                        if(response){
                            return response;
                        }else{
                            return fetch(event.request)
                            .then(function(res){
                                return caches.open(CACHE_DYNAMIC)
                                .then(function(cache){
                                    // trimCache(CACHE_DYNAMIC , 5);
                                    cache.put(event.request.url , res.clone());
                                    return res;
                                })
                                
                            }).catch(function(err){
                                return caches.open(CACHE_STATIC)
                                    .then(function(cache){
                                        if(event.request.headers.get('accept').includes('text/html')){
                                            return cache.match('/offline.html');
                                        }  
                                    })
                            })
                        }
                    })
                );
                
    }
    
})


//cache with network fallback stagedy
// self.addEventListener('fetch' , function(event){
//     event.respondWith(
//         caches.match(event.request)
//         .then(function(response){
//             if(response){
//                 return response;
//             }else{
//                 return fetch(event.request)
//                 .then(function(res){
//                     return caches.open(CACHE_DYNAMIC)
//                     .then(function(cache){
//                         cache.put(event.request.url , res.clone());
//                         return res;
//                     })
                    
//                 }).catch(function(err){
//                     return caches.open(CACHE_STATIC)
//                         .then(function(cache){
//                             return cache.match('/offline.html');
//                         })
//                 })
//             }
//         })
//     );
    
// });

//cache only stragedy
// self.addEventListener('fetch' , function(event){
//     event.respondWith(
//         caches.match(event.request)
//     );        
// });


//network only stradegy
// self.addEventListener('fetch' , function(event){
//     event.respondWith(
//        fetch(event.reqest)
//     );_
// });


//network-cache fallback stragedy
// self.addEventListener('fetch' , function(event){
//     event.respondWith(
//         fetch(event.request)
//         .then(function(res){
//             return caches.open(CACHE_DYNAMIC)
//             .then(function(cache){
//                  cache.put(event.request.url , res.clone())
//                 return res;
//             })
//         }).catch(function(err){
//             return caches.match(event.request);
//         })
//     )

// })

