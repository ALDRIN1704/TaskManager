export const employees = [
  {
    id: "EMP001",
    name: "Arun Kumar",
    email: "arun@example.com",
    phone: "9876543210"
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "9876543211"
  },
  {
    id: "EMP003",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    phone: "9876543212"
  },
  {
    id: "EMP004",
    name: "Sneha Reddy",
    email: "sneha@example.com",
    phone: "9876543213"
  },
  {
    id: "EMP005",
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "9876543214"
  }
];

export const getEmployeeById = (id) => employees.find(emp => emp.id.toUpperCase() === (id || '').toUpperCase());
