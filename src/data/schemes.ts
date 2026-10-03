import type { Scheme } from '../types';

const T = (base: number[]) =>
  ['Apr','May','Jun','Jul','Aug','Sep'].map((month, i) => ({
    month,
    coverage: base[0] + i * 1.1,
    utilization: base[1] + i * 0.8 - (i === 4 ? 6 : 0),
    completion: base[2] + i * 1.3,
  }));

export const schemes: Scheme[] = [
  {
    id: 'pm-kisan', name: 'PM-KISAN', fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    ministry: 'Agriculture & Farmers Welfare', category: 'Income Support',
    beneficiaries: '82.4M', beneficiariesNum: 82.4, coverage: 84, utilization: 76, completion: 71,
    allocated: 18420, utilized: 13999, states: ['Maharashtra','Karnataka','Gujarat','Madhya Pradesh','Rajasthan'],
    trend: T([78, 72, 64]), description: 'Direct income support of ₹6,000/year to landholding farmer families in three instalments.',
    color: '#4f8cff',
  },
  {
    id: 'mgnrega', name: 'MGNREGA', fullName: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    ministry: 'Rural Development', category: 'Employment',
    beneficiaries: '54.2M', beneficiariesNum: 54.2, coverage: 71, utilization: 68, completion: 63,
    allocated: 14250, utilized: 9690, states: ['Maharashtra','Madhya Pradesh','Rajasthan','Gujarat','Karnataka'],
    trend: T([66, 64, 58]), description: 'Guarantees 100 days of wage employment per rural household per year.',
    color: '#34d399',
  },
  {
    id: 'jjm', name: 'Jal Jeevan Mission', fullName: 'Jal Jeevan Mission — Har Ghar Jal',
    ministry: 'Jal Shakti', category: 'Water & Sanitation',
    beneficiaries: '72.1M', beneficiariesNum: 72.1, coverage: 69, utilization: 61, completion: 58,
    allocated: 16800, utilized: 10248, states: ['Maharashtra','Gujarat','Madhya Pradesh','Rajasthan','Karnataka'],
    trend: T([60, 55, 50]), description: 'Functional household tap connections to every rural household.',
    color: '#38bdf8',
  },
  {
    id: 'pmay-g', name: 'PMAY-G', fullName: 'Pradhan Mantri Awaas Yojana — Gramin',
    ministry: 'Rural Development', category: 'Housing',
    beneficiaries: '32.8M', beneficiariesNum: 32.8, coverage: 66, utilization: 58, completion: 61,
    allocated: 12400, utilized: 7192, states: ['Maharashtra','Madhya Pradesh','Rajasthan','Karnataka','Gujarat'],
    trend: T([60, 54, 55]), description: 'Pucca houses with basic amenities for rural houseless households.',
    color: '#fbbf24',
  },
  {
    id: 'pmay-u', name: 'PMAY-U', fullName: 'Pradhan Mantri Awaas Yojana — Urban',
    ministry: 'Housing & Urban Affairs', category: 'Housing',
    beneficiaries: '18.4M', beneficiariesNum: 18.4, coverage: 62, utilization: 57, completion: 54,
    allocated: 9800, utilized: 5586, states: ['Maharashtra','Gujarat','Karnataka','Madhya Pradesh','Rajasthan'],
    trend: T([56, 52, 48]), description: 'Affordable urban housing through CLSS, AHP, BLC and ISSR verticals.',
    color: '#fb923c',
  },
  {
    id: 'pmjay', name: 'PM-JAY', fullName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    ministry: 'Health & Family Welfare', category: 'Health',
    beneficiaries: '55.6M', beneficiariesNum: 55.6, coverage: 74, utilization: 69, completion: 66,
    allocated: 8900, utilized: 6141, states: ['Maharashtra','Karnataka','Gujarat','Madhya Pradesh','Rajasthan'],
    trend: T([68, 64, 60]), description: 'Health cover of ₹5 lakh per family per year for secondary and tertiary care.',
    color: '#f472b6',
  },
  {
    id: 'mudra', name: 'PM Mudra', fullName: 'Pradhan Mantri Mudra Yojana',
    ministry: 'Finance', category: 'Credit & Livelihood',
    beneficiaries: '42.3M', beneficiariesNum: 42.3, coverage: 77, utilization: 72, completion: 70,
    allocated: 6400, utilized: 4608, states: ['Maharashtra','Karnataka','Gujarat','Rajasthan','Madhya Pradesh'],
    trend: T([71, 68, 65]), description: 'Collateral-free micro credit (Shishu / Kishore / Tarun) for small enterprises.',
    color: '#a78bfa',
  },
  {
    id: 'sbm', name: 'SBM-G', fullName: 'Swachh Bharat Mission — Gramin',
    ministry: 'Jal Shakti', category: 'Water & Sanitation',
    beneficiaries: '38.9M', beneficiariesNum: 38.9, coverage: 81, utilization: 74, completion: 79,
    allocated: 5200, utilized: 3848, states: ['Maharashtra','Gujarat','Karnataka','Madhya Pradesh','Rajasthan'],
    trend: T([76, 70, 74]), description: 'ODF sustainability, solid-liquid waste management and toilet coverage.',
    color: '#2dd4bf',
  },
  {
    id: 'pmfby', name: 'PMFBY', fullName: 'Pradhan Mantri Fasal Bima Yojana',
    ministry: 'Agriculture & Farmers Welfare', category: 'Insurance',
    beneficiaries: '28.5M', beneficiariesNum: 28.5, coverage: 63, utilization: 55, completion: 52,
    allocated: 7100, utilized: 3905, states: ['Maharashtra','Madhya Pradesh','Rajasthan','Karnataka','Gujarat'],
    trend: T([58, 51, 47]), description: 'Crop insurance against sowing-to-post-harvest losses at low farmer premium.',
    color: '#84cc16',
  },
  {
    id: 'vishwakarma', name: 'PM Vishwakarma', fullName: 'PM Vishwakarma Kaushal Samman',
    ministry: 'Micro, Small & Medium Enterprises', category: 'Skilling',
    beneficiaries: '12.6M', beneficiariesNum: 12.6, coverage: 54, utilization: 48, completion: 44,
    allocated: 3100, utilized: 1488, states: ['Maharashtra','Gujarat','Rajasthan','Karnataka','Madhya Pradesh'],
    trend: T([46, 42, 38]), description: 'End-to-end support for traditional artisans: skilling, toolkit, credit, marketing.',
    color: '#f87171',
  },
  {
    id: 'samagra', name: 'Samagra Shiksha', fullName: 'Samagra Shiksha Abhiyan',
    ministry: 'Education', category: 'Education',
    beneficiaries: '24.7M', beneficiariesNum: 24.7, coverage: 73, utilization: 66, completion: 64,
    allocated: 4800, utilized: 3168, states: ['Maharashtra','Karnataka','Madhya Pradesh','Gujarat','Rajasthan'],
    trend: T([67, 61, 58]), description: 'Integrated school education from pre-school to senior secondary.',
    color: '#60a5fa',
  },
  {
    id: 'pmgsy', name: 'PMGSY', fullName: 'Pradhan Mantri Gram Sadak Yojana',
    ministry: 'Rural Development', category: 'Infrastructure',
    beneficiaries: '19.2M', beneficiariesNum: 19.2, coverage: 68, utilization: 62, completion: 65,
    allocated: 5600, utilized: 3472, states: ['Maharashtra','Madhya Pradesh','Rajasthan','Karnataka','Gujarat'],
    trend: T([62, 57, 59]), description: 'All-weather road connectivity to unconnected rural habitations.',
    color: '#94a3b8',
  },
];

export const schemeById = (id: string) => schemes.find((s) => s.id === id);
