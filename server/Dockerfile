# Use Maven image for building
FROM maven:latest AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml ./

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use OpenJDK for runtime
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/jira-ricefw-server-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
