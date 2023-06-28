import boto3
import json


def lambda_handler(event, context):
  print(event)
  requestBody = json.loads(event['body'])
  print(type(requestBody))
  print(requestBody)

  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('RestaurantFeedback')
  
  try:
            
    table.put_item(
        Item={
            "id":requestBody['id'],
            "feedback": requestBody['feedback'],
            "restaurantId":requestBody['restaurantId']
        })
        
  except:
   
    response = {
      'statusCode': 400,
      'body':json.dumps({"message" : "There was an issue saving the feedback. Please try again."})
    }
  else:
   
    response = {
      'statusCode': 200,
      'body': json.dumps({"message" : "Feedback saved successfully."}),
    }
    print("updated successfully")
    
  print(response)
  return response