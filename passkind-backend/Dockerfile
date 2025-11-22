FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .
# We don't copy src yet because we mount it in docker-compose
# But for the initial build/dependency download we might want to run something.
# However, since we mount '.', the local src will be visible.

CMD ["mvn", "spring-boot:run"]
