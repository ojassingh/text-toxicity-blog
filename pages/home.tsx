import "@aws-amplify/ui-react/styles.css";
import "../app/globals.css";
// pages/index.js
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify, API, Auth, withSSRContext } from "aws-amplify";
import Head from "next/head";
import awsExports from "../src/aws-exports";
import { createPost } from "../src/graphql/mutations";
import { listPosts } from "../src/graphql/queries";
require("@tensorflow/tfjs");
// const toxicity = require('@tensorflow-models/toxicity');
import * as toxicity from "@tensorflow-models/toxicity";
import { useState } from "react";
import { SignIn } from "@aws-amplify/ui-react/dist/types/components/Authenticator/SignIn";
import { useRouter } from "next/router";

Amplify.configure({ ...awsExports, ssr: true });

export async function getServerSideProps({ req }: any) {
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

async function handleCreatePost(event: any) {
  event.preventDefault();
  const router = useRouter();

  async function analyseToxic(value: any) {
    let result = false;
    const threshold = 0.9;
    let labelsToInclude = [
      "insult",
      "obscene",
      "severe_toxicity",
      "toxicity",
    ];

    let prediction = toxicity
      .load(threshold, labelsToInclude)
      .then(async (model) => {
        // Now you can use the `model` object to label sentences.
        let prediciton = await model.classify([value]).then((predictions) => {
          return predictions;
        });

        return prediciton;
      });
    return prediction;
  }

  const form = new FormData(event.target);
  let isToxic = await analyseToxic(form.get("content")).then((data) => {
    return data;
  });

  let toxic = isToxic;

  try {
    const { data }: any = await API.graphql({
      authMode: "AMAZON_COGNITO_USER_POOLS",
      query: createPost,
      variables: {
        input: {
          title: form.get("title"),
          content: form.get("content"),
          toxicity: JSON.stringify(isToxic),
        },
      },
    });

    router.reload();
  } catch (errors: any) {
    console.error(errors.errors[0]);
    // throw new Error(errors.errors[0]);
  }
}

export default function Home({ posts = [] }) {
  const [value, setValue] = useState("");

  return (
    <div className="text-chalk">
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-20">
        <Authenticator className="">
          <h1 className="text-5xl font-bold text-white">
            Blog with sentiment analysis
          </h1>

          <div className="">
            <p className="">{posts.length} post.</p>
          </div>

          <div className="">
            <div
              id="old-posts"
              className="outline outline-1 outline-text rounded-3xl p-10 flex flex-wrap"
            >
              {posts.map((post: any, i) => {
                const data = JSON.parse(post.toxicity)
                console.log(data)
                
                const insult = data[1]
                const obscene = data[2]
                const severe =  data[3]
                const toxic = data[6]

                return (
                  <div
                    className="p-10 outline outline-1 outline-two rounded-3xl"
                    key={post.id}
                  >
                    <h3 className="">
                      <strong>{i + 1}. Title: </strong> {post.title}
                    </h3>
                    <p>
                      <strong>Content: </strong>
                      {post.content}
                    </p>
                    <div id="measures" className="">
                    <div>
                      <strong>Insult: </strong>
                        Match: {insult.results[0].match ? "True" : "False"} | Probability: {insult.results[0].probabilities[1]}
                    </div>
                    <div>
                      <strong>Obscene: </strong>
                        Match: {obscene.results[0].match ? "True" : "False"} | Probability: {obscene.results[0].probabilities[1]}
                    </div>
                    <div>
                      <strong>Severe: </strong>
                        Match: {severe.results[0].match ? "True" : "False"} | Probability: {severe.results[0].probabilities[1]}
                    </div>
                    <div>
                      <strong>Toxicity: </strong>
                        Match: {toxic.results[0].match ? "True" : "False"} | Probability: {toxic.results[0].probabilities[1]}
                    </div>
                    </div>
                    
                  </div>
                );
              })}
            </div>

            <div className="">
              <h3 className="">New Post</h3>

              <form
                onSubmit={(event) => {
                  handleCreatePost(event);
                }}
              >
                <fieldset className="rounded-3xl">
                  <legend className="text-2xl">Title</legend>
                  <input
                    placeholder={`Today, ${new Date().toLocaleTimeString()}`}
                    defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                    name="title"
                  />
                </fieldset>

                <fieldset className="rounded-3xl">
                  <legend>Content</legend>
                  <textarea
                    placeholder="I built an Amplify project with Next.js!"
                    name="content"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      // console.log(value)
                      // analyseToxic()
                    }}
                  />
                </fieldset>

                <button className="rounded-2xl font-medium text-lg bg-one text-white p-4">
                  Create Post
                </button>
              </form>
            </div>
          </div>
          <button
            className="rounded-2xl p-4 font-medium text-lg bg-one text-white"
            type="button"
            onClick={() => Auth.signOut()}
          >
            Sign out
          </button>
        </Authenticator>
      </main>
    </div>
  );
}
