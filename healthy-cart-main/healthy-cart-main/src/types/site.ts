export type ContactCard = {
  key: string;
  title: string;
  value: string;
  detail: string;
};

export type ContactContent = {
  contactCards: ContactCard[];
  supportWindow: {
    title: string;
    heading: string;
    description: string;
  };
};
