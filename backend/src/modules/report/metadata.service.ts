export interface FieldMetadata {
  name: string;
  label: string;
  type: "string" | "number" | "date" | "boolean" | "enum" | "objectid";
  operators: string[];
  options?: { label: string; value: string | number }[];
}

export interface DataSourceMetadata {
  id: string;
  label: string;
  collectionName: string;
  fields: FieldMetadata[];
}

const STRING_OPERATORS = ["equals", "not_equals", "contains", "starts_with", "ends_with", "in", "not_in", "is_null", "is_not_null"];
const NUMBER_OPERATORS = ["equals", "not_equals", "gt", "lt", "gte", "lte", "between", "is_null", "is_not_null"];
const DATE_OPERATORS = ["equals", "not_equals", "gt", "lt", "gte", "lte", "between", "is_null", "is_not_null"];
const BOOLEAN_OPERATORS = ["equals", "is_null", "is_not_null"];
const ENUM_OPERATORS = ["equals", "not_equals", "in", "not_in", "is_null", "is_not_null"];

class MetadataService {
  public getMetadata(): DataSourceMetadata[] {
    return [
      {
        id: "users",
        label: "Users (Auth & Access)",
        collectionName: "users",
        fields: [
          { name: "_id", label: "User ID", type: "objectid", operators: ["equals", "not_equals"] },
          { name: "firstName", label: "First Name", type: "string", operators: STRING_OPERATORS },
          { name: "lastName", label: "Last Name", type: "string", operators: STRING_OPERATORS },
          { name: "email", label: "Email", type: "string", operators: STRING_OPERATORS },
          { name: "phone", label: "Phone", type: "string", operators: STRING_OPERATORS },
          { 
            name: "status", 
            label: "Status", 
            type: "enum", 
            operators: ENUM_OPERATORS,
            options: [
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
              { label: "Suspended", value: "SUSPENDED" }
            ]
          },
          { name: "createdAt", label: "Created Date", type: "date", operators: DATE_OPERATORS },
        ]
      },
      {
        id: "companies",
        label: "Companies",
        collectionName: "companies",
        fields: [
          { name: "_id", label: "Company ID", type: "objectid", operators: ["equals", "not_equals"] },
          { name: "name", label: "Company Name", type: "string", operators: STRING_OPERATORS },
          { name: "email", label: "Email", type: "string", operators: STRING_OPERATORS },
          { name: "phone", label: "Phone", type: "string", operators: STRING_OPERATORS },
          { name: "website", label: "Website", type: "string", operators: STRING_OPERATORS },
          { 
            name: "status", 
            label: "Status", 
            type: "enum", 
            operators: ENUM_OPERATORS,
            options: [
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]
          },
          { name: "createdAt", label: "Created Date", type: "date", operators: DATE_OPERATORS },
        ]
      },
      {
        id: "candidates",
        label: "Candidates",
        collectionName: "candidates",
        fields: [
          { name: "_id", label: "Candidate ID", type: "objectid", operators: ["equals", "not_equals"] },
          { name: "firstName", label: "First Name", type: "string", operators: STRING_OPERATORS },
          { name: "lastName", label: "Last Name", type: "string", operators: STRING_OPERATORS },
          { name: "email", label: "Email", type: "string", operators: STRING_OPERATORS },
          { name: "registrationNumber", label: "Registration No", type: "string", operators: STRING_OPERATORS },
          { name: "dob", label: "Date of Birth", type: "date", operators: DATE_OPERATORS },
          { name: "createdAt", label: "Created Date", type: "date", operators: DATE_OPERATORS },
        ]
      },
      {
        id: "exams",
        label: "Exams",
        collectionName: "exams",
        fields: [
          { name: "_id", label: "Exam ID", type: "objectid", operators: ["equals", "not_equals"] },
          { name: "title", label: "Exam Title", type: "string", operators: STRING_OPERATORS },
          { name: "code", label: "Exam Code", type: "string", operators: STRING_OPERATORS },
          { name: "duration", label: "Duration (mins)", type: "number", operators: NUMBER_OPERATORS },
          { name: "totalMarks", label: "Total Marks", type: "number", operators: NUMBER_OPERATORS },
          { 
            name: "status", 
            label: "Status", 
            type: "enum", 
            operators: ENUM_OPERATORS,
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Completed", value: "COMPLETED" }
            ]
          },
          { name: "startDate", label: "Start Date", type: "date", operators: DATE_OPERATORS },
          { name: "endDate", label: "End Date", type: "date", operators: DATE_OPERATORS },
        ]
      },
      {
        id: "invoices",
        label: "Invoices & Payments",
        collectionName: "invoices",
        fields: [
          { name: "_id", label: "Invoice ID", type: "objectid", operators: ["equals", "not_equals"] },
          { name: "invoiceNumber", label: "Invoice Number", type: "string", operators: STRING_OPERATORS },
          { name: "amount", label: "Amount", type: "number", operators: NUMBER_OPERATORS },
          { name: "currency", label: "Currency", type: "string", operators: STRING_OPERATORS },
          { 
            name: "status", 
            label: "Status", 
            type: "enum", 
            operators: ENUM_OPERATORS,
            options: [
              { label: "Paid", value: "PAID" },
              { label: "Unpaid", value: "UNPAID" },
              { label: "Overdue", value: "OVERDUE" }
            ]
          },
          { name: "issueDate", label: "Issue Date", type: "date", operators: DATE_OPERATORS },
          { name: "dueDate", label: "Due Date", type: "date", operators: DATE_OPERATORS },
        ]
      }
    ];
  }

  public getDataSourceMetadata(dataSourceId: string): DataSourceMetadata | undefined {
    return this.getMetadata().find((ds) => ds.id === dataSourceId);
  }
}

export default new MetadataService();
