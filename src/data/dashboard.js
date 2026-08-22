export const currentUser = {
  initials: 'EM',
  name: 'Élise Moreau',
  title: 'Quality Control Manager',
  company: 'Novalab Diagnostics',
  location: 'Belgium',
  connections: 248,
  trialDaysLeft: 74,
  trialDaysTotal: 90,
  coverPhoto:
    'https://images.unsplash.com/photo-1504805572947-34fad45aed93?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGlua2VkaW4lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww',
  avatar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
};

export const navItems = [
  { id: 'home', label: 'Home', icon: 'home', active: true },
  { id: 'contacts', label: 'Contacts', icon: 'contacts' },
  { id: 'marketplace', label: 'Marketplace', icon: 'marketplace' },
  { id: 'recruitment', label: 'Recruitment', icon: 'recruitment' },
  { id: 'general', label: 'General', icon: 'general' },
  { id: 'messages', label: 'Messages', icon: 'messages' },
  { id: 'blogs', label: 'Blogs', icon: 'blogs' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
];

export const quickLinks = [
  { id: 'sell', label: 'Sell equipment', icon: 'package' },
  { id: 'job', label: 'Post a job', icon: 'briefcase' },
  { id: 'network', label: 'Grow your network', icon: 'users' },
];

export const feedFilters = [
  { id: 'all', label: 'All' },
  { id: 'questions', label: 'Questions' },
  { id: 'information', label: 'Information' },
  { id: 'suppliers', label: 'Suppliers' },
];

export const suggestedPeople = [
  { id: 1, initials: 'TV', name: 'Thomas Vermeulen', company: 'BioLab Corp' },
  { id: 2, initials: 'AH', name: 'Amina Haddad', company: 'Institut Pasteur Lille' },
  { id: 3, initials: 'RK', name: 'Ravi Kumar', company: 'SynLab Diagnostics' },
];

export const marketplaceItems = [
  {
    id: 1,
    title: 'Agilent 1260 Infinity II HPLC System',
    meta: 'Refurbished · Munich, Germany',
    price: '€14,500',
  },
  {
    id: 2,
    title: 'Benchtop Centrifuge 5810R',
    meta: 'Used · Brussels, Belgium',
    price: '€3,200',
  },
];

export const jobItems = [
  {
    id: 1,
    title: 'Senior QC Analyst',
    company: 'Eurofins Scientific',
    location: 'Ghent, Belgium',
    type: 'Full-time',
  },
  {
    id: 2,
    title: 'Microbiology Laboratory Technician',
    company: 'Institut Pasteur Lille',
    location: 'Lille, France',
    type: 'Full-time',
  },
];

export const feedPosts = [
  {
    id: 'q1',
    type: 'question',
    filter: 'questions',
    author: {
      initials: 'TV',
      name: 'Thomas Vermeulen',
      subtitle: 'Laboratory Manager · BioLab Corp',
      meta: 'Belgium · 2h',
    },
    content:
      'Does anyone have experience with Agilent 1260 Infinity II maintenance contracts in Belgium? We are evaluating renewal options and would appreciate recommendations.',
    stats: { reactions: 87, comments: 1, shares: 21 },
  },
  {
    id: 'i1',
    type: 'information',
    filter: 'information',
    author: {
      initials: 'AH',
      name: 'Amina Haddad',
      subtitle: 'Senior Microbiologist · Institut Pasteur Lille',
      meta: 'France · 5h',
    },
    content:
      'Sharing our internal summary of the revised EU environmental monitoring expectations for Grade A/B cleanrooms. It covers sampling frequency, action limits and the documentation trail that auditors asked us for last quarter.',
    attachment: {
      name: 'EM-Programme-Revision-2026.pdf',
      meta: 'PDF · 2.4 MB · 18 pages',
    },
    stats: { reactions: 87, comments: 2, shares: 21 },
    comments: [
      {
        id: 'c1',
        author: {
          initials: 'MD',
          name: 'Marc Dubois',
          subtitle: 'QC Manager · Eurofins Ghent',
        },
        content:
          'Very helpful — we had similar auditor questions on documentation trails last quarter. Saving this for our next internal review.',
        time: '1h',
        replies: 1,
      },
      {
        id: 'c2',
        author: {
          initials: 'SL',
          name: 'Sofia Lindström',
          subtitle: 'Validation Specialist · PharmaNord AB',
        },
        content:
          'Could you share whether your sampling frequency table covers both passive and active air monitoring?',
        time: '45m',
        replies: 0,
      },
    ],
  },
  {
    id: 's1',
    type: 'sponsored',
    filter: 'suppliers',
    author: {
      initials: 'ML',
      name: 'Meridian Lab Instruments',
      subtitle: 'Product Showcase · Stuttgart, Germany',
      meta: 'Sponsored',
    },
    title: 'ProCeler X-24 High-Speed Centrifuge',
    content:
      'Compact high-speed centrifuge designed for routine QC workflows. Includes rotor, imbalance detection and validated temperature control.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    price: '€8,450 / unit',
    cta: 'Contact Seller',
    stats: { reactions: 87, comments: 1, shares: 21 },
  },
  {
    id: 'p1',
    type: 'promo',
    filter: 'suppliers',
    author: {
      initials: 'ML',
      name: 'Meridian Lab Instruments',
      subtitle: 'Promotional Offer · Stuttgart, Germany',
      meta: 'Sponsored',
    },
    title: 'Q3 Restock — 25% Off PCR Master Mixes',
    content:
      'Limited-time restock on validated PCR master mixes for diagnostic workflows. Bulk pricing available for accredited laboratories.',
    image:
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&h=450&fit=crop',
    price: '$960',
    originalPrice: '$1,280',
    discount: 'Save 25%',
    validUntil: 'Valid until Sep 7, 2026',
    cta: 'Contact Seller',
    stats: { reactions: 87, comments: 1, shares: 21 },
  },
];

export const reportReasons = [
  'Harassment',
  'Fraud or scam',
  'Spam',
  'Misinformation',
  'Hateful speech',
  'Threats or violence',
  'Self-harm',
  'Dangerous or extremist organizations',
  'Graphic content',
  'Sexual content',
  'Fake account',
  'Child exploitation',
  'Restricted goods and services',
  'Nonconsensual intimate imagery',
];
