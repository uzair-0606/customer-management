export type Employee = {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: "EMPLOYEE";
  status: "ACTIVE" | "INACTIVE";
  joinedDate: string;
};