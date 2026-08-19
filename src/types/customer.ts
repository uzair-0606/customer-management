export type EmailStatus =
  | "PENDING"
  | "SENT"
  | "FAILED";

export type Customer = {
  id: string;

  firstName: string;
  middleName: string | null;
  lastName: string;

  age: number;

  contactNumber1: string;
  contactNumber2: string | null;

  email: string;
  emailStatus: EmailStatus;

  address: string;

  createdAt: string;
  updatedAt: string;

  createdById: string;

  createdBy?: {
    id: string;
    name: string;
    email: string;
    role?: "SUPER_ADMIN" | "EMPLOYEE";
  };
};