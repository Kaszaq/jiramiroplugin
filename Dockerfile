FROM openjdk:8-jre-alpine
ARG BUILD_DATE
ARG VERSION=DIRTY
ARG VCS_URL=??
ARG VCS_REF=??
LABEL org.label-schema.schema-version="1.0" \
  org.label-schema.name="jira-plugin-miro-integration"\
  org.label-schema.description="Application used to visualise metrics of Jira Projects"\
  org.label-schema.vendor="kaszaq.pl"\
  org.label-schema.maintainer="kaszaq@gmail.com" \
  org.label-schema.build-date="$BUILD_DATE" \
  org.label-schema.vcs-ref="$VCS_REF" \
  org.label-schema.vcs-url="$VCS_URL" \
  org.label-schema.version="$VERSION"

# Set URANDOM
RUN sed \
 -e 's#securerandom.source=file:/dev/random#securerandom.source=file:/dev/urandom#' \
 -i $JAVA_HOME/lib/security/java.security

ENV PROXY=""
RUN mkdir /storage
RUN chown nobody:nogroup /storage
VOLUME /storage
ENV STORAGE_DIR="/storage"

COPY target/jira-plugin-miro-integration*.jar jira-plugin-miro-integration.jar
COPY startUp.sh startUp.sh
RUN chmod +x startUp.sh
USER 65534
EXPOSE 8080
CMD ./startUp.sh
