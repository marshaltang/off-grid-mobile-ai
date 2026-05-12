import en from '../../src/i18n/locales/en.json';

function flattenTranslations(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result[fullKey] = value;
    } else if (value && typeof value === 'object') {
      Object.assign(
        result,
        flattenTranslations(value as Record<string, unknown>, fullKey),
      );
    }
  }
  return result;
}

const flatTranslations = flattenTranslations(en as Record<string, unknown>);

function interpolate(
  template: string,
  options?: Record<string, unknown>,
): string {
  if (!options) return template;
  let result = template;
  for (const [key, value] of Object.entries(options)) {
    if (key === 'count') continue;
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
  }
  if (options.count !== undefined) {
    result = result.replace('{{count}}', String(options.count));
  }
  return result;
}

export function mockT(
  key: string,
  options?: Record<string, unknown>,
): string {
  let value = flatTranslations[key];
  if (!value && options?.count !== undefined) {
    const pluralKey =
      Number(options.count) === 1 ? `${key}_one` : `${key}_other`;
    value = flatTranslations[pluralKey];
  }
  if (value === undefined) return key;
  return interpolate(value, options);
}
