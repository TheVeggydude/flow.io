# set base image (host OS)
FROM python:3.6

# set the working directory in the container
WORKDIR /code

# install dependencies
RUN pip install confluent-kafka

# copy the content of the local src directory to the working directory
COPY . .

# command to run on container start
CMD [ "python", "./simulation.py" ]