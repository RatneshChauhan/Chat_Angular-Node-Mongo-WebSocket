addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

//import * as Realm from 'realm-web';
import * as utils from './utils';
import { createMongoDBDataAPI } from 'mongodb-data-api-fetch'

async function handleRequest(request: Request) {
  console.log('request object  :::', request)
  // const apiID = 'rc_application-0-kzigb'
  // const appKeyy = 'GCuoyMkm9f7v0Jd73DIF92hbivOklEJqS8HI0YTnmAK4gTkmsPRY76A3B5rUDVix'
  const appID = 'data-hmwlj'
  const apiKeyy = 'YM23knMw2Z4QMOz5pizl69G7AGEkzWyjnvV5zqgteTcnG0hSrDIUwWJ2me8LdfI5'

  const payload = {
    collection: 'users',
    database: 'myFirstDatabase',
    dataSource: 'Cluster0',
    filter: { username: 'Edge' }
  }

  const response =
    await fetch
      ('https://ap-south-1.aws.data.mongodb-api.com/app/' + appID + '/endpoint/data/v1/action/findOne'
        , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKeyy,
          },
          body: JSON.stringify(payload),
        })

  const users = await response.json()
  console.log('Mongo data as json -- - -- - ', JSON.stringify(users))

  return new Response('Hello Cloudflare Workers!'+ JSON.stringify(users));
  // return new Response(' https://www.youtube.com/watch?v=JazoFp8mBhM | https://github.com/karanpratapsingh/cloudflare-workers-typescript' );
}

