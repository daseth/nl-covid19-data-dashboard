import { Rule } from '~/sanity';
import { THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE } from './thermometer';
import { SEVERITY_LEVELS_LIST } from '@corona-dashboard/app/src/components/severity-indicator-tile/constants';
import { REQUIRED, REQUIRED_MIN_MAX } from '../../validation';
import { BsFillFileBarGraphFill } from 'react-icons/bs';

export const thermometerLevel = {
  type: 'document',
  title: 'Thermometer stand',
  name: 'thermometerLevel',
  fields: [
    {
      title: 'Stand',
      description: 'Wat is de hoogte van deze stand',
      name: 'level',
      type: 'number',
      options: {
        list: SEVERITY_LEVELS_LIST,
        layout: 'dropdown',
      },
      validation: (rule: Rule) => REQUIRED_MIN_MAX(rule, THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE),
    },
    {
      title: 'Stand naam',
      name: 'label',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Omschrijving',
      name: 'description',
      description: 'Dit is een markdown veld. De thermometer level kan gebruikt worden door **{{label}}** in de tekst te zetten.',
      type: 'localeString',
      validation: REQUIRED,
    },
  ],
  preview: {
    select: {
      title: 'label.nl',
      subtitle: 'level',
    },
    prepare(selection: { title: string; subtitle: string }) {
      const { title, subtitle } = selection;
      return {
        title,
        subtitle: `Stand ${subtitle}`,
        media: BsFillFileBarGraphFill,
      };
    },
  },
};
