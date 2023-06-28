import json
import boto3
import random
import urllib3


from boto3.dynamodb.conditions import Key, And, Attr


def getNavigationLink(name):
    
    if name == "REGISTER USER":
        return "Here is the link to the registration page : https://www.gmail.com"
    if name == "CHAT":
        return "Here is the link to chat with our representative : LINK"
    if name == "UPLOAD RECIPE":
        return "Here is the link to upload recipes : LINK"
    if name == "VISUALIZE":
        return "Here is the link to visualize the data : LINK"    
        
def validateSlot(slot):
    
    if not slot['email']:
        
        return {
            "isValid": False,
            "violatedSlot": "email"
        }
    if not slot['trackingNumber']:
        
        return {
            "isValid": False,
            "violatedSlot": "trackingNumber"
        }
        
    return {
        "isValid": True
    }

def validateSlotForOrderRating(slot):
    if not slot['email']:
        
        return {
            "isValid": False,
            "violatedSlot": "email"
        }
        
    if not slot['orderNumber']:
        
        return {
            "isValid": False,
            "violatedSlot": "orderNumber"
        }
    
    if not slot['rating']:
        
        return {
            "isValid": False,
            "violatedSlot": "rating"
        }    
        
    return {
        "isValid": True
    }

def validateSlotForAddingRecipe(slot):
    if not slot['name']:
        
        return {
            "isValid": False,
            "violatedSlot": "name"
        }
    
    if not slot['price']:
        
        return {
            "isValid": False,
            "violatedSlot": "price"
        }    
        
    return {
        "isValid": True
    }
    
    

def authenticateUser(email, userType):
    print(email)
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('user_credentials')
    
    try:
                
        data = table.scan(FilterExpression=Attr("user_email").eq(email))
       
        item = data['Items']
        print(item)
    
    except Exception as e:
        print("exception")
        print(str(e))
        return False
    else:
        if (len(item) < 1):
            return False
        else:
            if ((item[0]['user_status'] == True) and (item[0]['user_type'] == userType)):
                return True
            return False
    
def checkForTrackingNumber(trackingNumber):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Order')
    
    try:
                
        data = table.scan(FilterExpression=Attr("trackingNumber").eq(trackingNumber))
            
        items = data['Items']
        
        print(items)
    
    except Exception as e:
        print(str(e))
        return False
    else:
        if(len(items) < 1):
            return False
        return items[0]
        
def checkForOrderNumber(orderNumber):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Order')
    
    try:
        print(orderNumber)        
        data = table.scan(FilterExpression=Attr("orderNumber").eq(orderNumber))
            
        items = data['Items']
        
        print(items)
    
    except Exception as e:
        print(str(e))
        return False
    else:
        if(len(items) < 1):
            return False
        return items[0]
    
        
def getFulfillmentResponse(sessionAttribute,intent,messageContent):
    return {
            "sessionState": {
                
                "sessionAttribute":sessionAttribute,
                
                "dialogAction": {
                    "type": "Close"
                },
                "intent": intent
            },
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": messageContent
                }
            ]
    }
    # to be removed
def getFulfillmentImageResponseCard(sessionAttribute,intent,messageContent):
    return {
            "sessionState": {
                
                "sessionAttribute":sessionAttribute,
                
                "dialogAction": {
                    "type": "Close"
                },
                "intent": intent
            },
            "messages": [
                {
                    "contentType": "ImageResponseCard",
                    "content": messageContent,
                    "imageResponseCard": {
                        "title": "<html><body>Hiii</body></html>",
                        "subtitle": "string",
                        # "imageUrl": "https://www.google.com",
                        "buttons": [
                            {
                                "text": "Click me",
                                "value" : "https://www.google.com"
                               
                            }
                        ]
                    }
                }
            ]
    }    
    
