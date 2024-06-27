# Todo Application -API

This project implements a backend service for a Todo application. The service provides APIs for managing and retrieving todo items, with various filtering options. The backend is built using Node.js, Express, and SQLite.

## Database Schema

### Todo Table

| Column   | Type    |
| -------- | ------- |
| id       | INTEGER |
| todo     | TEXT    |
| category | TEXT    |
| priority | TEXT    |
| status   | TEXT    |
| due_date | DATE    |

### Notes

- Replace spaces in URL with `%20`.
- Possible values for `priority` are `HIGH`, `MEDIUM`, and `LOW`.
- Possible values for `status` are `TO DO`, `IN PROGRESS`, and `DONE`.
- Possible values for `category` are `WORK`, `HOME`, and `LEARNING`.
- Use the format `yyyy-MM-dd` for formatting dates with the date-fns `format` function.

## API Endpoints

### Invalid Scenarios for All APIs

- **Invalid Status**
  - **Response**
    - **Status code:** 400
    - **Body:** `Invalid Todo Status`
- **Invalid Priority**
  - **Response**
    - **Status code:** 400
    - **Body:** `Invalid Todo Priority`
- **Invalid Category**
  - **Response**
    - **Status code:** 400
    - **Body:** `Invalid Todo Category`
- **Invalid Due Date**
  - **Response**
    - **Status code:** 400
    - **Body:** `Invalid Due Date`

### API 1

#### Path: `/todos/`

#### Method: `GET`

- **Scenario 1**
  - **Sample API:** `/todos/?status=TO%20DO`
  - **Description:** Returns a list of all todos whose status is 'TO DO'
  - **Response:**
    ```json
    [
      {
        "id": 2,
        "todo": "Buy a Car",
        "priority": "MEDIUM",
        "status": "TO DO",
        "category": "HOME",
        "dueDate": "2021-09-22"
      },
      ...
    ]
    ```

- **Scenario 2**
  - **Sample API:** `/todos/?priority=HIGH`
  - **Description:** Returns a list of all todos whose priority is 'HIGH'
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "todo": "Learn Node JS",
        "priority": "HIGH",
        "status": "IN PROGRESS",
        "category": "LEARNING",
        "dueDate": "2021-03-16"
      },
      ...
    ]
    ```

- **Scenario 3**
  - **Sample API:** `/todos/?priority=HIGH&status=IN%20PROGRESS`
  - **Description:** Returns a list of all todos whose priority is 'HIGH' and status is 'IN PROGRESS'
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "todo": "Learn Node JS",
        "priority": "HIGH",
        "status": "IN PROGRESS",
        "category": "LEARNING",
        "dueDate": "2021-03-16"
      },
      ...
    ]
    ```

- **Scenario 4**
  - **Sample API:** `/todos/?search_q=Buy`
  - **Description:** Returns a list of all todos whose todo contains 'Buy' text
  - **Response:**
    ```json
    [
      {
        "id": 2,
        "todo": "Buy a Car",
        "priority": "MEDIUM",
        "status": "TO DO",
        "category": "HOME",
        "dueDate": "2021-09-22"
      },
      ...
    ]
    ```

- **Scenario 5**
  - **Sample API:** `/todos/?category=WORK&status=DONE`
  - **Description:** Returns a list of all todos whose category is 'WORK' and status is 'DONE'
  - **Response:**
    ```json
    [
      {
        "id": 4,
        "todo": "Fix the bug",
        "priority": "MEDIUM",
        "status": "DONE",
        "category": "WORK",
        "dueDate": "2021-01-25"
      },
      ...
    ]
    ```

- **Scenario 6**
  - **Sample API:** `/todos/?category=HOME`
  - **Description:** Returns a list of all todos whose category is 'HOME'
  - **Response:**
    ```json
    [
      {
        "id": 2,
        "todo": "Buy a Car",
        "priority": "MEDIUM",
        "status": "TO DO",
        "category": "HOME",
        "dueDate": "2021-09-22"
      },
      ...
    ]
    ```

- **Scenario 7**
  - **Sample API:** `/todos/?category=LEARNING&priority=HIGH`
  - **Description:** Returns a list of all todos whose category is 'LEARNING' and priority is 'HIGH'
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "todo": "Learn Node JS",
        "priority": "HIGH",
        "status": "IN PROGRESS",
        "category": "LEARNING",
        "dueDate": "2021-03-16"
      },
      ...
    ]
    ```

### API 2

#### Path: `/todos/:todoId/`

#### Method: `GET`

#### Description: Returns a specific todo based on the todo ID

#### Response:
```json
{
  "id": 1,
  "todo": "Learn Node JS",
  "priority": "HIGH",
  "status": "IN PROGRESS",
  "category": "LEARNING",
  "dueDate": "2021-03-16"
}
```

### API 3

#### Path: `/agenda/`

#### Method: `GET`

#### Description: Returns a list of all todos with a specific due date in the query parameter `/agenda/?date=2021-12-12`

#### Response:
```json
[
  {
    "id": 3,
    "todo": "Clean the garden",
    "priority": "LOW",
    "status": "TO DO",
    "category": "HOME",
    "dueDate": "2021-12-12"
  },
  ...
]
```

### API 4

#### Path: `/todos/`

#### Method: `POST`

#### Description: Create a todo in the todo table

#### Request:
```json
{
  "id": 6,
  "todo": "Finalize event theme",
  "priority": "LOW",
  "status": "TO DO",
  "category": "HOME",
  "dueDate": "2021-02-22"
}
```

#### Response:
```
Todo Successfully Added
```

### API 5

#### Path: `/todos/:todoId/`

#### Method: `PUT`

#### Description: Updates the details of a specific todo based on the todo ID

- **Scenario 1**

  - **Request:**
    ```json
    {
      "status": "DONE"
    }
    ```
  - **Response:**
    ```
    Status Updated
    ```

- **Scenario 2**

  - **Request:**
    ```json
    {
      "priority": "HIGH"
    }
    ```
  - **Response:**
    ```
    Priority Updated
    ```

- **Scenario 3**

  - **Request:**
    ```json
    {
      "todo": "Clean the garden"
    }
    ```
  - **Response:**
    ```
    Todo Updated
    ```

- **Scenario 4**

  - **Request:**
    ```json
    {
      "category": "LEARNING"
    }
    ```
  - **Response:**
    ```
    Category Updated
    ```

- **Scenario 5**

  - **Request:**
    ```json
    {
      "dueDate": "2021-01-12"
    }
    ```
  - **Response:**
    ```
    Due Date Updated
    ```

### API 6

#### Path: `/todos/:todoId/`

#### Method: `DELETE`

#### Description: Deletes a todo from the todo table based on the todo ID

#### Response:
```
Todo Deleted
```

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd todo-application
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Usage

- Ensure you have the `todoApplication.db` SQLite database set up with the `todo` table.
- Use a tool like Postman to interact with the APIs.

## Technologies Used

- Node.js
- Express.js
- SQLite
- date-fns (for date formatting)

**Export the express instance using the default export syntax.**
**Use Common JS module syntax.**

## License

This project is licensed under the MIT License.
