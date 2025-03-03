# Event Manager - REST API

This project is a basic REST API for an Event Manager. It provides endpoints to manage events, assignments, and organizers. The API is built using Node.js and Express.

## File Structure
```
Event_Manager/
├── controller/
│   ├── assignment_controller.js
│   ├── event_controller.js
│   ├── organiser_controller.js
├── data/
│   ├── data.js
├── node_modules/
├── routes/
│   ├── assignment_routes.js
│   ├── event_routes.js
│   ├── organiser_routes.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── server.js
```

## Description

- **`server.js`**: The main entry point for the application. It sets up the Express server and includes the basic code for the Event Manager without the controller and routes in commented form. If you face any difficulty, you can refer to the `package.json` file to see the required packages.
- **`controller/`**: Contains the logic for handling requests related to assignments, events, and organizers.
- **`routes/`**: Defines the API endpoints for assignments, events, and organizers.
- **`data/`**: Right now contains data in temporary form in temporary arrays
- **`package.json`**: Lists the project dependencies and scripts.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JapitSinghSaikap/Event_Manager.git
  
