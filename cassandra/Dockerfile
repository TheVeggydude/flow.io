FROM cassandra:latest

COPY ./cassandra-init.sh ./

RUN apt-get update && apt-get install -y dos2unix && dos2unix cassandra-init.sh

CMD ["sh", "./cassandra-init.sh"]