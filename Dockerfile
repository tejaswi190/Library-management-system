FROM eclipse-temurin:17-jdk
WORKDIR /app

COPY backend ./backend

RUN cd backend && mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "backend/target/library-management-1.0.0.jar"]
