This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Here is a glance at it: 

<img width="1437" alt="Screenshot 2023-01-21 at 11 46 41 PM" src="https://user-images.githubusercontent.com/64021709/213901084-3771a34c-c44d-4b11-85db-64337768058f.png">
<img width="1440" alt="Screenshot 2023-01-21 at 11 47 10 PM" src="https://user-images.githubusercontent.com/64021709/213901109-b58096dd-7f98-4be2-9b9b-466a6dbe93ea.png">

# AWS Amplify Next.js Sentiment Analysis App with TensorFlow.js


This repository contains an AWS Amplify and Next.js-based web application that performs sentiment analysis on blog posts using TensorFlow.js' text toxicity detection model. The app allows users to input text, such as blog posts or comments, and analyze the sentiment of the content to detect any toxic or negative language.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Acknowledgments](#acknowledgments)

## Demo

Note (Update Jul 28 2023): this app is not in production anymore.


## Features

- Perform sentiment analysis on text content to detect toxicity and negativity.
- Real-time analysis with instant feedback to the user.
- Built with AWS Amplify for easy deployment and scalability.
- Utilizes TensorFlow.js' text toxicity detection model for accurate sentiment analysis.
- Responsive and user-friendly interface.

## Getting Started

To get the app up and running on your local machine, follow the instructions below.

### Prerequisites

- Node.js and npm must be installed. You can download them from [here](https://nodejs.org/).
- An AWS account is required for deploying the app using AWS Amplify.

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository

   ```
   
2. Install the required dependencies:

```bash
npm install
```

## Usage

1. Run the app on your local machine:

```bash
npm run dev
```

2. Open your web browser and navigate to http://localhost:3000 to access the app.

3. Enter the text you want to analyze in the provided input field and click the "Analyze" button.

4. The app will perform sentiment analysis on the text using TensorFlow.js' text toxicity detection model and display the results in real-time.

5. Explore the app and have fun analyzing different texts!


## Technologies

The app is built using the following technologies:

- Next.js: A popular React framework for server-side rendering and static site generation.
- AWS Amplify: A set of tools and services for building and deploying serverless applications on AWS.
- TensorFlow.js: A JavaScript library for machine learning, used here for text toxicity detection.
- React: A JavaScript library for building user interfaces.
- Tailwind CSS: A utility-first CSS framework for styling the app.


## Acknowledgments

- The TensorFlow.js team for providing the text toxicity detection model.
- The AWS Amplify team for making it easy to build scalable and secure applications.
- The Next.js and React communities for their valuable contributions.

Feel free to contribute to this repository by creating issues or pull requests. If you have any questions or feedback, please don't hesitate to reach out.

Happy sentiment analysis!

