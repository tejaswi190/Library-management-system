FROM maven:3.9.9-eclipse-temurin-17
WORKDIR /app

COPY backend ./backend

RUN cd backend && mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "backend/target/library-management-1.0.0.jar"]
