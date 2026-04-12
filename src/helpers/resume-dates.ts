type ResumeDateValue = string | number | null | undefined;

type ResumeDateRangeValue =
  | [ResumeDateValue, ResumeDateValue]
  | ResumeDateValue
  | undefined;

const DATE_RANGE_FIELDS = new Set(['edu_time', 'work_time']);

export const normalizeDateRange = (
  value: unknown
): [ResumeDateValue, ResumeDateValue] => {
  if (Array.isArray(value)) {
    return [value[0], value[1]];
  }

  if (typeof value === 'string') {
    const [start, end] = value.split(',');
    return [start, end];
  }

  return [undefined, undefined];
};

export const normalizeResumeDateFields = <T extends Record<string, unknown>>(
  values: T
): T => {
  const normalizedEntries = Object.entries(values).map(([key, value]) => {
    if (!DATE_RANGE_FIELDS.has(key)) {
      return [key, value];
    }

    return [key, normalizeDateRange(value)];
  });

  return Object.fromEntries(normalizedEntries) as T;
};

export const formatDateRange = (
  value: ResumeDateRangeValue,
  presentLabel = '至今'
): string => {
  const [start, end] = normalizeDateRange(value);

  if (!start && !end) {
    return '';
  }

  if (!start) {
    return String(end);
  }

  return end ? `${start} ~ ${end}` : `${start} ~ ${presentLabel}`;
};
