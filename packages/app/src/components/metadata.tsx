import { MarginBottomProps } from 'styled-system';
import { ExternalLink } from '~/components/external-link';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Box } from './base';
import { InlineText, Text } from './typography';

type source = {
  text: string;
  href: string;
  aria_text?: string;
};
export interface MetadataProps extends MarginBottomProps {
  date?: number | [number, number] | string;
  source?: source;
  dataSources?: source[];
  obtainedAt?: number;
  isTileFooter?: boolean;
  datumsText?: string;
  intervalCount?: string;
}

export function Metadata({
  date,
  source,
  obtainedAt,
  isTileFooter,
  datumsText,
  mb,
  dataSources,
  intervalCount,
}: MetadataProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();

  const dateString =
    typeof date === 'number'
      ? replaceVariablesInText(commonTexts.common.metadata.date, {
          date: formatDateFromSeconds(date, 'weekday-medium'),
        })
      : Array.isArray(date)
      ? replaceVariablesInText(commonTexts.common.metadata.date_from_to, {
          startDate: formatDateFromSeconds(date[0], 'weekday-medium'),
          endDate: formatDateFromSeconds(date[1], 'weekday-medium'),
        })
      : typeof date === 'string'
      ? date
      : null;

  const intervalString =
    intervalCount &&
    replaceVariablesInText(commonTexts.common.metadata.interval, {
      count: intervalCount,
    });

  return (
    <>
      {!isTileFooter && source && (
        <Text color="gray7" variant="label1">
          {`${dateString} - ${commonTexts.common.metadata.source}: `}
          <ExternalLink ariaLabel={source.aria_text} href={source.href}>
            {source.text}
          </ExternalLink>
        </Text>
      )}

      {isTileFooter && (
        /**
         * @TODO Clean up the negative margin by passing the Metadata instance
         * to the Tile via props and position it there properly.
         * @TODO split up the `isTileFooter` vs non `isTileFooter` implementations,
         * should be separate components.
         */
        <Box as="footer" mt={3} mb={mb || { _: 0, sm: -3 }} gridArea="metadata">
          <Text color="gray7" variant="label1">
            {datumsText && Array.isArray(date) ? (
              replaceVariablesInText(datumsText, {
                weekStart: formatDateFromSeconds(date[0], 'weekday-medium'),
                weekEnd: formatDateFromSeconds(date[1], 'weekday-medium'),
              })
            ) : (
              <>
                {dateString}
                {obtainedAt &&
                  ` ${replaceVariablesInText(
                    commonTexts.common.metadata.obtained,
                    {
                      date: formatDateFromSeconds(obtainedAt, 'weekday-medium'),
                    }
                  )}`}
                {intervalString && `. ${intervalString}`}
                {dateString && source ? ' · ' : null}

                {source ? (
                  `${commonTexts.common.metadata.source}: ${source.text}`
                ) : dataSources ? (
                  <>
                    {`${commonTexts.common.metadata.source}: `}
                    {dataSources.map((item, index) => (
                      <InlineText key={index}>
                        {index > 0 &&
                          (index !== dataSources.length - 1 ? ' , ' : ' & ')}
                        {item.text}
                      </InlineText>
                    ))}
                  </>
                ) : null}
              </>
            )}
          </Text>
        </Box>
      )}
    </>
  );
}
