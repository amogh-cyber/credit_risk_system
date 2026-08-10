/**
 * Pre-loaded sample dataset generator & CSV export helpers
 */
import { processCustomerBatch } from './mlEngine';

const EMPLOYMENT_TYPES = ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Contract'];

/**
 * Generate synthetic realistic customer dataset
 */
export function generateSampleCustomers(count = 120) {
  const rawCustomers = [];

  for (let i = 1; i <= count; i++) {
    const idNum = i.toString().padStart(4, '0');
    const customerId = `C${idNum}`;

    // Create realistic profile variations (30% low risk, 45% medium risk, 25% high risk)
    const tier = i % 10 < 3 ? 'low' : (i % 10 < 7 ? 'medium' : 'high');

    let income, loanAmount, loanDuration, existingCredits, employmentStatus, dependents, paymentHistory, debtRatio;

    if (tier === 'low') {
      income = 55000 + Math.floor(Math.random() * 65000);
      loanAmount = 10000 + Math.floor(Math.random() * 25000);
      loanDuration = [12, 24, 36, 48][Math.floor(Math.random() * 4)];
      existingCredits = Math.floor(Math.random() * 3) + 1;
      employmentStatus = ['Employed', 'Self-Employed', 'Retired'][Math.floor(Math.random() * 3)];
      dependents = Math.floor(Math.random() * 3);
      paymentHistory = 82 + Math.floor(Math.random() * 18); // 82 - 100
      debtRatio = parseFloat((0.12 + (Math.random() * 0.20)).toFixed(2)); // 12% - 32%
    } else if (tier === 'medium') {
      income = 32000 + Math.floor(Math.random() * 35000);
      loanAmount = 15000 + Math.floor(Math.random() * 30000);
      loanDuration = [24, 36, 48, 60][Math.floor(Math.random() * 4)];
      existingCredits = Math.floor(Math.random() * 4) + 1;
      employmentStatus = EMPLOYMENT_TYPES[Math.floor(Math.random() * EMPLOYMENT_TYPES.length)];
      dependents = Math.floor(Math.random() * 4);
      paymentHistory = 60 + Math.floor(Math.random() * 23); // 60 - 83
      debtRatio = parseFloat((0.30 + (Math.random() * 0.22)).toFixed(2)); // 30% - 52%
    } else {
      // High risk tier
      income = 18000 + Math.floor(Math.random() * 25000);
      loanAmount = 25000 + Math.floor(Math.random() * 40000);
      loanDuration = [48, 60, 72][Math.floor(Math.random() * 3)];
      existingCredits = Math.floor(Math.random() * 5) + 2;
      employmentStatus = ['Unemployed', 'Contract', 'Self-Employed'][Math.floor(Math.random() * 3)];
      dependents = Math.floor(Math.random() * 5);
      paymentHistory = 25 + Math.floor(Math.random() * 35); // 25 - 60
      debtRatio = parseFloat((0.48 + (Math.random() * 0.40)).toFixed(2)); // 48% - 88%
    }

    rawCustomers.push({
      CustomerID: customerId,
      Income: income,
      LoanAmount: loanAmount,
      LoanDuration: loanDuration,
      ExistingCredits: existingCredits,
      EmploymentStatus: employmentStatus,
      Dependents: dependents,
      PaymentHistory: paymentHistory,
      DebtRatio: debtRatio
    });
  }

  // Inject 5 explicit canonical sample rows from prompt spec:
  const canonicalRows = [
    { CustomerID: 'C001', Income: 45000, LoanAmount: 15000, LoanDuration: 24, ExistingCredits: 1, EmploymentStatus: 'Employed', Dependents: 1, PaymentHistory: 92, DebtRatio: 0.22 },
    { CustomerID: 'C002', Income: 32000, LoanAmount: 25000, LoanDuration: 48, ExistingCredits: 3, EmploymentStatus: 'Self-Employed', Dependents: 2, PaymentHistory: 65, DebtRatio: 0.44 },
    { CustomerID: 'C003', Income: 28000, LoanAmount: 35000, LoanDuration: 60, ExistingCredits: 4, EmploymentStatus: 'Unemployed', Dependents: 3, PaymentHistory: 35, DebtRatio: 0.68 },
    { CustomerID: 'C004', Income: 65000, LoanAmount: 20000, LoanDuration: 36, ExistingCredits: 1, EmploymentStatus: 'Employed', Dependents: 0, PaymentHistory: 95, DebtRatio: 0.18 },
    { CustomerID: 'C005', Income: 35000, LoanAmount: 30000, LoanDuration: 72, ExistingCredits: 3, EmploymentStatus: 'Contract', Dependents: 2, PaymentHistory: 48, DebtRatio: 0.58 }
  ];

  const fullRawDataset = [...canonicalRows, ...rawCustomers];
  return processCustomerBatch(fullRawDataset);
}

/**
 * Generate sample CSV string for user download
 */
export function getSampleCSVString() {
  const headers = "CustomerID,Income,LoanAmount,LoanDuration,ExistingCredits,EmploymentStatus,Dependents,PaymentHistory,DebtRatio\n";
  const rows = [
    "C1001,45000,15000,24,1,Employed,1,92,0.22",
    "C1002,32000,25000,48,3,Self-Employed,2,65,0.44",
    "C1003,28000,35000,60,4,Unemployed,3,35,0.68",
    "C1004,65000,20000,36,1,Employed,0,95,0.18",
    "C1005,35000,30000,72,3,Contract,2,48,0.58",
    "C1006,78000,18000,24,2,Employed,2,98,0.15",
    "C1007,24000,28000,48,2,Unemployed,1,42,0.72",
    "C1008,52000,22000,36,2,Self-Employed,1,85,0.28",
    "C1009,41000,19000,30,1,Employed,0,78,0.33",
    "C1010,19000,32000,60,5,Contract,3,28,0.85"
  ].join("\n");

  return headers + rows;
}
