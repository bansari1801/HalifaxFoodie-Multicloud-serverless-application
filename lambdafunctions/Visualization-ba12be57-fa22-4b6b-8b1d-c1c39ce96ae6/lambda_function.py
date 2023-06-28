import json
import boto3
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Adding google json file credentials
credentials = ServiceAccountCredentials.from_json_keyfile_name('Google_key.json')
user = gspread.authorize(credentials)

#Opening google sheets 
Recipe = user.open("VisualData").sheet1
user_credentials = user.open("VisualData2").sheet1

def lambda_handler(event, context):
    
    # Adding external dynamodb credentials
    dynamodb = boto3.resource("dynamodb",
                            region_name="us-east-1",
                            aws_access_key_id="AKIA5GYHHADT5NZEPE45",
                            aws_secret_access_key="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")
    
    #Getting both the tables from dynamodb and stroing it in table1 and table 2
    table1 = dynamodb.Table('Recipe')
    table2 = dynamodb.Table('user_credentials')
    
    Recipe.clear()
    Recipe.insert_row(["Name","Price"])
    
    user_credentials.clear()
    user_credentials.insert_row(["Email","Status"])
    
    
    try:
        #selecting reqiured data and storing data in new vairables
        data = table1.scan()
        items= data['Items']
        
        for item in items:
            write_recipe(item['name'],item['price'])
    except Exception as e:
        print(e)
        
    try:
        #selecting reqiured data and storing data in new vairables
        data = table2.scan()
        items= data['Items']
        
        for item in items:
            write_status(item['user_email'],item['user_status'])
    except Exception as e:
        print(e)
            

    return {
        'statusCode': 200,
        "body": json.dumps("Record Updated"),
    }

#Function to get required parameters and writing data in the row  
def write_recipe(recipe_name, price):
    row = [
            recipe_name,
            price 
        ]
        
    #Inserting Recipe data into row where index is 2 
    Recipe.insert_row(row, 2)   

#Function to get required parameters and writing data in the row    
def write_status(user_email, user_status):
    row = [
            user_email,
            user_status
        ]
      
    #Inserting user_credentials data into row where index is 2   
    user_credentials.insert_row(row, 2)   
