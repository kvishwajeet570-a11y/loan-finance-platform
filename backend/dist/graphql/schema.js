"use strict";
// src/graphql/schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.typeDefs = (0, graphql_tag_1.gql) `
  scalar DateTime

  # ========================================
  # USER
  # ========================================

  type User {
    id: ID!
    name: String!
    email: String!
    phoneNo: String!
    role: String!
    isVerified: Boolean!
    isBlocked: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # ========================================
  # LOAN APPLICATION
  # ========================================

  type LoanApplication {
    id: ID!
    fullName: String!
    email: String!
    phone: String!
    loanType: String!
    amount: Float!
    dob: String
    panNo: String
    status: String!
    interestRate: Float
    tenureMonths: Int
    monthlyEMI: Float
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # ========================================
  # DASHBOARD
  # ========================================

  type DashboardStats {
    totalUsers: Int!
    totalLoans: Int!
    approvedLoans: Int!
    pendingLoans: Int!
    totalRevenue: Float!
  }

  # ========================================
  # INPUTS
  # ========================================

  input RegisterInput {
    name: String!
    email: String!
    phoneNo: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ApplyLoanInput {
    fullName: String!
    email: String!
    phone: String!
    loanType: String!
    amount: Float!
    dob: String
    panNo: String
  }

  # ========================================
  # QUERY
  # ========================================

  type Query {
    users: [User!]!

    user(id: ID!): User

    loans: [LoanApplication!]!

    loan(id: ID!): LoanApplication

    dashboardStats: DashboardStats!
  }

  # ========================================
  # MUTATION
  # ========================================

  type Mutation {
    register(input: RegisterInput!): User!

    login(input: LoginInput!): String!

    applyLoan(
      input: ApplyLoanInput!
    ): LoanApplication!
  }
`;
