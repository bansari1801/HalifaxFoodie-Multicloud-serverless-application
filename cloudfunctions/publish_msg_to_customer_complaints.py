import os
from concurrent import futures
from google.cloud import pubsub_v1
def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    print("*************")
    print(request)
    publisher = pubsub_v1.PublisherClient()
    topic_name = 'projects/{project_id}/topics/{topic}'.format(
        project_id='serverless-fall-2022-b00909479',
        topic='customer_complains',  # Set this to something appropriate.
    )
    #publisher.create_topic(name=topic_name)
    future = publisher.publish(topic_name, bytes(request.args.get('msg'), 'utf-8'), spam='eggs')
    print(future.result())
    if request.args and 'msg' in request.args:
        return request.args.get('msg')
    elif request_json and 'msg' in request_json:
        return request_json['msg']
    else:
        return f'Hello World!'

         #https://cloud.google.com/pubsub/docs/create-subscription
        #https://cloud.google.com/pubsub/docs/publisher