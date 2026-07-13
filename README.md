# Cloud-Based Healthcare Appointment Booking System

A full-stack cloud-native web application for booking healthcare appointments, built with React.js, Node.js, MySQL on AWS RDS, deployed on AWS EC2 with Docker and CI/CD via GitHub Actions.

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React.js   │────▶│  Node.js/Express │────▶│  MySQL (AWS RDS)│
│  (Frontend) │     │   (Backend API)  │     └─────────────────┘
│  Nginx      │     │   Port 5000      │
└─────────────┘     └──────────────────┘
       │                    │
       └────────────────────┘
              Docker / EC2
                   │
        ┌──────────┴──────────┐
        │                     │
    AWS S3               CloudWatch
  (Profile Images)      (Logs & Metrics)
```

## AWS Services Used

| Service | Purpose |
|---|---|
| EC2 | Host Docker containers (frontend + backend) |
| RDS (MySQL) | Managed relational database |
| S3 | Store doctor profile images |
| CloudWatch | Monitor logs, CPU, memory metrics |
| ECR | Store Docker images |
| IAM | Role-based access control |

---

## Features

### Patient
- Register / Login
- Search doctors by specialization
- Book appointments from available time slots
- View appointment history
- Cancel or reschedule appointments

### Doctor
- Login
- Set available time slots
- View patient appointments
- Accept or Reject appointments
- Upload profile image (stored in S3)

### Admin
- Dashboard with statistics (patients, doctors, appointments)
- Approve / Remove doctors
- Manage patients
- View all appointments

---

## Project Structure

```
23BQ1A0575/
├── backend/
│   ├── src/
│   │   ├── config/         # DB, S3, schema.sql
│   │   ├── controllers/    # auth, patient, doctor, admin
│   │   ├── middleware/     # JWT auth
│   │   ├── routes/         # auth, patient, doctor, admin
│   │   └── index.js        # Express entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── context/        # AuthContext
│   │   ├── components/     # Navbar
│   │   └── pages/          # Login, Register, Patient, Doctor, Admin
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/workflows/      # GitHub Actions CI/CD
├── docker-compose.yml
├── cloudwatch-config.json
├── iam-policy.json
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MySQL (or use Docker)

### Run with Docker Compose

```bash
# Clone the repo
git clone https://github.com/<your-username>/23BQ1A0575.git
cd 23BQ1A0575

# Set environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Start all services
docker-compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:5000
- Default Admin: admin@healthcare.com / admin123

### Run without Docker

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your DB and AWS values
node src/index.js

# Frontend (new terminal)
cd frontend
npm install
npm start
```

---

## AWS Deployment Guide

### 1. Launch EC2 Instance
- AMI: Amazon Linux 2
- Instance type: t2.micro (free tier)
- Security group: open ports 22, 80, 5000
- Attach IAM role with `iam-policy.json` permissions

### 2. Install Docker on EC2
```bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -aG docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Set up AWS RDS
- Engine: MySQL 8.0
- Instance: db.t3.micro
- Enable public access or place in same VPC as EC2
- Update `DB_HOST` in `.env` with the RDS endpoint

### 4. Set up S3 Bucket
```bash
aws s3 mb s3://healthcare-doctor-profiles --region us-east-1
aws s3api put-bucket-acl --bucket healthcare-doctor-profiles --acl public-read
```

### 5. Set up CloudWatch Agent on EC2
```bash
sudo yum install amazon-cloudwatch-agent -y
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -s \
  -c file:/home/ec2-user/healthcare/cloudwatch-config.json
```

### 6. CI/CD with GitHub Actions
Add these secrets to your GitHub repository (Settings → Secrets):

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_ACCOUNT_ID` | Your AWS account ID |
| `EC2_HOST` | EC2 public IP |
| `EC2_SSH_KEY` | EC2 private key (.pem contents) |

Every push to `main` will automatically build Docker images, push to ECR, and deploy to EC2.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register patient or doctor |
| POST | /api/auth/login | Login and get JWT token |

### Patient
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/patient/doctors | Search doctors |
| GET | /api/patient/doctors/:id/slots | Get available slots |
| POST | /api/patient/appointments | Book appointment |
| GET | /api/patient/appointments | View my appointments |
| PUT | /api/patient/appointments/:id/cancel | Cancel appointment |
| PUT | /api/patient/appointments/:id/reschedule | Reschedule appointment |

### Doctor
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/doctor/profile | Get profile |
| POST | /api/doctor/profile/image | Upload profile image to S3 |
| POST | /api/doctor/slots | Add time slot |
| GET | /api/doctor/slots | View my slots |
| GET | /api/doctor/appointments | View appointments |
| PUT | /api/doctor/appointments/:id/status | Accept/Reject appointment |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/dashboard | Dashboard statistics |
| GET | /api/admin/doctors | List all doctors |
| PUT | /api/admin/doctors/:id/approve | Approve doctor |
| DELETE | /api/admin/doctors/:id | Remove doctor |
| GET | /api/admin/patients | List all patients |
| DELETE | /api/admin/patients/:id | Remove patient |
| GET | /api/admin/appointments | View all appointments |

---

## Team Contribution (5 Members)

| Member | Module |
|---|---|
| Member 1 | Backend Auth + Database Schema + AWS RDS setup |
| Member 2 | Patient APIs + Patient Frontend pages |
| Member 3 | Doctor APIs + Doctor Frontend pages |
| Member 4 | Admin APIs + Admin Dashboard Frontend |
| Member 5 | Docker, CI/CD Pipeline, AWS EC2/S3/CloudWatch setup |