def getElicitResponse(sessionAttribute,elicitSlotName,intentName,slots,messageContent):
    
    if messageContent == "":
        messages = []
    else:
        messages = [
            {
                "contentType": "PlainText",
                "content": messageContent
            }
        ]
    
    return{
        
        "sessionState": {
            "sessionAttribute":sessionAttribute,
        
            "dialogAction": {
                'slotToElicit': elicitSlotName,
                "type": "ElicitSlot"
            },
            "intent": {
                'name':intentName,
                'slots': slots
            }
        },
        "messages": messages
    }

def saveOrderRating(slots):
    orderNumber = slots['orderNumber']["value"]['originalValue']
    ratingValue = slots['rating']["value"]['originalValue']
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Order')
    
    try:
        print(orderNumber)        
        data = table.scan(FilterExpression=Attr("orderNumber").eq(orderNumber))
            
        items = data['Items']
        
        print(items)
    
    except Exception as e:
        print(str(e))
        return False
    else:
        if(len(items) < 1):
            return False
            
        orderItem = items[0]
        
        try:
            
            response = table.put_item(
                Item={
                    "id":orderItem['id'],
                    "name": orderItem['name'],
                    "orderNumber":orderItem['orderNumber'],
                    "status":orderItem["status"],
                    "trackingNumber":orderItem["trackingNumber"],
                    "rating":ratingValue
                    
                })
        except:
            return False
        else:
            print("updated successfully")
            return

def saveRecipeToDB(name,price):
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Recipe')
    
    try:
        print(name)
        
        response = table.put_item(
            Item={
                "id": str(random.randint(1,100)),
                "name": name,
                "price": price
            }
        )
        
    except Exception as e:
        print(str(e))
        return False
    else:
        return
    

