#references- 
# 1) https://levelup.gitconnected.com/how-to-use-google-pub-sub-to-build-an-asynchronous-messaging-system-in-python-3b43094627dc
# 2) https://cloud.google.com/functions/docs/calling/pubsub
# 3) https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/acknowledge

from google.cloud import firestore
from google.cloud import pubsub_v1
from google.api_core.exceptions import DeadlineExceeded
from google.api_core import retry
import base64
import re
def hello_world(request):
    print(request.get_json())
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path("serverless-fall-2022-b00909479", "customer_complaint_queue")
    NUM_MESSAGES = 1
    
    with subscriber:  
        response = subscriber.pull(
            request={"subscription": subscription_path, "max_messages": NUM_MESSAGES},
            retry=retry.Retry(deadline=300),
        )
        if len(response.received_messages) == 0:
            return "No messages in queue"
        ack_ids = []
        db = firestore.Client()
        
        for received_message in response.received_messages:
            print(received_message)
            dt = str(received_message.message.data)
            dt += '=' * (-len(dt) % 4)
            lst = re.findall('\S+@\S+', dt)
            print(lst)     
            doc_ref = db.collection(u'chat').document(lst[0])
            doc_ref.set({
              u'customerEmail': str(lst[0]),
              u'restaurantName': "PassageToIndia",
              u'restaurantEmail': "passagetoindia@gmail.com"
            })
            print(f"Received: {received_message.message.data}.")
            
            ack_ids.append(received_message.ack_id)
        #using this so not to send the messages again
        subscriber.acknowledge(
            request={"subscription": subscription_path, "ack_ids": ack_ids}
        )
        print(
            f"Received and acknowledged {len(response.received_messages)} messages from {subscription_path}."
        )
        return response.received_messages[0].message.data