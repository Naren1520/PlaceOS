# PlaceOS X - Autonomous Placement Intelligence Platform

A premium React-based placement management system with intelligent match scoring, risk prediction, and comprehensive analytics.

## 🎯 Features

### Core Intelligence
- **Resume Skill Extraction**: Automatic skill detection from resume text
- **Match Score Engine**: Calculates compatibility between student skills and job requirements
- **Risk Prediction**: Classifies students as low/medium/high risk based on performance
- **Smart Recommendations**: Suggests missing skills to improve job matches
- **Deadline Enforcement**: Prevents applications after job deadlines
- **Freeze System**: Global platform freeze for maintenance or results

### User Roles

#### 🎓 Student
- Upload and parse resume for skill extraction
- Browse jobs with personalized match scores
- Apply to jobs with real-time validation
- Track application status (applied, shortlisted, rejected, placed)
- View skill improvement suggestions
- See risk level assessment

#### 🏢 Company
- Post job openings with skill requirements
- View applications filtered by job
- See ranked candidates by match score
- Update application status
- Strict data isolation (only see own applications)

#### 👨‍💼 Coordinator (Admin)
- Platform-wide analytics dashboard
- Manage students and companies
- View skill gap analysis
- Monitor placement rates
- Toggle platform freeze
- Add new users to the system

## 🎨 Design System

- **Background**: #fdf6ec (warm cream)
- **Primary Color**: #b35c00 (rich orange)
- **Glassmorphism UI**: Frosted glass effects with soft shadows
- **Rounded Components**: rounded-2xl cards
- **Smooth Animations**: Hover effects with scale and shadow
- **Responsive**: Mobile-friendly design

## 🚀 Demo Accounts

Login with these test accounts:

- **Coordinator**: admin@placeos.com
- **Student**: john@student.com
- **Company**: hr@techcorp.com

## 📊 Intelligence Features

### Match Score Formula
```
matchScore = (matched skills / required skills) × 100
```

### Risk Level Calculation
- **High Risk**: Average match score < 50 or GitHub score < 50
- **Medium Risk**: Average match score 50-70 or GitHub score 50-70
- **Low Risk**: Average match score > 70 or GitHub score > 70

### Skill Gap Analysis
Identifies skills demanded by companies but missing in the student pool to guide training programs.

## 🔒 Security Features

- **Company Isolation**: Companies can only view their own jobs and applications
- **Deadline Validation**: Server-side checks prevent late applications
- **Freeze System**: Global control to block all transactions
- **Role-based Access**: Different dashboards for each user type

## 📱 Key Pages

### Student Pages
- Dashboard: Overview with stats and top matching jobs
- Browse Jobs: Search and filter with match scores
- Applications: Track all application statuses
- Profile: Upload resume and manage skills

### Company Pages
- Dashboard: Application overview and quick actions
- Post Job: Create job listings with skill requirements
- My Jobs: Manage all job postings
- Applications: Review and update candidate status

### Coordinator Pages
- Dashboard: Platform-wide statistics and charts
- Students: Manage student accounts and view analytics
- Companies: Monitor company activity
- Analytics: Deep insights with charts and graphs
- Settings: Platform freeze and user management

## 🎯 Business Logic

1. **Application Flow**:
   - Student applies → Creates application with match score
   - Company reviews → Updates status to shortlisted/rejected
   - Final decision → Marks as placed

2. **Match Scoring**:
   - Compares student skills with job requirements
   - Case-insensitive matching
   - Displays as percentage and visual badge

3. **Recommendations**:
   - Analyzes all jobs to find demanded skills
   - Suggests missing skills to students
   - Helps improve employability

## 🛠️ Technical Stack

- **React**: UI components and state management
- **React Router**: Client-side routing
- **Context API**: Global state management
- **Recharts**: Data visualization
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Sonner**: Toast notifications

## 💡 Usage Tips

1. **For Students**: Complete your profile first to see accurate match scores
2. **For Companies**: Use detailed skill requirements for better candidate matching
3. **For Coordinators**: Monitor skill gaps to organize training sessions

## 🔮 Future Enhancements

- Real resume file parsing (PDF/DOCX)
- Email notifications
- Advanced analytics with ML predictions
- Interview scheduling
- Document management
- Multi-language support

---

Built with ❤️ for modern placement management
