FROM --platform=linux/amd64 openjdk:21
LABEL authors="ropold"
EXPOSE 8080
COPY backend/target/worldquartethub.jar worldquartethub.jar
ENTRYPOINT ["java", "-jar", "worldquartethub.jar"]