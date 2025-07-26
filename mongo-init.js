// MongoDB initialization script
db = db.getSiblingDB('teamup_db');

// Create user for the application
db.createUser({
  user: 'teamup_user',
  pwd: 'teamup_password',
  roles: [
    {
      role: 'readWrite',
      db: 'teamup_db'
    }
  ]
});

// Create collections
db.createCollection('parents');
db.createCollection('students');
db.createCollection('classes');
db.createCollection('classregistrations');
db.createCollection('subscriptions');

// Create indexes for better performance
db.parents.createIndex({ "email": 1 }, { unique: true });
db.students.createIndex({ "parent_id": 1 });
db.classes.createIndex({ "day_of_week": 1, "time_slot": 1 });
db.classregistrations.createIndex({ "class_id": 1, "student_id": 1 }, { unique: true });
db.subscriptions.createIndex({ "student_id": 1, "end_date": 1 });

print('MongoDB initialized successfully!'); 