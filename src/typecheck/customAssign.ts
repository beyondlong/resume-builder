import { customAssign } from '@/helpers/customAssign';

const merged = customAssign(
  {},
  {
    profile: {
      name: 'Test User',
    },
  },
  {
    theme: {
      color: '#2f5785',
    },
  }
);

const profileName: string = merged.profile.name;
const themeColor: string = merged.theme.color;

void profileName;
void themeColor;

// @ts-expect-error merged result should not expose unknown keys
merged.nonexistent;
