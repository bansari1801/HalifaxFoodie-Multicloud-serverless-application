from google.cloud import pubsub_v1
from google.api_core.exceptions import DeadlineExceeded
from google.api_core import retry
def hello_world(request):
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path("serverless-fall-2022-b00909479", "customer_complaint_queue")
    NUM_MESSAGES = 1
    # Wrap the subscriber in a 'with' block to automatically call close() to
    # close the underlying gRPC channel when done.
    with subscriber:
        # The subscriber pulls a specific number of messages. The actual
        # number of messages pulled may be smaller than max_messages.
        response = subscriber.pull(
            request={"subscription": subscription_path, "max_messages": NUM_MESSAGES},
            retry=retry.Retry(deadline=300),
        )
        if len(response.received_messages) == 0:
            return "No messages in queue"
        ack_ids = []
        for received_message in response.received_messages:
            print(f"Received: {received_message.message.data}.")
            ack_ids.append(received_message.ack_id)
        # Acknowledges the received messages so they will not be sent again.
        subscriber.acknowledge(
            request={"subscription": subscription_path, "ack_ids": ack_ids}
        )
        print(
            f"Received and acknowledged {len(response.received_messages)} messages from {subscription_path}."
        )
        return response.received_messages[0].message.data

        #https://cloud.google.com/pubsub/docs/create-subscription
        #https://cloud.google.com/pubsub/docs/publisher