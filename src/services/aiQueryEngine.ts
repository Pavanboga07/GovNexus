import { districts, highCoverageLowEfficiency, lowUtilization, coverageGaps } from '../data/districts';
import { relationships } from '../data/intelligence';
import { schemes } from '../data/schemes';

export interface AIResultCard {
  title: string;
  subtitle: string;
  metrics: { label: string; value: string }[];
  districtId?: string;
  schemeId?: string;
  tone: 'red' | 'amber' | 'blue' | 'green';
}

export interface AIAnswer {
  headline: string;
  sub: string;
  cards: AIResultCard[];
  observation: string;
  actions: { label: string; href: string }[];
  evidenceId?: string;
}

const card = (d: (typeof districts)[number], tone: AIResultCard['tone'] = 'amber'): AIResultCard => ({
  title: d.name,
  subtitle: `${d.state} · ${d.flagReason.slice(0, 64)}…`,
  metrics: [
    { label: 'Coverage', value: `${d.coverage}%` },
    { label: 'Efficiency', value: `${d.efficiency}%` },
    { label: 'Utilization', value: `${d.utilization}%` },
  ],
  districtId: d.id,
  tone,
});

export function answerQuery(raw: string): AIAnswer {
  const q = raw.toLowerCase();

  if (q.includes('solapur') && (q.includes('why') || q.includes('flag'))) {
    const s = districts.find((d) => d.id === 'solapur')!;
    return {
      headline: 'Solapur was flagged for an implementation gap.',
      sub: 'High reach, weak conversion — evidence-backed.',
      cards: [
        { title: 'Solapur', subtitle: 'Maharashtra · PM-KISAN focus district', metrics: [{ label: 'Coverage', value: '82%' }, { label: 'Fund Utilization', value: '43%' }, { label: 'Completion', value: '48%' }], districtId: 'solapur', tone: 'red' },
        { title: 'Regional benchmark', subtitle: 'Median of Maharashtra districts', metrics: [{ label: 'Benchmark', value: '71%' }, { label: 'Deviation', value: '−28pp' }, { label: 'Anomaly', value: '0.87' }], tone: 'blue' },
      ],
      observation: `Enrolment is healthy (${s.coverage}%) so this is not a demand failure. Spend booking lags 47 days and instalment-14 eKYC pendency blocks conversion — a district execution bottleneck, confirmed across 36 districts with 91% confidence.`,
      actions: [{ label: 'View evidence', href: '/evidence?focus=ev-solapur' }, { label: 'View on map', href: '/geography?district=solapur' }],
      evidenceId: 'ev-solapur',
    };
  }

  if (q.includes('overlap')) {
    return {
      headline: '14 districts show PM-KISAN × MGNREGA overlap > 60%.',
      sub: 'Convergence opportunity, not duplication.',
      cards: ['solapur', 'satara', 'beed', 'sangli'].map((id) => {
        const d = districts.find((x) => x.id === id)!;
        return { title: d.name, subtitle: 'PM-KISAN × MGNREGA · overlap >60%', metrics: [{ label: 'Coverage', value: `${d.coverage}%` }, { label: 'Schemes', value: `${d.schemesActive}` }, { label: 'Beneficiaries', value: d.beneficiaries }], districtId: d.id, tone: 'blue' as const };
      }),
      observation: 'Overlap households are smallholders who also seek wage work. Where MGNREGA land-works preceded PM-KISAN seasons, completion lifted ~9pp (Satara pilot). Recommend joint shelf-of-works.',
      actions: [{ label: 'Explore relationships', href: '/relationships?focus=pm-kisan' }, { label: 'View evidence', href: '/evidence' }],
    };
  }

  if (q.includes('coverage gap') || q.includes('largest coverage') || q.includes('lowest coverage')) {
    return {
      headline: `${coverageGaps.length} regions have the largest coverage gaps.`,
      sub: 'Sorted by coverage, ascending — from live district data.',
      cards: coverageGaps.slice(0, 6).map((d) => card(d, 'amber')),
      observation: 'Gaps concentrate in tribal / sparse habitations (Nashik, Kutch, Kalaburagi) — pipeline and eKYC constrained, not fund constrained.',
      actions: [{ label: 'View on map', href: '/geography' }, { label: 'View evidence', href: '/evidence?focus=ev-nashik' }],
      evidenceId: 'ev-nashik',
    };
  }

  if (q.includes('low fund') || q.includes('low util') || q.includes('utilization')) {
    return {
      headline: `${lowUtilization.length} districts have critically low fund utilization.`,
      sub: 'Utilization below 60% — spend velocity risk.',
      cards: lowUtilization.slice(0, 6).map((d) => card(d, 'red')),
      observation: 'These districts received allocations on schedule; booking lags 30–47 days. Common thread: UC pendency + eKYC/verification backlogs.',
      actions: [{ label: 'View on map', href: '/geography' }, { label: 'View evidence', href: '/evidence?focus=ev-solapur' }],
      evidenceId: 'ev-solapur',
    };
  }

  if (q.includes('compare') && (q.includes('kisan') || q.includes('mgnrega'))) {
    const a = schemes.find((s) => s.id === 'pm-kisan')!;
    const b = schemes.find((s) => s.id === 'mgnrega')!;
    return {
      headline: 'PM-KISAN vs MGNREGA — reach vs employment depth.',
      sub: 'Side-by-side from scheme registry.',
      cards: [
        { title: a.name, subtitle: a.fullName, metrics: [{ label: 'Beneficiaries', value: a.beneficiaries }, { label: 'Coverage', value: `${a.coverage}%` }, { label: 'Utilization', value: `${a.utilization}%` }], schemeId: a.id, tone: 'blue' },
        { title: b.name, subtitle: b.fullName, metrics: [{ label: 'Beneficiaries', value: b.beneficiaries }, { label: 'Coverage', value: `${b.coverage}%` }, { label: 'Utilization', value: `${b.utilization}%` }], schemeId: b.id, tone: 'green' },
      ],
      observation: 'PM-KISAN leads on reach (+13pp coverage); MGNREGA overlaps in 14 districts creating convergence upside. Both underperform in Solapur/Beed execution — a district, not scheme, effect.',
      actions: [{ label: 'Compare schemes', href: '/schemes' }, { label: 'Explore relationships', href: '/relationships?focus=pm-kisan' }],
    };
  }

  if (q.includes('maharashtra')) {
    const mh = districts.filter((d) => d.state === 'Maharashtra');
    const flagged = mh.filter((d) => d.status === 'high' || d.status === 'medium');
    return {
      headline: `${flagged.length} flagged regions in Maharashtra need attention.`,
      sub: `${mh.length} districts tracked in state.`,
      cards: flagged.slice(0, 6).map((d) => card(d, d.status === 'high' ? 'red' : 'amber')),
      observation: 'Maharashtra shows a split: metro belt (Pune/Thane/Mumbai) exceeds benchmarks while Marathwada cluster (Solapur/Beed/Latur) lags on spend conversion.',
      actions: [{ label: 'View on map', href: '/geography' }, { label: 'Open intelligence', href: '/intelligence' }],
    };
  }

  if (q.includes('anomal') || q.includes('underperform') || q.includes('implementation gap')) {
    return {
      headline: '6 regions match: high coverage, low implementation efficiency.',
      sub: 'Coverage ≥ 76% but efficiency ≤ 55% — the core demo pattern.',
      cards: highCoverageLowEfficiency.slice(0, 6).map((d) => card(d, 'red')),
      observation: 'These districts show strong programme reach but comparatively weak resource utilization and implementation completion — execution, not enrolment, is the constraint.',
      actions: [{ label: 'View on map', href: '/geography?highlight=inefficiency' }, { label: 'View evidence', href: '/evidence?focus=ev-solapur' }],
      evidenceId: 'ev-solapur',
    };
  }

  // Primary demo query — must come before the generic 'scheme' match below.
  if (
    (q.includes('coverage') && q.includes('efficiency')) ||
    (q.includes('high') && q.includes('low')) ||
    q.includes('high coverage')
  ) {
    return {
      headline: '6 regions identified: high coverage, low implementation efficiency.',
      sub: 'Coverage ≥ 76% but efficiency ≤ 55%.',
      cards: highCoverageLowEfficiency.slice(0, 6).map((d) => card(d, 'red')),
      observation: 'These districts show strong programme reach but comparatively weak resource utilization and implementation completion.',
      actions: [{ label: 'View on map', href: '/geography?highlight=inefficiency' }, { label: 'View evidence', href: '/evidence?focus=ev-solapur' }],
      evidenceId: 'ev-solapur',
    };
  }

  if (
    q.includes('relationship') ||
    q.includes('connect') ||
    (q.includes('scheme') && !q.includes('cover') && !q.includes('efficien') && !q.includes('region') && !q.includes('district') && !q.includes('utili'))
  ) {
    return {
      headline: 'PM-KISAN connects to 4 schemes across 5 districts.',
      sub: 'From the cross-ministry relationship graph.',
      cards: [
        { title: 'MGNREGA', subtitle: 'Shared beneficiaries · 14 districts', metrics: [{ label: 'Overlap', value: '>60%' }, { label: 'Type', value: 'Convergence' }, { label: 'Lift', value: '+9pp' }], schemeId: 'mgnrega', tone: 'green' },
        { title: 'Jal Jeevan Mission', subtitle: 'Shared geography · Solapur/Nashik', metrics: [{ label: 'Districts', value: '9' }, { label: 'Type', value: 'Geographic' }, { label: 'Risk', value: 'JJM lag' }], schemeId: 'jjm', tone: 'blue' },
        { title: 'PMAY-G', subtitle: 'Shared households · Sangli', metrics: [{ label: 'Districts', value: '7' }, { label: 'Type', value: 'Household' }, { label: 'Stuck', value: '14.2k' }], schemeId: 'pmay-g', tone: 'amber' },
      ],
      observation: `Graph holds ${relationships.length} entities. PM-KISAN is the highest-degree node — selecting it highlights MGNREGA, JJM and PMAY-G paths into Solapur.`,
      actions: [{ label: 'Explore graph', href: '/relationships?focus=pm-kisan' }, { label: 'Scheme detail', href: '/schemes/pm-kisan' }],
    };
  }

  // default: high coverage low efficiency (the required demo query also matches here)
  if (q.includes('high') || q.includes('efficiency') || q.includes('region') || q.includes('district')) {
    return {
      headline: '6 regions identified: high coverage, low implementation efficiency.',
      sub: 'Coverage ≥ 76% but efficiency ≤ 55%.',
      cards: highCoverageLowEfficiency.slice(0, 6).map((d) => card(d, 'red')),
      observation: 'These districts show strong programme reach but comparatively weak resource utilization and implementation completion.',
      actions: [{ label: 'View on map', href: '/geography?highlight=inefficiency' }, { label: 'View evidence', href: '/evidence?focus=ev-solapur' }],
      evidenceId: 'ev-solapur',
    };
  }

  if (q.includes('need attention') || q.includes('need help') || q.includes('where should')) {
    return {
      headline: '6 regions need attention right now.',
      sub: 'High coverage but low implementation efficiency.',
      cards: highCoverageLowEfficiency.slice(0, 6).map((d) => card(d, 'red')),
      observation: 'These districts show strong programme reach but weak resource utilization and implementation completion. Solapur is the clearest example: 82% coverage but fund utilization 28 percentage points below the regional benchmark.',
      actions: [{ label: 'View on map', href: '/geography?highlight=inefficiency' }, { label: 'View evidence', href: '/evidence?focus=ev-solapur' }],
      evidenceId: 'ev-solapur',
    };
  }

  // fallback — friendly, honest: do not fake an analysis
  return {
    headline: 'I can help with these topics in this demo.',
    sub: 'Try one of the questions below.',
    cards: [
      { title: 'Implementation gaps', subtitle: 'High coverage, low efficiency regions', metrics: [{ label: 'Example', value: '6 regions' }, { label: 'Focus', value: 'Solapur' }, { label: 'View', value: 'Map' }], tone: 'blue' as const },
      { title: 'Fund utilization', subtitle: 'Districts spending below benchmark', metrics: [{ label: 'Example', value: 'Solapur 43%' }, { label: 'Benchmark', value: '71%' }, { label: 'Gap', value: '−28pp' }], districtId: 'solapur', tone: 'amber' as const },
      { title: 'Scheme overlap', subtitle: 'PM-KISAN × MGNREGA in 14 districts', metrics: [{ label: 'Districts', value: '14' }, { label: 'Overlap', value: '>60%' }, { label: 'Type', value: 'Geography' }], schemeId: 'mgnrega', tone: 'green' as const },
    ],
    observation: 'I can currently help with: implementation gaps, fund utilization, coverage gaps, scheme overlap, district performance, and scheme comparisons. Try asking one of these questions.',
    actions: [{ label: 'Which regions need attention?', href: '/geography?highlight=inefficiency' }, { label: 'Browse schemes', href: '/schemes' }],
  };
}

export const suggestedQueries = [
  'Which regions need attention?',
  'Where are coverage gaps?',
  'Which schemes overlap?',
  'Why was Solapur flagged?',
  'Compare PM-KISAN and MGNREGA',
  'Show regions with low fund utilization',
];

export const analysisSteps = [
  'Understanding your question',
  'Finding relevant programmes',
  'Looking across regions',
  'Comparing performance',
  'Gathering evidence',
  'Preparing your answer',
];
