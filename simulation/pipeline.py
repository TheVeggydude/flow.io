import json
from datetime import datetime, timezone
import random


class Port:

    """
    Ports are either sources or sinks of water, depending on whether they are used as outlets or inlets for a basin.
    They represent connections to the world outside of the model, such as pumps or drains.

    The desired param acts as the `valve` of the port. Altering this value will alter the production or draining of
    water by the port gradually, as set by the `delta` parameter.

    The difference between a port as a inlet or outlet for water in the system is given by how they are attached to the
    basins. Providing a port as an inlet for a basin will cause it to act like a pump for that basin, adding water to
    the system. If used in the outlets field it will cause a drain in the basin.
    """

    def __init__(self, name, production=0, desired=0, delta=1, limit=100):

        self.id = name
        self.production = production
        self.desired = desired
        self.delta = delta
        self.limit = limit

    def __str__(self):
        return json.dumps({
            "id": self.id,
            "type": "port",
            "production": self.production,
            "desired": self.desired,
            "delta": self.delta,
            "prod_limit": self.limit,
            "ts": str(datetime.now(timezone.utc)),
        })

    def iterate(self):
        """
        Computes the next iteration of the pump's state.
        """


        if self.production < self.desired:
            self.production += self.delta

            if self.production > self.desired:
                self.production = self.desired

        elif self.production > self.desired:
            self.production -= self.delta

            if self.production < self.desired:
                self.production = self.desired

        # Add some noise
        noise = (random.random() * 2) - 1
        self.production += noise

        if self.production > self.limit:
            self.production = self.limit


class Basin:

    def __init__(self, name, load=0, limit=100, inlets=None, outlets=None):
        if inlets is None:
            inlets = []

        if outlets is None:
            outlets = []

        self.id = name
        self.load = load
        self.limit = limit
        self.inlets = inlets
        self.outlets = outlets

    def __str__(self):
        return json.dumps({
            "id": self.id,
            "type": "basin",
            "load": self.load,
            "load_limit": self.limit,
            "inlets": [output.id for output in self.inlets],
            "outlets": [output.id for output in self.outlets],
            "ts": str(datetime.now(timezone.utc)),
        })

    def iterate(self):
        """
        Computes the next state of the basin by adding flow from the inlets and subtracting flow from the outlets.
        """

        # Adding inward flow
        for inlet in self.inlets:
            self.load += inlet.production

        # Subtracting outward flow
        for outlet in self.outlets:
            self.load -= outlet.production

        # Perform validation
        if self.load < 0:
            self.load = 0

        if self.load > self.limit:
            print(f"Basin '{self.id}' is overflowing!", flush=True)
