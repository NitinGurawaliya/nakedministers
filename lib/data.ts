export type House = 'Lok Sabha' | 'Vidhan Sabha';

export interface CaseDetail {
  id: string;
  section: string;
  description: string;
  status: 'Pending' | 'Disposed' | 'Convicted';
  filedYear: number;
}

export interface AffidavitYear {
  year: number;
  netWorth: number;
  assets: number;
  liabilities: number;
  declaredIncome: number;
}

export interface VehicleInfo {
  count: number;
  description: string;
}

export interface PropertyInfo {
  count: number;
  cities: number;
  description: string;
}

export interface PartyHistoryEntry {
  year: number;
  constituency: string;
  party: string;
  partyShort: string;
  result: 'Won' | 'Lost';
}

export interface Politician {
  id: string;
  name: string;
  party: string;
  partyShort: string;
  constituency: string;
  state: string;
  house: House;
  age: number;
  currentTerm: string;
  photo: string;
  education: string;
  trendRank: number;
  growthPct: number;
  growthLabel: string;
  startYear: number;
  endYear: number;
  affidavits: AffidavitYear[];
  criminalCases: {
    before: number;
    after: number;
    details: CaseDetail[];
  };
  assets: {
    vehicles: VehicleInfo;
    properties: PropertyInfo;
    goldValue: number;
    loansGiven: number;
    bankAccounts: number;
    wealthRank: string;
  };
  partyHistory: PartyHistoryEntry[];
  source: string;
  sourceDate: string;
}

const STATES = [
  'Maharashtra',
  'Uttar Pradesh',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Bihar',
  'Kerala',
  'Punjab',
];

const PARTIES = [
  { name: 'Bharatiya Janata Party', short: 'BJP' },
  { name: 'Indian National Congress', short: 'INC' },
  { name: 'Aam Aadmi Party', short: 'AAP' },
  { name: 'All India Trinamool Congress', short: 'TMC' },
  { name: 'Dravida Munnetra Kazhagam', short: 'DMK' },
  { name: 'Shiv Sena (Uddhav Balasaheb Thackeray)', short: 'SHS' },
  { name: 'Nationalist Congress Party', short: 'NCP' },
  { name: 'Biju Janata Dal', short: 'BJD' },
];

export const AVERAGE_HOME_PRICE = 3500000;

