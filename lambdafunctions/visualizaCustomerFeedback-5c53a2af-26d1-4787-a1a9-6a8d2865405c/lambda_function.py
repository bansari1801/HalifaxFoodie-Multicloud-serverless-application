import boto3
import json
from boto3.dynamodb.conditions import Attr
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Reference:  https://www.shedloadofcode.com/blog/creating-your-own-website-analytics-solution-with-aws-lambda-and-google-sheets
#             https://medium.com/the-cloud-architect/getting-started-with-aws-lambda-layers-for-python-6e10b1f9a5d
#             https://www.twilio.com/blog/2017/02/an-easy-way-to-read-and-write-to-a-google-spreadsheet-in-python.html

def lambda_handler(event, context):
  
    requestBody = json.loads(event['body'])

    print(requestBody)
  
    restaurantId = requestBody['restaurantId']  

    # restaurantId = '1'
      
    comprehend = boto3.client("comprehend")
  
  
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('RestaurantFeedback')
    
    creds = ServiceAccountCredentials.from_json_keyfile_name('google-sheet-credentials.json')
    client = gspread.authorize(creds)
    
    gsheet = client.open("Customer Feedback Visualization").sheet1
    gsheet.clear()
    gsheet.insert_row(["Feedback","Polarity"])
    
    reviewList = []
    
    try:
        data = table.scan(FilterExpression=Attr("restaurantId").eq(restaurantId))
        items = data['Items']
        
        for item in items:
            print(item)
            
            sentiment = comprehend.detect_sentiment(
            Text=item['feedback'],
            LanguageCode='en'
            )
            
            row = [
                item['feedback'],
                sentiment['Sentiment']
                ]
                
            gsheet.insert_row(row,2)    
            
            reviewList.append({'feedback':item['feedback'],'polarity':sentiment['Sentiment']})
            
            response = {
                'statusCode': 200,
                'body': json.dumps({"reviews":reviewList})
            }
       
    except Exception as e:
        print(e)
        response = {
            'statusCode': 400,
            'body': json.dumps({"reviews":reviewList})
        }
    return response