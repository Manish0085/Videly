# ---------- STAGE 1: Build ----------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy pom.xml and download dependencies first (better caching)
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests


# ---------- STAGE 2: Run ----------
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=builder /build/target/videostreaming-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render uses PORT env variable)
EXPOSE 8080

# Run Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
