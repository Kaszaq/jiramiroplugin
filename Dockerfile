FROM maven:3.6.2-jdk-11-slim AS build  
COPY src /usr/src/app/src  
COPY pom.xml /usr/src/app  
RUN mvn -f /usr/src/app/pom.xml clean package

FROM openjdk:11.0.4-jre-slim
COPY --from=build /usr/src/app/target/jira-plugin-miro-integration*.jar jira-plugin-miro-integration.jar
COPY startUp.sh startUp.sh
RUN chmod +x startUp.sh
USER 65534
EXPOSE 8080
CMD ./startUp.sh