def lambda_handler(event, context):
    
    print(event)
    
    intentName = event['sessionState']['intent']['name']
    intent = event['sessionState']['intent']
    slots = event['sessionState']['intent']['slots']
   
    
    if intentName == "WebsiteNavigation":
        
        slots = event['sessionState']['intent']['slots']
        slotValue = slots["name"]["value"]["originalValue"]
        
        intent['state'] = 'Fulfilled'
        
        link = getNavigationLink(slotValue)
        
        response = getFulfillmentResponse({},intent,link)
    
    if intentName == "OrderTracking":
        print("order tracking intent called")
        print(slots)
        
        validatedSlots = validateSlot(slots)
        
        if validatedSlots['isValid']:
            print("all slots are validated")
            
            trackingNumber = slots['trackingNumber']["value"]["originalValue"]
                    
            # check if tracking number exists
            isTrackingNumberValid = checkForTrackingNumber(trackingNumber)
            
            if isTrackingNumberValid == False:
                print("User entered wrong tracking number")
              
                
                response = getElicitResponse({},'trackingNumber',intentName,slots,"The tracking number is invalid. Please enter correct tracking number and try again.")
                
            else:
                print("tracking number is valid, return its status")
                intent['state'] = 'Fulfilled'
                
                response = getFulfillmentResponse({},intent,"The status of the order is: " + isTrackingNumberValid['status'])
            
        else:
            if slots['email']:
                email = slots["email"]["value"]["originalValue"]
                if authenticateUser(email,'customer'):
                    print("user authenticated")
                    
                    if not slots['trackingNumber']:
                         response = getElicitResponse({},'trackingNumber',intentName,slots,"")
                else:
                    response = getFulfillmentResponse({},intent,"You are unauthorized to use this service. To use this service, you need to login into the system.")
                    
            else:
                response = getElicitResponse({},'email',intentName,slots,"")
            
    if intentName == "OrderRating":
        print("order rating intent called")
            
        if(slots['email']):
            email = slots["email"]["value"]["originalValue"]
            
            if authenticateUser(email,'customer'):
                print(event['invocationSource'])
                if event['invocationSource'] == 'DialogCodeHook':
                    
                        validatedSlots = validateSlotForOrderRating(slots)
                    
                        if validatedSlots['isValid']:
                            
                            print("all slot values entered")
                            ratingValue = slots['rating']["value"]['originalValue']
                            
                            if ratingValue == 'Excellent' or ratingValue == 'Good' or ratingValue == 'Poor':
                                print("accepted Values")
                                if saveOrderRating(slots) == False:
                                    print("saving error")
                                   
                                    intent['state'] = 'Fulfilled'
                                    response = getFulfillmentResponse({},intent,"There was an error in saving the order rating. Please try again.")
                                   
                                   
                                else:
                                    print("saved suucessfully")
                                    intent['state'] = 'Fulfilled'
                                    response = getFulfillmentResponse({},intent,"Thank you for providing the order rating.")
                                   
                                    
                            else:
                                response = getElicitResponse({},'rating',intentName,slots,"Please enter correct rating value from the options provided")
                               
                        else:
                            
                            if slots['orderNumber']:
                                orderNumber = slots['orderNumber']["value"]["originalValue"]
                            
                                # check if order number exists
                                isOrderNumberValid = checkForOrderNumber(orderNumber)
                                
                                if isOrderNumberValid == False:
                                    print("User entered wrong order number")
                                    # intent['state'] = 'Fulfilled'
                                    
                                    response = getElicitResponse({},'orderNumber',intentName,slots,"The order number is invalid. Please enter correct order number and try again.")
                                    
                                else:
                                    print("order number is valid, return its status")
                                 
                                    response = getElicitResponse({},'rating',intentName,slots,"")
                                   
                            else:
                                response = getElicitResponse({},validatedSlots['violatedSlot'],intentName,slots,"")
            else:
                response = getFulfillmentResponse({},intent,"You are unauthorized to use this service. To use this service, you need to login into the system.")
        else:
            response = getElicitResponse({},'email',intentName,slots,"")
            
    if intentName == "AddRecipe":
        print("add recipe intent called")
        
        if slots['email']:
            email = slots["email"]["value"]["originalValue"]
            if authenticateUser(email,'owner'):
            
                if event['invocationSource'] == 'DialogCodeHook':
            
                    validatedSlots = validateSlotForAddingRecipe(slots)
                
                    if validatedSlots['isValid']:
                        
                        print("all slot values entered")
                        
                        recipeName = slots['name']["value"]['originalValue']
                        
                        price = slots['price']["value"]['originalValue']
                        
                        if saveRecipeToDB(recipeName,price) == False:
                            intent['state'] = 'Fulfilled'
                            response = getFulfillmentResponse({},intent,"There was an error in saving the recipe. Please try again.")
                        
                        else:
                            intent['state'] = 'Fulfilled'
                            response = getFulfillmentResponse({},intent,"You have successfully added the recipe name")

                    else:
                        
                        response = getElicitResponse({},validatedSlots['violatedSlot'],intentName,slots,"")
            else:
                print("doesnot exists")
                    
                response = getFulfillmentResponse({},intent,"You are unauthorized to use this service. To use this service, you need to logged in as restaurant owner.")
        else:
            response = getElicitResponse({},'email',intentName,slots,"")
    
    if intentName == "OrderComplaints":
        
        if slots['email']:
            email = slots["email"]["value"]["originalValue"]
            if authenticateUser(email,'customer'):
                
                url="https://us-central1-serverless-fall-2022-b00909479.cloudfunctions.net/publish_msg_to_customer_complaints?msg=" + email
            
                
                http = urllib3.PoolManager()
               
                cloudFunctionResponse = http.request('POST',url)
                
                intent['state'] = 'Fulfilled'
                response = getFulfillmentResponse({},intent,"Below is the link to chat with our representative. It will take 2-3 minutes: " + "Link")
         
            else:
                response = getFulfillmentResponse({},intent,"You are unauthorized to use this service. To use this service, you need to login into the system.")
        else:
            
            response = getElicitResponse({},'email',intentName,slots,"")
        
 
    return response