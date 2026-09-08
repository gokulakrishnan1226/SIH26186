import {
  Personnel,
  AlertItem,
  SystemStats,
  MonthlyTrendData,
  RiskDistributionData,
  UnitStressData,
  InterventionEffectivenessData,
  Recommendation
} from '../types';

export const INITIAL_STATS: SystemStats = {
  totalPersonnel: 2847,
  atRisk: 184,
  criticalCases: 23,
  interventions: 156,
  trends: {
    total: 12,
    risk: 8,
    critical: 2,
    interventions: 18
  }
};

export const MONTHLY_TRENDS: MonthlyTrendData[] = [
  { month: 'Jan', riskCount: 65, criticalCount: 12, interventions: 45 },
  { month: 'Feb', riskCount: 72, criticalCount: 14, interventions: 50 },
  { month: 'Mar', riskCount: 58, criticalCount: 10, interventions: 40 },
  { month: 'Apr', riskCount: 85, criticalCount: 18, interventions: 62 },
  { month: 'May', riskCount: 79, criticalCount: 15, interventions: 55 },
  { month: 'Jun', riskCount: 92, criticalCount: 20, interventions: 70 },
  { month: 'Jul', riskCount: 70, criticalCount: 13, interventions: 48 },
  { month: 'Aug', riskCount: 88, criticalCount: 19, interventions: 65 },
  { month: 'Sep', riskCount: 95, criticalCount: 23, interventions: 72 },
  { month: 'Oct', riskCount: 82, criticalCount: 16, interventions: 58 },
  { month: 'Nov', riskCount: 74, criticalCount: 14, interventions: 52 },
  { month: 'Dec', riskCount: 65, criticalCount: 11, interventions: 46 }
];

export const RISK_DISTRIBUTION: RiskDistributionData[] = [
  { name: 'Normal', value: 1280, color: '#4fc3f7' },
  { name: 'Low Risk', value: 850, color: '#66bb6a' },
  { name: 'Medium Risk', value: 533, color: '#ffb74d' },
  { name: 'High Risk', value: 161, color: '#ff7043' },
  { name: 'Critical', value: 23, color: '#ef5350' }
];

export const UNIT_STRESS: UnitStressData[] = [
  { unit: '42 Bn (CRPF)', avgStress: 78, personnelCount: 450, criticalCount: 8 },
  { unit: '15 Bn (BSF)', avgStress: 72, personnelCount: 520, criticalCount: 6 },
  { unit: '8 Bn (ITBP)', avgStress: 54, personnelCount: 380, criticalCount: 3 },
  { unit: '23 Bn (CISF)', avgStress: 42, personnelCount: 610, criticalCount: 2 },
  { unit: '6 Bn (SSB)', avgStress: 35, personnelCount: 415, criticalCount: 1 },
  { unit: '12 Bn (NSG)', avgStress: 68, personnelCount: 472, criticalCount: 3 }
];

export const INTERVENTION_EFFECTIVENESS: InterventionEffectivenessData[] = [
  { month: 'May', counseling: 45, leaveRotation: 30, dutyReassignment: 20 },
  { month: 'Jun', counseling: 55, leaveRotation: 40, dutyReassignment: 25 },
  { month: 'Jul', counseling: 40, leaveRotation: 35, dutyReassignment: 15 },
  { month: 'Aug', counseling: 60, leaveRotation: 45, dutyReassignment: 30 },
  { month: 'Sep', counseling: 70, leaveRotation: 50, dutyReassignment: 35 }
];

