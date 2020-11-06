import os
import time

from confluent_kafka import Producer
from pipeline import Port, Basin


def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result.
        Triggered by poll() or flush(). """
    if err is not None:
        print('Message delivery failed: {}'.format(err), flush=True)
    else:
        print('Message delivered to {} [{}]'.format(msg.topic(), msg.partition()), flush=True)


def init_pipeline():

    # Init objects
    pump_0 = Port('pump_0', desired=15, delta=9)
    pump_1 = Port('pump_1', desired=35)

    sink_0 = Port('sink_0', desired=15, delta=2)
    sink_1 = Port('sink_1', desired=35)

    basin_0 = Basin('basin_0', inlets=[pump_0, pump_1], outlets=[sink_0, sink_1])

    return [pump_0, pump_1, sink_0, sink_1], [basin_0]


"""
Main script
"""
if __name__ == '__main__':

    # Get required env vars
    brokers = os.environ.get('kafka_brokers')
    topic = os.environ.get('kafka_topic')

    # Safe init of the producer
    p = None
    while p is None:
        try:
            p = Producer({'bootstrap.servers': brokers})
        except:
            print(f"Producer not found, sleeping")
            time.sleep(5)
    print(f"Producer acquired, continuing!", flush=True)

    # Generate pipeline model
    ports, basins = init_pipeline()

    print([str(port) for port in ports + basins], flush=True)

    while True:
        # main update loop
        # # Check for new params
        # update_pipeline()

        # First iterate all ports
        for port in ports:
            port.iterate()

        # Then all basins
        for basin in basins:
            basin.iterate()

        print([str(port).encode('utf-8') for port in ports + basins], flush=True)

        # Send updates from each sensor
        for element in ports + basins:
            p.produce(topic, str(element).encode('utf-8'), callback=delivery_report)

        time.sleep(3)
