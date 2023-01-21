
import '@aws-amplify/ui-react/styles.css';
// pages/index.js
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify, API, Auth, withSSRContext } from 'aws-amplify';
import Head from 'next/head';
import awsExports from '../src/aws-exports';
import { createPost } from '../src/graphql/mutations';
import { listPosts } from '../src/graphql/queries';
require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
import { useState } from 'react';

Amplify.configure({ ...awsExports, ssr: true });

export async function getServerSideProps({ req } : any) {
  const SSR = withSSRContext({ req });
  try {
    const response = await SSR.API.graphql({ query: listPosts });
    return {
      props: {
        posts: response.data.listPosts.items,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {},
    };
  }
}

async function handleCreatePost(event : any, toxic: any) {
  event.preventDefault();

  // const form = new FormData(event.target);

  // try {
  //   const { data } : any = await API.graphql({
  //     authMode: 'AMAZON_COGNITO_USER_POOLS',
  //     query: createPost,
  //     variables: {
  //       input: {
  //         title: form.get('title'),
  //         content: form.get('content'),
  //         toxic: toxic
  //       }
  //     }
  //   });

  //   window.location.href = `/posts/${data.createPost.id}`;
  // } catch (errors : any) {
  //   console.error(...errors);
  //   throw new Error(errors[0].message);
  // }

  let threshold = 0.9;
  toxicity.load(threshold).then((model : any) => {
    const sentences = ['fuck you'];

    model.classify(sentences).then((predictions : any) => {
      // `predictions` is an array of objects, one for each prediction head,
      // that contains the raw probabilities for each input along with the
      // final prediction in `match` (either `true` or `false`).
      // If neither prediction exceeds the threshold, `match` is `null`.
  
      console.log(predictions);
      /*
      prints:
      {
        "label": "identity_attack",
        "results": [{
          "probabilities": [0.9659664034843445, 0.03403361141681671],
          "match": false
        }]
      },
      {
        "label": "insult",
        "results": [{
          "probabilities": [0.08124706149101257, 0.9187529683113098],
          "match": true
        }]
      },
      ...
       */
    });
  });

}

export default function Home({ posts = [] }) {

  const [value, setValue] = useState("")
  const [toxic, setToxic] = useState(false)

  const analyseToxic = () => {
    let result = false;
    const threshold = 0.9;

    toxicity.load(threshold).then((model : any) => {
      const sentences = [value];

      model.classify(sentences).then((predictions : any) => {
        // `predictions` is an array of objects, one for each prediction head,
        // that contains the raw probabilities for each input along with the
        // final prediction in `match` (either `true` or `false`).
        // If neither prediction exceeds the threshold, `match` is `null`.
    
        console.log(predictions);
        /*
        prints:
        {
          "label": "identity_attack",
          "results": [{
            "probabilities": [0.9659664034843445, 0.03403361141681671],
            "match": false
          }]
        },
        {
          "label": "insult",
          "results": [{
            "probabilities": [0.08124706149101257, 0.9187529683113098],
            "match": true
          }]
        },
        ...
         */
      });
    });


    
    // setToxic(result)
  }

  return (
    <div className="">
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1 className='text-5xl text-blue-500'>Authenticate</h1>
        <Authenticator>
        <h1 className="">Amplify + Next.js</h1>

        <p className="">
          <code className="">{posts.length}</code>
          posts
        </p>

        <div className="">
          {posts.map((post : any) => (
            <a className="" href={`/posts/${post.id}`} key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </a>
          ))}

          <div className="">
            <h3 className="">New Post</h3>

            
              <form onSubmit={(event)=>{handleCreatePost(event, toxic)}}>
                <fieldset>
                  <legend className='text-2xl'>Title</legend>
                  <input
                    defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                    name="title"
                  />
                </fieldset>

                <fieldset>
                  <legend>Content</legend>
                  <textarea
                    placeholder="I built an Amplify project with Next.js!"
                    name="content"
                    value={value}
                    onChange={(e)=>{
                      setValue(e.target.value);
                      console.log(value)
                      // analyseToxic()
                    }}
                  />
                </fieldset>

                <button>Create Post</button>
                <button type="button" onClick={() => Auth.signOut()}>
                  Sign out
                </button>
              </form>
            
          </div>
        </div>
        </Authenticator>
      </main>
    </div>
  );
}