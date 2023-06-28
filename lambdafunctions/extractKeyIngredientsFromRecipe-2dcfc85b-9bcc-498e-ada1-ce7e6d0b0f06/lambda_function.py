import boto3
import json
s3_client = boto3.client("s3")

S3_BUCKET_NAME = 'myuploadrecipefiles'

def lambda_handler(event, context):
  print(event)
  requestBody = json.loads(event['body'])
  print(type(requestBody))
  print(requestBody)
  object_key = requestBody['fileName']  # replace object key
  
#   object_key = "comprehend.txt"
# Reference:https://www.gcptutorials.com/post/how-to-read-files-from-s3-using-python-aws-lambda
  file_content = str(s3_client.get_object(
      Bucket=S3_BUCKET_NAME, Key=object_key)["Body"].read())
# Reference:https://github.com/srcecde/aws-tutorial-code/blob/master/lambda/lambda_comprehend.py
  comprehend = boto3.client("comprehend")
  
  entities = comprehend.detect_entities(Text=file_content, LanguageCode="en")
  storedEntities = []
  for entity in entities["Entities"]:
    storedEntities.append(entity['Text'])
# Reference:https://beabetterdev.com/2022/02/22/how-to-insert-into-a-dynamodb-table-with-boto3/
  
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('Recipe')
  
  try:
            
    table.put_item(
        Item={
            "id":requestBody['id'],
            "name": requestBody['name'],
            "fileName":requestBody['fileName'],
            "price":requestBody['price'],
            "entities": ','.join(storedEntities)
            
        })
  except:
   
    response = {
      'statusCode': 400,
      'body':json.dumps({"message" : "There was an issue extracting the key ingredients. Please try again."})
    }
  else:
   
    response = {
      'statusCode': 200,
      'body': json.dumps({"message" : "Key Ingredients extracted successfully."}),
    }
    print("updated successfully")
    
  print(response)
  return response