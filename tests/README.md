# Testing Files for Anytime Pooja

This folder contains all testing and utility scripts for the Anytime Pooja project.

## 🧪 Available Tests

### Database & Connection Tests
- **`simple-test.js`** - Basic Supabase connection test
- **`check-schema.js`** - Comprehensive database schema verification
- **`test-supabase.js`** - Full Supabase functionality test
- **`create-schema.js`** - Database schema creation helper

## 🚀 How to Run Tests

### 1. Basic Connection Test
```bash
node tests/simple-test.js
```
Tests basic Supabase connection and environment variables.

### 2. Schema Verification
```bash
node tests/check-schema.js
```
Verifies all database tables are created properly and checks:
- ✅ All 14 tables exist
- ✅ Row Level Security (RLS) 
- ✅ Initial data (specialties, system settings)
- ✅ Authentication system

### 3. Full Supabase Test
```bash
node tests/test-supabase.js
```
Comprehensive test including:
- Connection test
- Authentication test
- Realtime functionality
- Database schema check

### 4. Schema Creation Helper
```bash
node tests/create-schema.js
```
Provides instructions for manual schema creation in Supabase dashboard.

## 📋 Test Results Summary

### ✅ Current Status (Last Check)
- **Connection**: ✅ Working
- **Database Tables**: ✅ 14/14 created
- **Initial Data**: ✅ 8 specialties, 5 system settings
- **RLS Security**: ✅ Configured
- **Authentication**: ✅ System ready

### 🔧 Prerequisites
Make sure you have:
1. `.env` file with Supabase credentials
2. `dotenv` package installed (`pnpm add dotenv`)
3. `@supabase/supabase-js` package installed
4. Database schema created in Supabase dashboard

## 🎯 Next Steps After Tests Pass
1. Start building backend services
2. Implement authentication flows
3. Create API endpoints
4. Test real-time communication features

## 📞 Support
If any tests fail, check:
1. Environment variables in `.env`
2. Supabase project status
3. Database schema creation
4. Network connectivity