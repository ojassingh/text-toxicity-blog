
import '@aws-amplify/ui-react/styles.css';
// pages/index.js
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify, API, Auth, withSSRContext } from 'aws-amplify';
import Head from 'next/head';
import awsExports from '../src/aws-exports';
import { createPost } from '../src/graphql/mutations';
import { listPosts } from '../src/graphql/queries';
require('@tensorflow/tfjs');
// const toxicity = require('@tensorflow-models/toxicity');
import * as toxicity from '@tensorflow-models/toxicity';
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

async function handleCreatePost(event : any) {
  event.preventDefault();

  async function analyseToxic(value: any){
    let result = false;
    const threshold = 0.9;
    let labelsToInclude = ["insult", "toxicity"];

    let prediction = toxicity.load(threshold, labelsToInclude).then(async model => {
    // Now you can use the `model` object to label sentences. 
    let prediciton = await model.classify([value]).then(predictions => {
      return predictions
    });

    return prediciton;
  });
    return prediction;
}


  const form = new FormData(event.target);
  let isToxic = await analyseToxic(form.get('content')).then(data => console.log("Data: ", data))


  // try {
  //   const { data } : any = await API.graphql({
  //     authMode: 'AMAZON_COGNITO_USER_POOLS',
  //     query: createPost,
  //     variables: {
  //       input: {
  //         title: form.get('title'),
  //         content: form.get('content'),
  //         toxic: isToxic
  //       }
  //     }
  //   });

  //   window.location.href = `/posts/${data.createPost.id}`;
  // } catch (errors : any) {
  //   console.error(...errors);
  //   throw new Error(errors[0].message);
  // }

}

export default function Home({ posts = [] }) {

  const [value, setValue] = useState("")

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

        <div className="">
          <p className="">{posts.length} yet.</p>
          posts
        </div>

        <div className="">
          {posts.map((post : any) => (
            <a className="" href={`/posts/${post.id}`} key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </a>
          ))}

          <div className="">
            <h3 className="">New Post</h3>

            
              <form onSubmit={(event)=>{handleCreatePost(event)}}>
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
                      // console.log(value)
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