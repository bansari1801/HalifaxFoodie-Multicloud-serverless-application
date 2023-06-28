import json
import boto3

def lambda_handler(event, context):
    print(event)
    
    user_email    = event["queryStringParameters"]["email"]
    user_status   = True
    
            
   # table = boto3.resource('dynamodb').Table('user_credentials')
   
    dynamodb = boto3.resource("dynamodb",
                                region_name="us-east-1",
                                aws_access_key_id="",
                                aws_secret_access_key="")
                                
    table = dynamodb.Table('user_credentials')
    response = table.update_item(
        Key={
            'user_email': user_email,
        },
        UpdateExpression="SET user_status = :user_status",
        ExpressionAttributeValues={
            ':user_status': user_status,
        }
    )
    print("Loggin In User")
    print(response)
#https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html#using-lambda-response-format

#https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html