export const POLITICIANS: Politician[] = [
  {
    id: 'rajesh-khanna',
    name: 'Rajesh Khanna',
    party: 'Bharatiya Janata Party',
    partyShort: 'BJP',
    constituency: 'Pune',
    state: 'Maharashtra',
    house: 'Lok Sabha',
    age: 58,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    education: 'B.Com, University of Pune',
    trendRank: 1,
    growthPct: 340,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 18500000, assets: 24000000, liabilities: 5500000, declaredIncome: 1800000 },
      { year: 2024, netWorth: 81400000, assets: 96000000, liabilities: 14600000, declaredIncome: 4200000 },
    ],
    criminalCases: {
      before: 3,
      after: 3,
      details: [
        { id: 'C-1', section: 'IPC 420', description: 'Alleged cheating in land deal', status: 'Pending', filedYear: 2017 },
        { id: 'C-2', section: 'IPC 506', description: 'Criminal intimidation', status: 'Pending', filedYear: 2018 },
        { id: 'C-3', section: 'IPC 188', description: 'Disobedience to order duly promulgated', status: 'Pending', filedYear: 2019 },
      ],
    },
    assets: {
      vehicles: { count: 4, description: '2 SUVs, 1 sedan, 1 tractor' },
      properties: { count: 6, cities: 3, description: '6 properties across 3 cities' },
      goldValue: 8500000,
      loansGiven: 12000000,
      bankAccounts: 7,
      wealthRank: '#3 richest MP in Lok Sabha',
    },
    partyHistory: [
      { year: 2009, constituency: 'Pune', party: 'Indian National Congress', partyShort: 'INC', result: 'Won' },
      { year: 2014, constituency: 'Pune', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2019, constituency: 'Pune', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2024, constituency: 'Pune', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    party: 'Indian National Congress',
    partyShort: 'INC',
    constituency: 'Amethi',
    state: 'Uttar Pradesh',
    house: 'Lok Sabha',
    age: 47,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    education: 'M.A. Political Science, JNU',
    trendRank: 2,
    growthPct: 285,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 12000000, assets: 16000000, liabilities: 4000000, declaredIncome: 1500000 },
      { year: 2024, netWorth: 46200000, assets: 54000000, liabilities: 7800000, declaredIncome: 3600000 },
    ],
    criminalCases: {
      before: 1,
      after: 2,
      details: [
        { id: 'C-1', section: 'IPC 353', description: 'Assault on public servant', status: 'Pending', filedYear: 2020 },
        { id: 'C-2', section: 'IPC 143', description: 'Unlawful assembly', status: 'Pending', filedYear: 2022 },
      ],
    },
    assets: {
      vehicles: { count: 2, description: '1 SUV, 1 sedan' },
      properties: { count: 4, cities: 2, description: '4 properties across 2 cities' },
      goldValue: 4200000,
      loansGiven: 3500000,
      bankAccounts: 5,
      wealthRank: '#8 richest MP in Lok Sabha',
    },
    partyHistory: [
      { year: 2009, constituency: 'Amethi', party: 'Indian National Congress', partyShort: 'INC', result: 'Lost' },
      { year: 2014, constituency: 'Amethi', party: 'Indian National Congress', partyShort: 'INC', result: 'Won' },
      { year: 2019, constituency: 'Amethi', party: 'Indian National Congress', partyShort: 'INC', result: 'Won' },
      { year: 2024, constituency: 'Amethi', party: 'Indian National Congress', partyShort: 'INC', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'arjun-reddy',
    name: 'Arjun Reddy',
    party: 'Bharatiya Janata Party',
    partyShort: 'BJP',
    constituency: 'Bengaluru South',
    state: 'Karnataka',
    house: 'Lok Sabha',
    age: 52,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    education: 'B.Tech, IIT Madras',
    trendRank: 3,
    growthPct: 210,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 32000000, assets: 38000000, liabilities: 6000000, declaredIncome: 2400000 },
      { year: 2024, netWorth: 99200000, assets: 112000000, liabilities: 12800000, declaredIncome: 5100000 },
    ],
    criminalCases: {
      before: 0,
      after: 1,
      details: [
        { id: 'C-1', section: 'IPC 188', description: 'Disobedience to public order', status: 'Pending', filedYear: 2021 },
      ],
    },
    assets: {
      vehicles: { count: 5, description: '2 SUVs, 1 sedan, 1 motorcycle, 1 tractor' },
      properties: { count: 8, cities: 4, description: '8 properties across 4 cities' },
      goldValue: 12000000,
      loansGiven: 18000000,
      bankAccounts: 9,
      wealthRank: '#2 richest MP in Karnataka',
    },
    partyHistory: [
      { year: 2014, constituency: 'Bengaluru South', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2019, constituency: 'Bengaluru South', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2024, constituency: 'Bengaluru South', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'meera-iyer',
    name: 'Meera Iyer',
    party: 'Dravida Munnetra Kazhagam',
    partyShort: 'DMK',
    constituency: 'Chennai Central',
    state: 'Tamil Nadu',
    house: 'Lok Sabha',
    age: 61,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    education: 'M.Sc, University of Madras',
    trendRank: 4,
    growthPct: 178,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 22000000, assets: 28000000, liabilities: 6000000, declaredIncome: 1900000 },
      { year: 2024, netWorth: 61200000, assets: 72000000, liabilities: 10800000, declaredIncome: 3200000 },
    ],
    criminalCases: {
      before: 2,
      after: 2,
      details: [
        { id: 'C-1', section: 'IPC 447', description: 'Criminal trespass', status: 'Pending', filedYear: 2016 },
        { id: 'C-2', section: 'IPC 427', description: 'Mischief causing damage', status: 'Pending', filedYear: 2018 },
      ],
    },
    assets: {
      vehicles: { count: 3, description: '1 SUV, 1 sedan, 1 auto' },
      properties: { count: 5, cities: 2, description: '5 properties across 2 cities' },
      goldValue: 6800000,
      loansGiven: 4500000,
      bankAccounts: 6,
      wealthRank: 'Richest MP in Tamil Nadu',
    },
    partyHistory: [
      { year: 2009, constituency: 'Chennai Central', party: 'Dravida Munnetra Kazhagam', partyShort: 'DMK', result: 'Won' },
      { year: 2014, constituency: 'Chennai Central', party: 'Dravida Munnetra Kazhagam', partyShort: 'DMK', result: 'Lost' },
      { year: 2019, constituency: 'Chennai Central', party: 'Dravida Munnetra Kazhagam', partyShort: 'DMK', result: 'Won' },
      { year: 2024, constituency: 'Chennai Central', party: 'Dravida Munnetra Kazhagam', partyShort: 'DMK', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'vikram-singh',
    name: 'Vikram Singh',
    party: 'Aam Aadmi Party',
    partyShort: 'AAP',
    constituency: 'Patiala',
    state: 'Punjab',
    house: 'Lok Sabha',
    age: 44,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    education: 'LL.B., Delhi University',
    trendRank: 5,
    growthPct: 156,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 8500000, assets: 11000000, liabilities: 2500000, declaredIncome: 1200000 },
      { year: 2024, netWorth: 21800000, assets: 27000000, liabilities: 5200000, declaredIncome: 2400000 },
    ],
    criminalCases: {
      before: 0,
      after: 0,
      details: [],
    },
    assets: {
      vehicles: { count: 2, description: '1 SUV, 1 motorcycle' },
      properties: { count: 3, cities: 2, description: '3 properties across 2 cities' },
      goldValue: 2100000,
      loansGiven: 800000,
      bankAccounts: 4,
      wealthRank: '#5 richest MP in Punjab',
    },
    partyHistory: [
      { year: 2014, constituency: 'Patiala', party: 'Aam Aadmi Party', partyShort: 'AAP', result: 'Lost' },
      { year: 2019, constituency: 'Patiala', party: 'Aam Aadmi Party', partyShort: 'AAP', result: 'Won' },
      { year: 2024, constituency: 'Patiala', party: 'Aam Aadmi Party', partyShort: 'AAP', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'anita-deshmukh',
    name: 'Anita Deshmukh',
    party: 'Nationalist Congress Party',
    partyShort: 'NCP',
    constituency: 'Nagpur',
    state: 'Maharashtra',
    house: 'Vidhan Sabha',
    age: 55,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    education: 'B.A., Nagpur University',
    trendRank: 6,
    growthPct: 142,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 15000000, assets: 19000000, liabilities: 4000000, declaredIncome: 1600000 },
      { year: 2024, netWorth: 36300000, assets: 43000000, liabilities: 6700000, declaredIncome: 2900000 },
    ],
    criminalCases: {
      before: 1,
      after: 1,
      details: [
        { id: 'C-1', section: 'IPC 406', description: 'Criminal breach of trust', status: 'Pending', filedYear: 2015 },
      ],
    },
    assets: {
      vehicles: { count: 3, description: '1 SUV, 1 sedan, 1 tractor' },
      properties: { count: 4, cities: 2, description: '4 properties across 2 cities' },
      goldValue: 3800000,
      loansGiven: 2200000,
      bankAccounts: 5,
      wealthRank: '#2 richest MLA in Maharashtra',
    },
    partyHistory: [
      { year: 2009, constituency: 'Nagpur', party: 'Indian National Congress', partyShort: 'INC', result: 'Won' },
      { year: 2014, constituency: 'Nagpur', party: 'Nationalist Congress Party', partyShort: 'NCP', result: 'Won' },
      { year: 2019, constituency: 'Nagpur', party: 'Nationalist Congress Party', partyShort: 'NCP', result: 'Won' },
      { year: 2024, constituency: 'Nagpur', party: 'Nationalist Congress Party', partyShort: 'NCP', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'sanjay-banerjee',
    name: 'Sanjay Banerjee',
    party: 'All India Trinamool Congress',
    partyShort: 'TMC',
    constituency: 'Kolkata Dakshin',
    state: 'West Bengal',
    house: 'Lok Sabha',
    age: 63,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg',
    education: 'M.A., University of Calcutta',
    trendRank: 7,
    growthPct: 128,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 28000000, assets: 34000000, liabilities: 6000000, declaredIncome: 2200000 },
      { year: 2024, netWorth: 63800000, assets: 75000000, liabilities: 11200000, declaredIncome: 3800000 },
    ],
    criminalCases: {
      before: 4,
      after: 5,
      details: [
        { id: 'C-1', section: 'IPC 420', description: 'Cheating', status: 'Pending', filedYear: 2014 },
        { id: 'C-2', section: 'IPC 467', description: 'Forgery of valuable security', status: 'Pending', filedYear: 2016 },
        { id: 'C-3', section: 'IPC 120B', description: 'Criminal conspiracy', status: 'Pending', filedYear: 2018 },
        { id: 'C-4', section: 'IPC 201', description: 'Causing disappearance of evidence', status: 'Pending', filedYear: 2019 },
        { id: 'C-5', section: 'IPC 506', description: 'Criminal intimidation', status: 'Pending', filedYear: 2023 },
      ],
    },
    assets: {
      vehicles: { count: 6, description: '3 SUVs, 2 sedans, 1 motorcycle' },
      properties: { count: 9, cities: 3, description: '9 properties across 3 cities' },
      goldValue: 9500000,
      loansGiven: 15000000,
      bankAccounts: 11,
      wealthRank: 'Richest MP in West Bengal',
    },
    partyHistory: [
      { year: 2009, constituency: 'Kolkata Dakshin', party: 'Indian National Congress', partyShort: 'INC', result: 'Won' },
      { year: 2014, constituency: 'Kolkata Dakshin', party: 'All India Trinamool Congress', partyShort: 'TMC', result: 'Won' },
      { year: 2019, constituency: 'Kolkata Dakshin', party: 'All India Trinamool Congress', partyShort: 'TMC', result: 'Won' },
      { year: 2024, constituency: 'Kolkata Dakshin', party: 'All India Trinamool Congress', partyShort: 'TMC', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'deepak-patel',
    name: 'Deepak Patel',
    party: 'Bharatiya Janata Party',
    partyShort: 'BJP',
    constituency: 'Vadodara',
    state: 'Gujarat',
    house: 'Lok Sabha',
    age: 49,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    education: 'B.E., Gujarat University',
    trendRank: 8,
    growthPct: 115,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 42000000, assets: 50000000, liabilities: 8000000, declaredIncome: 3100000 },
      { year: 2024, netWorth: 90300000, assets: 104000000, liabilities: 13700000, declaredIncome: 5600000 },
    ],
    criminalCases: {
      before: 0,
      after: 0,
      details: [],
    },
    assets: {
      vehicles: { count: 4, description: '2 SUVs, 1 sedan, 1 tractor' },
      properties: { count: 7, cities: 3, description: '7 properties across 3 cities' },
      goldValue: 7200000,
      loansGiven: 9000000,
      bankAccounts: 8,
      wealthRank: 'Richest MP in Gujarat',
    },
    partyHistory: [
      { year: 2014, constituency: 'Vadodara', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2019, constituency: 'Vadodara', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2024, constituency: 'Vadodara', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'kavita-nair',
    name: 'Kavita Nair',
    party: 'Indian National Congress',
    partyShort: 'INC',
    constituency: 'Thiruvananthapuram',
    state: 'Kerala',
    house: 'Lok Sabha',
    age: 42,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    education: 'M.B.A., IIM Kozhikode',
    trendRank: 9,
    growthPct: 98,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 16000000, assets: 20000000, liabilities: 4000000, declaredIncome: 2100000 },
      { year: 2024, netWorth: 31700000, assets: 38000000, liabilities: 6300000, declaredIncome: 3400000 },
    ],
    criminalCases: {
      before: 0,
      after: 1,
      details: [
        { id: 'C-1', section: 'IPC 188', description: 'Disobedience to public order', status: 'Pending', filedYear: 2022 },
      ],
    },
    assets: {
      vehicles: { count: 2, description: '1 SUV, 1 sedan' },
      properties: { count: 3, cities: 2, description: '3 properties across 2 cities' },
      goldValue: 3100000,
      loansGiven: 1500000,
      bankAccounts: 4,
      wealthRank: '#3 richest MP in Kerala',
    },
    partyHistory: [
      { year: 2019, constituency: 'Thiruvananthapuram', party: 'Indian National Congress', partyShort: 'INC', result: 'Won' },
      { year: 2024, constituency: 'Thiruvananthapuram', party: 'Indian National Congress', partyShort: 'INC', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'rohit-yadav',
    name: 'Rohit Yadav',
    party: 'Bharatiya Janata Party',
    partyShort: 'BJP',
    constituency: 'Jaipur',
    state: 'Rajasthan',
    house: 'Lok Sabha',
    age: 51,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    education: 'B.A., University of Rajasthan',
    trendRank: 10,
    growthPct: 87,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 24000000, assets: 30000000, liabilities: 6000000, declaredIncome: 2600000 },
      { year: 2024, netWorth: 44900000, assets: 53000000, liabilities: 8100000, declaredIncome: 4200000 },
    ],
    criminalCases: {
      before: 2,
      after: 2,
      details: [
        { id: 'C-1', section: 'IPC 323', description: 'Voluntarily causing hurt', status: 'Pending', filedYear: 2017 },
        { id: 'C-2', section: 'IPC 448', description: 'House trespass', status: 'Pending', filedYear: 2018 },
      ],
    },
    assets: {
      vehicles: { count: 3, description: '1 SUV, 1 sedan, 1 tractor' },
      properties: { count: 5, cities: 2, description: '5 properties across 2 cities' },
      goldValue: 4500000,
      loansGiven: 3000000,
      bankAccounts: 6,
      wealthRank: 'Richest MP in Rajasthan',
    },
    partyHistory: [
      { year: 2009, constituency: 'Jaipur', party: 'Indian National Congress', partyShort: 'INC', result: 'Lost' },
      { year: 2014, constituency: 'Jaipur', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2019, constituency: 'Jaipur', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2024, constituency: 'Jaipur', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'sunita-devi',
    name: 'Sunita Devi',
    party: 'Biju Janata Dal',
    partyShort: 'BJD',
    constituency: 'Bhubaneswar',
    state: 'Odisha',
    house: 'Lok Sabha',
    age: 57,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    education: 'M.A., Utkal University',
    trendRank: 11,
    growthPct: 72,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 31000000, assets: 38000000, liabilities: 7000000, declaredIncome: 2800000 },
      { year: 2024, netWorth: 53300000, assets: 62000000, liabilities: 8700000, declaredIncome: 4500000 },
    ],
    criminalCases: {
      before: 0,
      after: 0,
      details: [],
    },
    assets: {
      vehicles: { count: 3, description: '1 SUV, 1 sedan, 1 auto' },
      properties: { count: 6, cities: 2, description: '6 properties across 2 cities' },
      goldValue: 5500000,
      loansGiven: 4000000,
      bankAccounts: 7,
      wealthRank: 'Richest MP in Odisha',
    },
    partyHistory: [
      { year: 2009, constituency: 'Bhubaneswar', party: 'Biju Janata Dal', partyShort: 'BJD', result: 'Won' },
      { year: 2014, constituency: 'Bhubaneswar', party: 'Biju Janata Dal', partyShort: 'BJD', result: 'Won' },
      { year: 2019, constituency: 'Bhubaneswar', party: 'Biju Janata Dal', partyShort: 'BJD', result: 'Won' },
      { year: 2024, constituency: 'Bhubaneswar', party: 'Biju Janata Dal', partyShort: 'BJD', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'amit-kumar',
    name: 'Amit Kumar',
    party: 'Aam Aadmi Party',
    partyShort: 'AAP',
    constituency: 'Patna Sahib',
    state: 'Bihar',
    house: 'Lok Sabha',
    age: 39,
    currentTerm: '2020 – 2025',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    education: 'B.Tech, BIT Mesra',
    trendRank: 12,
    growthPct: 64,
    growthLabel: 'Net worth growth',
    startYear: 2020,
    endYear: 2025,
    affidavits: [
      { year: 2020, netWorth: 9500000, assets: 12000000, liabilities: 2500000, declaredIncome: 1100000 },
      { year: 2025, netWorth: 15600000, assets: 19000000, liabilities: 3400000, declaredIncome: 1900000 },
    ],
    criminalCases: {
      before: 1,
      after: 1,
      details: [
        { id: 'C-1', section: 'IPC 188', description: 'Disobedience to public order', status: 'Pending', filedYear: 2021 },
      ],
    },
    assets: {
      vehicles: { count: 1, description: '1 sedan' },
      properties: { count: 2, cities: 1, description: '2 properties in 1 city' },
      goldValue: 1200000,
      loansGiven: 500000,
      bankAccounts: 3,
      wealthRank: '#4 richest MP in Bihar',
    },
    partyHistory: [
      { year: 2014, constituency: 'Patna Sahib', party: 'Indian National Congress', partyShort: 'INC', result: 'Lost' },
      { year: 2019, constituency: 'Patna Sahib', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Lost' },
      { year: 2020, constituency: 'Patna Sahib', party: 'Aam Aadmi Party', partyShort: 'AAP', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'lakshmi-venkatesh',
    name: 'Lakshmi Venkatesh',
    party: 'Bharatiya Janata Party',
    partyShort: 'BJP',
    constituency: 'Bengaluru North',
    state: 'Karnataka',
    house: 'Lok Sabha',
    age: 53,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    education: 'M.S., University of Mysore',
    trendRank: 13,
    growthPct: 54,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 38000000, assets: 45000000, liabilities: 7000000, declaredIncome: 3200000 },
      { year: 2024, netWorth: 58500000, assets: 68000000, liabilities: 9500000, declaredIncome: 4800000 },
    ],
    criminalCases: {
      before: 0,
      after: 0,
      details: [],
    },
    assets: {
      vehicles: { count: 3, description: '1 SUV, 1 sedan, 1 motorcycle' },
      properties: { count: 5, cities: 3, description: '5 properties across 3 cities' },
      goldValue: 5800000,
      loansGiven: 3500000,
      bankAccounts: 6,
      wealthRank: '#4 richest MP in Karnataka',
    },
    partyHistory: [
      { year: 2014, constituency: 'Bengaluru North', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2019, constituency: 'Bengaluru North', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2024, constituency: 'Bengaluru North', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
  {
    id: 'om-prakash',
    name: 'Om Prakash',
    party: 'Shiv Sena (Uddhav Balasaheb Thackeray)',
    partyShort: 'SHS',
    constituency: 'Mumbai North',
    state: 'Maharashtra',
    house: 'Lok Sabha',
    age: 66,
    currentTerm: '2019 – 2024',
    photo: 'https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg',
    education: 'B.Com, Mumbai University',
    trendRank: 14,
    growthPct: 43,
    growthLabel: 'Net worth growth',
    startYear: 2019,
    endYear: 2024,
    affidavits: [
      { year: 2019, netWorth: 52000000, assets: 61000000, liabilities: 9000000, declaredIncome: 3800000 },
      { year: 2024, netWorth: 74400000, assets: 85000000, liabilities: 10600000, declaredIncome: 5200000 },
    ],
    criminalCases: {
      before: 2,
      after: 3,
      details: [
        { id: 'C-1', section: 'IPC 143', description: 'Unlawful assembly', status: 'Pending', filedYear: 2015 },
        { id: 'C-2', section: 'IPC 147', description: 'Rioting', status: 'Pending', filedYear: 2016 },
        { id: 'C-3', section: 'IPC 435', description: 'Mischief by fire or explosive', status: 'Pending', filedYear: 2022 },
      ],
    },
    assets: {
      vehicles: { count: 5, description: '2 SUVs, 2 sedans, 1 motorcycle' },
      properties: { count: 10, cities: 3, description: '10 properties across 3 cities' },
      goldValue: 11000000,
      loansGiven: 14000000,
      bankAccounts: 10,
      wealthRank: 'Richest MP in Maharashtra',
    },
    partyHistory: [
      { year: 2009, constituency: 'Mumbai North', party: 'Shiv Sena (Uddhav Balasaheb Thackeray)', partyShort: 'SHS', result: 'Won' },
      { year: 2014, constituency: 'Mumbai North', party: 'Bharatiya Janata Party', partyShort: 'BJP', result: 'Won' },
      { year: 2019, constituency: 'Mumbai North', party: 'Shiv Sena (Uddhav Balasaheb Thackeray)', partyShort: 'SHS', result: 'Won' },
      { year: 2024, constituency: 'Mumbai North', party: 'Shiv Sena (Uddhav Balasaheb Thackeray)', partyShort: 'SHS', result: 'Won' },
    ],
    source: 'Election Commission of India — Affidavit',
    sourceDate: 'April 2024',
  },
];

export const TRENDING = [...POLITICIANS]
  .sort((a, b) => b.growthPct - a.growthPct)
  .slice(0, 5);

export function getPolitician(id: string): Politician | undefined {
  return POLITICIANS.find((p) => p.id === id);
}

export const ALL_STATES = STATES;
export const ALL_PARTIES = PARTIES;
export const HOUSES: House[] = ['Lok Sabha', 'Vidhan Sabha'];

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatINRFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getMathReveal(p: Politician): string {
  const start = p.affidavits[0];
  const end = p.affidavits[1];
  const growth = end.netWorth - start.netWorth;
  const multiplier = (growth / (start.declaredIncome * 5)).toFixed(1);
  return `Declared annual income: ${formatINR(end.declaredIncome)}. Net worth growth: ${formatINR(growth)}. That's ${multiplier}x their income in one term.`;
}

export function getWealthTranslation(p: Politician): string {
  const assets = p.affidavits[1].assets;
  const homes = Math.round(assets / AVERAGE_HOME_PRICE);
  return `${formatINR(assets)} in declared assets ≈ the price of ${homes} average Indian homes`;
}

export function getPartySwitchCount(p: Politician): number {
  const uniqueParties = new Set(p.partyHistory.map((e) => e.partyShort));
  return uniqueParties.size;
}

export function getPartySwitches(p: Politician): { from: string; to: string; year: number }[] {
  const switches: { from: string; to: string; year: number }[] = [];
  for (let i = 1; i < p.partyHistory.length; i++) {
    if (p.partyHistory[i].partyShort !== p.partyHistory[i - 1].partyShort) {
      switches.push({
        from: p.partyHistory[i - 1].partyShort,
        to: p.partyHistory[i].partyShort,
        year: p.partyHistory[i].year,
      });
    }
  }
  return switches;
}

export type LeaderboardTab = 'wealth' | 'growth' | 'criminal' | 'switches';

export function getLeaderboard(tab: LeaderboardTab, state: string | null, house: House | null): Politician[] {
  let list = [...POLITICIANS];
  if (state) list = list.filter((p) => p.state === state);
  if (house) list = list.filter((p) => p.house === house);
  switch (tab) {
    case 'wealth':
      return list.sort((a, b) => b.affidavits[1].netWorth - a.affidavits[1].netWorth);
    case 'growth':
      return list.sort((a, b) => b.growthPct - a.growthPct);
    case 'criminal':
      return list.sort((a, b) => b.criminalCases.after - a.criminalCases.after);
    case 'switches':
      return list.sort((a, b) => getPartySwitchCount(b) - getPartySwitchCount(a));
    default:
      return list;
  }
}

export function getLeaderboardStat(p: Politician, tab: LeaderboardTab): string {
  switch (tab) {
    case 'wealth':
      return formatINR(p.affidavits[1].netWorth);
    case 'growth':
      return `+${p.growthPct}%`;
    case 'criminal':
      return `${p.criminalCases.after} ${p.criminalCases.after === 1 ? 'case' : 'cases'}`;
    case 'switches':
      return `${getPartySwitchCount(p)} ${getPartySwitchCount(p) === 1 ? 'party' : 'parties'}`;
    default:
      return '';
  }
}
