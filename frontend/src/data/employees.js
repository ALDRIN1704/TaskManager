export const employees = [
  {
    id: "EMP001",
    name: "Arun",
    email: "arun@example.com",
    phone: "9876543210"
  },
  {
    id: "EMP002",
    name: "Aswin",
    email: "aswin@example.com",
    phone: "9876543211"
  },
  {
    id: "EMP003",
    name: "Infant",
    email: "infant@example.com",
    phone: "9876543212"
  },
  {
    id: "EMP004",
    name: "Kavi",
    email: "kavi@example.com",
    phone: "9876543213"
  },
  {
    id: "EMP005",
    name: "John",
    email: "john@example.com",
    phone: "9876543214"
  }
];

export const getEmployeeById = (id) => employees.find(emp => emp.id.toUpperCase() === (id || '').toUpperCase());
