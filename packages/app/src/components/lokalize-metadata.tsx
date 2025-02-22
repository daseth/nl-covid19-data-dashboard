import { useIntl } from '~/intl';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';

export interface MetadataProps {
  date: string;
  source: string;
}

export function LokalizeMetadata({ date, source }: MetadataProps) {
  const { commonTexts } = useIntl();

  return (
    <Box as="footer" mt={3} mb={{ _: 0, sm: -3 }} gridArea="metadata">
      <Text color="gray7" variant="label1">
        {`${date} · ${commonTexts.common.metadata.source}: ${source}`}
      </Text>
    </Box>
  );
}
