# Requirements Document

## Introduction

This document outlines the requirements for implementing a comprehensive user authentication and subscription system for Study Map, transforming it from a free application into a freemium product with premium features. The system will manage user accounts, track program views, and handle payments through Stripe integration.

## Glossary

- **Study Map**: The interactive web application for exploring Masters in Finance programs
- **User**: A registered individual with an account in the system
- **Program View**: When a user clicks on a school marker or opens a program modal to view details
- **Free Plan**: Default user plan allowing up to 5 program views
- **Premium Plan**: Paid plan (€20 one-time) providing unlimited access
- **Stripe**: Payment processing service for handling transactions
- **Firebase Auth**: Authentication service for user management
- **Supabase**: Database service for storing user data and subscription status

## Requirements

### Requirement 1: User Authentication System

**User Story:** As a visitor, I want to create an account or sign in so that I can access the Study Map application.

#### Acceptance Criteria

1. WHEN a user visits the application without being authenticated, THE System SHALL redirect them to the login page
2. THE System SHALL provide email/password registration and login functionality
3. THE System SHALL provide Google OAuth login integration
4. WHEN a user successfully registers, THE System SHALL create a user record with default free plan status
5. THE System SHALL securely manage user sessions using JWT tokens or Firebase Auth

### Requirement 2: Free Plan Access Control

**User Story:** As a free user, I want to view up to 5 programs so that I can explore the platform before deciding to upgrade.

#### Acceptance Criteria

1. WHEN a free user is created, THE System SHALL set their programs_viewed count to 0
2. THE System SHALL display a counter showing "X/5 programs viewed" in the user interface
3. WHEN a free user clicks on a school marker or opens program details, THE System SHALL increment their programs_viewed count
4. WHILE a free user has programs_viewed < 5, THE System SHALL allow access to program details
5. WHEN a free user reaches 5 programs_viewed, THE System SHALL display an upgrade prompt instead of program details

### Requirement 3: Premium Plan Management

**User Story:** As a user, I want to upgrade to Premium for €20 so that I can access unlimited programs.

#### Acceptance Criteria

1. THE System SHALL provide a pricing page displaying free vs premium plan comparison
2. WHEN a user clicks "Upgrade to Premium", THE System SHALL redirect to Stripe Checkout
3. THE System SHALL integrate Stripe Checkout with Apple Pay and Google Pay options
4. WHEN payment is successful, THE System SHALL update user plan to "premium" and payment_status to "paid"
5. WHILE a user has premium plan, THE System SHALL provide unlimited access to all programs

### Requirement 4: Payment Processing Integration

**User Story:** As a user, I want to pay securely with multiple payment methods so that I can easily upgrade my account.

#### Acceptance Criteria

1. THE System SHALL integrate Stripe Checkout for payment processing
2. THE System SHALL support credit/debit cards, Apple Pay, and Google Pay payment methods
3. WHEN payment is initiated, THE System SHALL create a Stripe customer record
4. THE System SHALL handle successful payment webhooks to update user status
5. THE System SHALL handle failed payments and display appropriate error messages

### Requirement 5: Access Control Middleware

**User Story:** As the system, I want to protect premium features so that only authorized users can access them.

#### Acceptance Criteria

1. THE System SHALL implement middleware to check authentication status on protected routes
2. WHEN an unauthenticated user accesses /map, THE System SHALL redirect to /login
3. WHEN a free user with 5+ programs_viewed accesses program details, THE System SHALL display upgrade prompt
4. THE System SHALL verify user plan status before allowing access to premium features
5. THE System SHALL maintain session security and handle token expiration

### Requirement 6: User Interface Components

**User Story:** As a user, I want clear visual indicators of my account status so that I understand my current plan and usage.

#### Acceptance Criteria

1. THE System SHALL display current plan status (Free/Premium) in the user interface
2. WHEN user is on free plan, THE System SHALL show programs viewed counter
3. THE System SHALL provide upgrade prompts with clear call-to-action buttons
4. THE System SHALL display success messages after successful payment
5. THE System SHALL provide account management interface for viewing subscription status

### Requirement 7: Database Schema Management

**User Story:** As the system, I want to store user data securely so that I can manage accounts and subscriptions effectively.

#### Acceptance Criteria

1. THE System SHALL create users table with id, email, password, plan, programs_viewed, payment_status, stripe_customer_id, created_at fields
2. THE System SHALL encrypt sensitive user data including passwords
3. THE System SHALL maintain referential integrity between users and their subscription data
4. THE System SHALL log payment transactions for audit purposes
5. THE System SHALL implement proper database indexing for performance

### Requirement 8: Pricing Page Implementation

**User Story:** As a visitor, I want to see clear pricing information so that I can choose the right plan for my needs.

#### Acceptance Criteria

1. THE System SHALL provide a dedicated pricing page at /pricing
2. THE System SHALL display two plan cards: Free (€0) and Premium (€20)
3. THE System SHALL highlight Premium plan features and benefits
4. THE System SHALL include "Best Value" badge on Premium plan
5. THE System SHALL provide clear call-to-action buttons for each plan