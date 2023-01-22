import "@aws-amplify/ui-react/styles.css";
import "../app/globals.css";
// pages/index.js
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify, API, Auth, withSSRContext } from "aws-amplify";
import Head from "next/head";
import awsExports from "../src/aws-exports";
import { createPost, deletePost } from "../src/graphql/mutations";
import { listPosts } from "../src/graphql/queries";
require("@tensorflow/tfjs");
// const toxicity = require('@tensorflow-models/toxicity');
import * as toxicity from "@tensorflow-models/toxicity";
import { useState } from "react";
import { SignIn } from "@aws-amplify/ui-react/dist/types/components/Authenticator/SignIn";
import { useRouter } from "next/router";
import { registerBackend } from "@tensorflow/tfjs";

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

  async function analyseToxic(value: any) {
    let result = false;
    const threshold = 0.9;
    let labelsToInclude = ["insult", "obscene", "severe_toxicity", "toxicity"];

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
    alert("Done. Refresh to check changes.");
  } catch (errors: any) {
    console.error(errors.errors[0]);
    // throw new Error(errors.errors[0]);
  }
}

async function deleteHandler(id: any) {
  try {
    const { data }: any = await API.graphql({
      authMode: "AMAZON_COGNITO_USER_POOLS",
      query: deletePost,
      variables: {
        input: {
          id: id,
        },
      },
    });
    alert("Done. Refresh to check changes.");
    console.log(data);
  } catch (errors: any) {
    console.error(errors.errors[0]);
    // throw new Error(errors.errors[0]);
  }
}

export default function Home({ posts = [] }) {
  const [value, setValue] = useState("");

  // console.log(posts)

  return (
    <div className="text-chalk">
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-20">
        <Authenticator className="">
          <h1 className="text-6xl font-bold text-white">Sentiment Analysis</h1>
          <p className="">Post count: {posts.length}</p>

          <div className="py-10">
          <h1 className="text-3xl font-bold pb-4">Check out your posts!</h1>

            {posts.length == 0 && <h1 className="text-xl font-bold">No older posts to display. Write a new one!</h1>}
            {posts.length > 0 && (
              <div
                id="old-posts"
                className="outline outline-1 outline-text rounded-3xl p-10 flex flex-wrap place-content-center gap-4"
              >
                {posts.map((post: any, i) => {
                  const data = (JSON.parse(post.toxicity));
                  console.log(data);

                  const insult = data[0];
                  const obscene = data[1];
                  const severe = data[2];
                  const toxic = data[3];
                  // console.log(post)
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
                      <div id="measures" className="py-2">
                        <div>
                          <strong>Insult: </strong>
                          Match: {insult.results[0].match ? <span className="text-green-500">True</span> : <span className="text-red-500 inline">False</span>} |
                          Probability: {insult.results[0].probabilities[1]}
                        </div>
                        <div>
                          <strong>Obscene: </strong>
                          Match: {obscene.results[0].match ? "True" : "False"} |
                          Probability: {obscene.results[0].probabilities[1]}
                        </div>
                        <div>
                          <strong>Severe: </strong>
                          Match: {severe.results[0].match ? "True" : "False"} |
                          Probability: {severe.results[0].probabilities[1]}
                        </div>
                        <div>
                          <strong>Toxicity: </strong>
                          Match: {toxic.results[0].match ? "True" : "False"} |
                          Probability: {toxic.results[0].probabilities[1]}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          deleteHandler(post.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
                </div>
            )}
            

            <div className="my-10 py-10 outline outline-1 outline-chalk rounded-3xl grid place-content-center gap-2">
              <h3 className="text-5xl text-chalk font-bold">New Post</h3>

              <form
                onSubmit={(event) => {
                  handleCreatePost(event);
                }}
              >
                <div className="py-2">
                  <fieldset className="rounded-3xl">
                    <legend className="text-2xl rounded-xl">Title</legend>
                    <input
                      className="text-black rounded-xl p-2"
                      placeholder={`Today, ${new Date().toLocaleTimeString()}`}
                      defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                      name="title"
                    />
                  </fieldset>
                </div>

                <div className="py-2">
                  <fieldset className="rounded-3xl">
                    <legend className="text-2xl rounded-xl">Content</legend>
                    <textarea
                      className="rounded-xl p-2 text-black"
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
                </div>

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
