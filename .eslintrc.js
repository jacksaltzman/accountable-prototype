module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  plugins: ['html'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  rules: {
    // Error prevention
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^(navigateTo|showToast|toggleMobileMenu|closeMobileMenu|downloadReceipt|toggleBenefitCategory|switchJurisdiction|launchConfetti|togglePolicy|hideAllViews|showCategories|renderCategoryTrend|showAgencies|showPrograms|calculateTrend|getTrendBadgeHTML|getCategoryTrendData|getCategoryInsights|updateTaxDisplay|updateAnnualSummary|positionTooltip|scrollToCategory|initTrendChart|selectTrendYear|updateYearComparison|updateWhyChangeSection|toggleWhyChange|policyEvents)$'
    }],
    'no-undef': 'error',

    // Best practices
    'eqeqeq': ['warn', 'smart'],
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // Style (relaxed for prototype - can tighten later)
    'no-console': 'off',
    'semi': 'off',
    'quotes': 'off',
  },
};
