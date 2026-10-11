# Stage 1: Build stage using Maven and Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Cache Maven dependencies by copying pom.xml first
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy project source code and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production runtime stage using Java 21 JRE
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Create non-root system user and prepare storage directories
RUN groupadd -r appgroup && useradd -r -g appgroup appuser \
    && mkdir -p /app/storage/uploads /app/storage/thumbnails \
    && chown -R appuser:appgroup /app

# Copy the generated JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:appgroup app.jar

# Switch to non-root user
USER appuser

# Default port configuration for local testing and cloud environments (Render overrides PORT)
ENV PORT=8080
EXPOSE 8080

# Production startup command configured to bind Spring Boot to Render's dynamic PORT
ENTRYPOINT ["sh", "-c", "exec java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]
