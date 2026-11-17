# DriveDeals — Quick Links & Environment Reference

## Application URLs
| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Vite + React (Pure JavaScript/JSX) |
| **Backend REST API** | [http://localhost:8080/api/v1](http://localhost:8080/api/v1) | Spring Boot REST Endpoints |
| **API Documentation (Swagger UI)** | [http://localhost:8080/api/v1/swagger-ui.html](http://localhost:8080/api/v1/swagger-ui.html) | Interactive OpenAPI 3.0 Documentation |
| **Actuator Health** | [http://localhost:8080/api/v1/actuator/health](http://localhost:8080/api/v1/actuator/health) | Backend health status & details |

---

## Database Configuration (MySQL Port 3306)
- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `drivedeals`
- **Username**: `root`
- **Password**: `root`
- **Connection URL**:
  `jdbc:mysql://localhost:3306/drivedeals?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- **Migrations**: Automated Flyway schema creation & catalogue seeding (`V1` & `V2`).

---

## Authentication Details & SMS Gateway
- **Type**: Real Mobile Number + OTP verification.
- **SMS Gateway**: [TextBee](https://textbee.dev) Live SMS Gateway
- **API Key**: `txb_0cSGWclNsMwHU6TxfOVPe09FjeCAjca8`
- **SMS Endpoint**: `https://api.textbee.dev/api/v1/gateway/send-sms`
- **Mock OTP (Development)**: Any 6 digits (e.g. `123456`) or the real 6-digit SMS code.
- **Token Type**: Bearer JWT.
- **Session Duration**: 7 days (`10,080` minutes) for seamless local testing.

---

## Handy Commands
```powershell
# Run Backend (Spring Boot with MySQL on Port 3306)
cd backend
.\mvnw.cmd spring-boot:run

# Run Frontend (Vite on Port 3000)
npm run dev

# Run Vitest Frontend Tests
npm run test

# Run Production Frontend Build
npm run build
```