export const INITIAL_PERSONNEL: Personnel[] = [
  {
    id: '2847',
    name: 'Hav. Rajesh Kumar',
    unit: '42 Bn (CRPF)',
    role: 'Squad Commander',
    deployments: 18,
    leaveUtil: 72,
    riskScore: 92,
    status: 'critical',
    lastAssessment: '2026-09-08 14:30',
    phone: '+91 98765 43210',
    email: 'rajesh.k@capf.gov.in',
    location: 'Srinagar, J&K',
    psychEvaluationDue: true,
    stressHistory: [
      { date: 'Sep 1', score: 65 },
      { date: 'Sep 3', score: 72 },
      { date: 'Sep 5', score: 84 },
      { date: 'Sep 7', score: 89 },
      { date: 'Sep 8', score: 92 }
    ]
  },
  {
    id: '3192',
    name: 'Nb Sub. Amit Singh',
    unit: '15 Bn (BSF)',
    role: 'Platoon Commander',
    deployments: 24,
    leaveUtil: 89,
    riskScore: 85,
    status: 'high',
    lastAssessment: '2026-09-08 11:15',
    phone: '+91 98765 43211',
    email: 'amit.s@capf.gov.in',
    location: 'Jaisalmer, Rajasthan',
    psychEvaluationDue: true,
    stressHistory: [
      { date: 'Sep 1', score: 70 },
      { date: 'Sep 3', score: 75 },
      { date: 'Sep 5', score: 80 },
      { date: 'Sep 7', score: 82 },
      { date: 'Sep 8', score: 85 }
    ]
  },
  {
    id: '1523',
    name: 'Const. Sunita Devi',
    unit: '8 Bn (ITBP)',
    role: 'Signal Operator',
    deployments: 12,
    leaveUtil: 45,
    riskScore: 65,
    status: 'medium',
    lastAssessment: '2026-09-07 16:45',
    phone: '+91 98765 43212',
    email: 'sunita.d@capf.gov.in',
    location: 'Leh, Ladakh',
    stressHistory: [
      { date: 'Sep 1', score: 50 },
      { date: 'Sep 3', score: 55 },
      { date: 'Sep 5', score: 62 },
      { date: 'Sep 7', score: 64 },
      { date: 'Sep 8', score: 65 }
    ]
  },
  {
    id: '4105',
    name: 'Hav. Vikram Rathore',
    unit: '23 Bn (CISF)',
    role: 'Squad Commander',
    deployments: 9,
    leaveUtil: 31,
    riskScore: 45,
    status: 'low',
    lastAssessment: '2026-09-08 09:30',
    phone: '+91 98765 43213',
    email: 'vikram.r@capf.gov.in',
    location: 'Mumbai Airport',
    stressHistory: [
      { date: 'Sep 1', score: 40 },
      { date: 'Sep 3', score: 42 },
      { date: 'Sep 5', score: 43 },
      { date: 'Sep 7', score: 44 },
      { date: 'Sep 8', score: 45 }
    ]
  },
  {
    id: '5762',
    name: 'Const. Priya Sharma',
    unit: '6 Bn (SSB)',
    role: 'Medical Assistant',
    deployments: 5,
    leaveUtil: 18,
    riskScore: 30,
    status: 'normal',
    lastAssessment: '2026-09-08 10:00',
    phone: '+91 98765 43214',
    email: 'priya.s@capf.gov.in',
    location: 'Siliguri, West Bengal',
    stressHistory: [
      { date: 'Sep 1', score: 28 },
      { date: 'Sep 3', score: 29 },
      { date: 'Sep 5', score: 30 },
      { date: 'Sep 7', score: 30 },
      { date: 'Sep 8', score: 30 }
    ]
  },
  {
    id: '6821',
    name: 'Sub. Manoj Verma',
    unit: '12 Bn (NSG)',
    role: 'Assault Team Lead',
    deployments: 31,
    leaveUtil: 95,
    riskScore: 89,
    status: 'critical',
    lastAssessment: '2026-09-08 15:20',
    phone: '+91 98765 43215',
    email: 'manoj.v@capf.gov.in',
    location: 'Manesar, Haryana',
    psychEvaluationDue: true,
    stressHistory: [
      { date: 'Sep 1', score: 75 },
      { date: 'Sep 3', score: 81 },
      { date: 'Sep 5', score: 85 },
      { date: 'Sep 7', score: 87 },
      { date: 'Sep 8', score: 89 }
    ]
  },
  {
    id: '7234',
    name: 'Const. Deepak Yaduvanshi',
    unit: '42 Bn (CRPF)',
    role: 'Rifleman',
    deployments: 14,
    leaveUtil: 68,
    riskScore: 76,
    status: 'high',
    lastAssessment: '2026-09-08 13:10',
    phone: '+91 98765 43216',
    email: 'deepak.y@capf.gov.in',
    location: 'Dantewada, Chhattisgarh',
    stressHistory: [
      { date: 'Sep 1', score: 62 },
      { date: 'Sep 3', score: 68 },
      { date: 'Sep 5', score: 71 },
      { date: 'Sep 7', score: 74 },
      { date: 'Sep 8', score: 76 }
    ]
  },
  {
    id: '8119',
    name: 'Insp. Ritu Phogat',
    unit: '15 Bn (BSF)',
    role: 'Company Commander',
    deployments: 21,
    leaveUtil: 55,
    riskScore: 58,
    status: 'medium',
    lastAssessment: '2026-09-08 12:45',
    phone: '+91 98765 43217',
    email: 'ritu.p@capf.gov.in',
    location: 'Attari Border, Punjab',
    stressHistory: [
      { date: 'Sep 1', score: 52 },
      { date: 'Sep 3', score: 54 },
      { date: 'Sep 5', score: 56 },
      { date: 'Sep 7', score: 57 },
      { date: 'Sep 8', score: 58 }
    ]
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-101',
    priority: 'critical',
    title: 'Critical Stress Alert — Hav. Rajesh Kumar (#2847)',
    description: 'Severe stress spikes detected based on 72hr continuous duty cycle and 8-month delayed mandatory home leave.',
    timestamp: '15 min ago',
    personnelId: '2847',
    unit: '42 Bn (CRPF)',
    actionRequired: 'Immediate psychological debriefing & mandatory 7-day rotation leave.',
    status: 'unresolved'
  },
  {
    id: 'alt-102',
    priority: 'high',
    title: 'Burnout Warning — Nb Sub. Amit Singh (#3192)',
    description: 'Exceeded recommended high-risk deployment duration by 42 days without restorative rest period.',
    timestamp: '45 min ago',
    personnelId: '3192',
    unit: '15 Bn (BSF)',
    actionRequired: 'Schedule duty reassignment to non-combat perimeter unit.',
    status: 'unresolved'
  },
  {
    id: 'alt-103',
    priority: 'critical',
    title: 'High Cumulative Fatigue — Sub. Manoj Verma (#6821)',
    description: '95% leave utilization exhaust, facial fatigue indicators high in latest optical monitor check.',
    timestamp: '1 hour ago',
    personnelId: '6821',
    unit: '12 Bn (NSG)',
    actionRequired: 'Issue formal welfare leave clearance.',
    status: 'unresolved'
  },
  {
    id: 'alt-104',
    priority: 'medium',
    title: 'Routine Welfare Check Due — 8 Bn (ITBP)',
    description: '35 personnel in High Altitude Post Alpha haven’t completed quarterly stress assessment.',
    timestamp: '2 hours ago',
    unit: '8 Bn (ITBP)',
    actionRequired: 'Dispatch Mobile Welfare Tele-counseling Unit.',
    status: 'acknowledged'
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Immediate Mandatory Leave Rotation for 42 Bn (CRPF)',
    unit: '42 Bn (CRPF)',
    targetPersonnel: 18,
    type: 'leave',
    urgency: 'high',
    impact: 'Estimated 38% reduction in critical burnout risk across Company B.',
    description: 'Automated roster analysis indicates 18 personnel have exceeded 180 continuous high-intensity deployment days.',
    status: 'pending'
  },
  {
    id: 'rec-2',
    title: 'Deploy Tele-Psychiatry Kiosks in High Altitude Posts',
    unit: '8 Bn (ITBP)',
    targetPersonnel: 45,
    type: 'counseling',
    urgency: 'medium',
    impact: 'Early intervention access for remote high-stress outposts in Leh sector.',
    description: 'Establish satellite-linked wellness kiosks for confidential 1-on-1 counselor sessions.',
    status: 'in-progress'
  },
  {
    id: 'rec-3',
    title: 'Shift Duty Rotation from Night Patrol to Perimeter Guards',
    unit: '15 Bn (BSF)',
    targetPersonnel: 25,
    type: 'rotation',
    urgency: 'high',
    impact: 'Improves circadian sleep continuity and reduces chronic fatigue markers.',
    description: 'Circadian shift modification recommended for personnel showing sleep deprivation indicators.',
    status: 'pending'
  }
];
