# StockFlow – Aluminium Inventory Management System

StockFlow is a full-stack **Aluminium Inventory Management System** developed using **React, Spring Boot, and MySQL**.

The system is designed to manage aluminium products, stock movements, purchases, sales, suppliers, customers, and inventory-related notifications through a simple web-based interface.

---

## Features

- User Registration
- User Login
- Forgot Password with Gmail OTP
- Dashboard
- Admin Dashboard
- Category Management
- Product Management
- Supplier Management
- Customer Management
- Purchase / Stock In
- Sales / Stock Out
- Automatic Stock Calculation
- Out-of-Stock Validation
- Low Stock Detection
- Low Stock Notifications
- Stock Movement History
- Notifications Management
- Settings
- Dark Mode
- Compact Mode
- Logout

---

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Web MVC
- Spring Validation
- Spring Mail

### Database
- MySQL

### Development Tools
- IntelliJ IDEA
- Visual Studio Code
- MySQL
- Git
- GitHub

---

## Project Structure

```text
StockFlow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── StockFlowAPI/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/stockflowapi/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── repository/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │       └── application.properties.example
│   │   └── test/
│   ├── pom.xml
│   └── mvnw
│
└── .gitignore
