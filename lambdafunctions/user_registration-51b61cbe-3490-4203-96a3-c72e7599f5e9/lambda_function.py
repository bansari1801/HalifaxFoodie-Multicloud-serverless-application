import json
import boto3
import uuid
import math
def lambda_handler(event, context):
        print(event)
        user_name     = event["queryStringParameters"]["name"]
        user_email    = event["queryStringParameters"]["email"]
        user_password = event["queryStringParameters"]["password"]
        plaintext     = event["queryStringParameters"]["plaintext"]
        key_text      = event["queryStringParameters"]["key"]
        user_status   = False
        if event["queryStringParameters"]["usertype"] == "owner":
            user_type  = event["queryStringParameters"]["usertype"]
        else:
            user_type = "customer"
        cyphertext    = generateCipher(key_text,plaintext)
        #table = boto3.resource('dynamodb').Table('user_credentials')
        dynamodb = boto3.resource("dynamodb",
                                region_name="us-east-1",
                                aws_access_key_id="AKIA5GYHHADT5NZEPE45",
                                aws_secret_access_key="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")
        table = dynamodb.Table('user_credentials')                    
        response = table.update_item(
            Key={
                'user_email': user_email,
            },
            UpdateExpression="SET plaintext = :plaintext, key_text =:key_text, user_name = :user_name, user_password = :user_password, user_status = :user_status, user_type = :user_type, cypher= :cyphertext",
            ExpressionAttributeValues={
                ':user_name': user_name,
                ':user_password': user_password,
                ':user_status': user_status,
                ':user_type': user_type,
                ':cyphertext': cyphertext,
                ':key_text': key_text,
                ':plaintext': plaintext
            }
        )
        print("Adding User")
        print(response)
def generateCipher(key,plainText):
    cipher = ""
    k_indx = 0
    plainText_len = float(len(plainText))
    plainText_lst = list(plainText)
    key_lst = sorted(list(key))
    col = len(key)    
    row = int(math.ceil(plainText_len / col))
    fill_null = int((row * col) - plainText_len)
    plainText_lst.extend('_' * fill_null)
    matrix = [plainText_lst[i: i + col]
        for i in range(0, len(plainText_lst), col)]
    for _ in range(col):
        curr_idx = key.index(key_lst[k_indx])
        cipher += ''.join([row[curr_idx]
                        for row in matrix])
        k_indx += 1
    return cipher
    
    
    #https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html#using-lambda-response-format

#https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html