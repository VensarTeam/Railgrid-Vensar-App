const family = { regular: 'Inter', medium: 'Inter', semiBold: 'Inter', bold: 'Inter' } as const;
const weights = { regular: '400', medium: '500', semiBold: '600', bold: '700' } as const;
export const typography = {
  family,
  weights,
  variants: {
    display: { fontSize: 32, lineHeight: 40, fontWeight: weights.bold },
    heading: { fontSize: 26, lineHeight: 34, fontWeight: weights.bold },
    title: { fontSize: 20, lineHeight: 28, fontWeight: weights.semiBold },
    subtitle: { fontSize: 16, lineHeight: 24, fontWeight: weights.semiBold },
    body: { fontSize: 15, lineHeight: 23, fontWeight: weights.regular },
    bodySmall: { fontSize: 13, lineHeight: 20, fontWeight: weights.regular },
    caption: { fontSize: 12, lineHeight: 18, fontWeight: weights.regular },
    label: { fontSize: 13, lineHeight: 18, fontWeight: weights.medium },
    button: { fontSize: 15, lineHeight: 20, fontWeight: weights.semiBold },
  },
} as const;
