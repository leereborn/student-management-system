# student-management-system

Interview assessment demo - full stack student management app.

## Local Deployment

1. Set up DynamoDB local docker image as per https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html#docker
2. Clone the project
3. `npm install` in server directory
4. `npm install` in client directory
5. Create DynamoDB tables:

```
//create students table
aws dynamodb create-table --table-name students --attribute-definitions AttributeName=email,AttributeType=S --key-schema AttributeName=email,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000
//create course table
aws dynamodb create-table --table-name courses --attribute-definitions AttributeName=name,AttributeType=S --key-schema AttributeName=name,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000
//create result table
aws dynamodb create-table --table-name results --attribute-definitions AttributeName=courseName,AttributeType=S AttributeName=studentEmail,AttributeType=S --key-schema AttributeName=courseName,KeyType=HASH AttributeName=studentEmail,KeyType=RANGE --global-secondary-indexes 'IndexName=studentEmail,KeySchema=[{AttributeName=studentEmail,KeyType=HASH}],Projection={ProjectionType=ALL}' --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000
```

6. `npm start` in server directory
7. `npm start` in client directory

## Design Decisions

### API

**student** access patterns

```
Add or update to the system: POST /api/students
List all students: GET /api/students
Delete a student from the system: DELETE /api/students:email
```

**course** access patterns

```
Add or update to the system: POST /api/courses
List all courses: GET /api/courses
Delete a courses from the system: DELETE /api/courses:name
```

**result** access patterns

```
Add or update to the system: POST /api/results
List all results: GET /api/results
```

### Data modeling

Use non-relational database DynamoDB since

- No complex relationships between objects in the scope of requirement
- DynamoDB supports transactional updates (e.g. delete a student in both student and result table)

student table

- PK: email
- Other attributes: fisrtName, lastName, dateOfBirth

Course table:

- PK: name

Result table:

- PK: courseName(partition key) + studentEmail(sort key)
- Global Secondary Index(GSI): studentEmail(partition key)
  - We need GSI to delete results given a student
- Other attributes: studentName, score

## Appendix

Useful AWS CLI commands

```
// list tables
aws dynamodb list-tables --endpoint-url http://localhost:8000

// list items in a table
aws dynamodb scan --table-name students --endpoint-url http://localhost:8000
```

## TODO

- Refactor code to use modern javascript async/await instead of callback to simplify code (In progress)

## Future work

- [Alternative data modeling] Use denormed single-table DynamoDB schema. Can use a GSI (global secondary index) to provide alternative access patterns to the table.
