FROM mariadb:latest

COPY ./activate-event-scheduler.cnf /etc/mysql/conf.d/activate-event-scheduler.cnf

RUN chmod 644 /etc/mysql/conf.d/activate-event-scheduler.cnf
