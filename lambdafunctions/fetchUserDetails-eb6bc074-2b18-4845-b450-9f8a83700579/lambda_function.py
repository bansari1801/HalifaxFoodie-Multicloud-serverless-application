import boto3
import json
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    requestBody = json.loads(event['body'])

    print(requestBody)
  
    email = requestBody['email']
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('user_credentials')
    
    try:
        
        data = table.scan(FilterExpression=Attr("user_email").eq(email))
        item = data['Items'][0]
        
        responseObj = {
            "email": item['user_email'],
            "type": item['user_type'],
            "status": item['user_status']
        }
        
    except Exception as e:
        print(e)
        response = {
            'statusCode': 400,
            'body': json.dumps({"message":"Error while fetching"})
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps(responseObj)
    }
