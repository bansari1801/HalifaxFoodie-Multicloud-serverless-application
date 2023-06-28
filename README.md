# Multicloud serverless application

Used different kinds of AWS and GCP services to create the application.
There are different modules:
## User Module
Related to registering new users and authenticating them with our system. The 
authentication module is like the user needs to complete a three-step multi-factored 
authentication.

Services used 
# AWS Cognito, Fire store, Lambda, Dynamo DB and cloud function.

## Online Support Module
The restaurant owner / customer can interact with the application with the help of a chatbot. 
It helps the user to navigate throughout the website by providing the link.
The customer can track the order by proving the order number to the chatbot. Also, they can 
provide order rating through the chatbot. The restaurant owner can add recipe name and its 
price through the chatbot. Also, if the customer has any complaints, then the chatbot will 
redirect the user to a chat room where the user can directly chat with the restaurant 
representative.

Services used
# AWS Lex, AWS Lambda, AWS DynamoDB

## Chat Module
A chatroom will be initiated when the user hits on to “chat with an 
agent.” Now, this chatroom will be created with the help of the pub/sub cloud function, 
where the publisher will be the Lex chatbot and the subscriber will be the cloud function, 
for that specific user and the restaurant agent, which we will get from the firestore 
database.

Services used
# Pub/Sub cloud function, Google Firestore

## Data Processing
The restaurant owner can upload the recipe file of the food dishes to the cloud 
storage along with recipe name and its price which will be stored in a database, and essential 
information about the food recipe, such as key ingredients, will be extracted automatically on 
click of a button from the file and will be stored as metadata in the database.

Services used
# AWS S3, AWS DynamoDB, AWS Lambda, AWS Comprehend

## Visualization
Related to visualizing the application data related to recipes and the number of users currently logged into the system.

Services used:
# Firestore, Google Data Studio, BigQuery ML, DynamoDB

## Machine Learning
The similarity score of the recipes that have been uploaded will be evaluated, and services 
like GCP AutoML will be used to carry this out. The machine learning model would be trained 
using a dataset of previously uploaded recipes until the desired level of accuracy was 
attained. Future predictions will be made using this trained model, which will be deployed to 
an API endpoint.

Services used:
# AutoML, GCP Cloud Function, ReactJS

## Message Passing
This module is built on the Google Pub-Sub service's publish-subscribe mechanism, which will be 
used. Publishers may send out a topic for subscribers to subscribe to. Without considering how or 
when these events should be processed, publishers send events to the Pub/Sub service. Following 
that, Pub/Sub distributes events to all the services that respond to them.

Services used:
# AWS Lambda, Firebase, GCP Pub/Sub