import { colors, NlBehaviorPerAgeGroup } from '@corona-dashboard/common';
import css from '@styled-system/css';
import React from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { BoldText, Text } from '~/components/typography';
import { SiteText } from '~/locale';
import { asResponsiveArray } from '~/style/utils';
import { keys } from '~/utils';
import { assert } from '~/utils/assert';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { SelectBehavior } from './components/select-behavior';
import { BehaviorIdentifier } from './logic/behavior-types';

const AGE_KEYS = ['70_plus', '55_69', '40_54', '25_39', '16_24'] as const;

interface BehaviorPerAgeGroupProps {
  title: string;
  description: string;
  complianceExplanation: string;
  supportExplanation: string;
  data: NlBehaviorPerAgeGroup;
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  text: Pick<SiteText['pages']['behavior_page'], 'nl' | 'shared'>;
}

export function BehaviorPerAgeGroup({
  title,
  description,
  data,
  complianceExplanation,
  supportExplanation,
  currentId,
  setCurrentId,
  text,
}: BehaviorPerAgeGroupProps) {
  const breakpoints = useBreakpoints();

  const complianceValue =
    data[`${currentId}_compliance` as keyof typeof data] || undefined;
  const supportValue =
    data[`${currentId}_support` as keyof typeof data] || undefined;

  assert(
    typeof complianceValue !== 'number',
    `[${BehaviorPerAgeGroup.name}] There is a problem by filtering the numbers out (complianceValue)`
  );
  assert(
    typeof supportValue !== 'number',
    `[${BehaviorPerAgeGroup.name}] There is a problem by filtering the numbers out (supportValue)`
  );

  const hasComplianceValues =
    complianceValue &&
    keys(complianceValue).every((key) => complianceValue[key] === null) ===
      false;
  const hasSupportValues =
    supportValue &&
    keys(supportValue).every((key) => supportValue[key] === null) === false;
  const dataAvailable = hasComplianceValues || hasSupportValues;

  return (
    <ChartTile title={title} description={description}>
      <Box spacing={4} width={breakpoints.lg ? '50%' : '100%'}>
        <SelectBehavior
          label={text.nl.select_behaviour_label}
          value={currentId}
          onChange={setCurrentId}
        />
        <Box overflow="auto">
          {dataAvailable ? (
            <Box overflow="auto">
              <StyledTable>
                <thead>
                  <tr>
                    <HeaderCell
                      css={css({
                        width: asResponsiveArray({ _: 150, md: 200 }),
                      })}
                    >
                      {text.shared.leeftijden.tabel.age_group}
                    </HeaderCell>
                    <HeaderCell>
                      {text.shared.leeftijden.tabel.recent_research}
                    </HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {AGE_KEYS.map((age, index) => {
                    const ageValueCompliance = complianceValue?.[age];
                    const ageValueSupport = supportValue?.[age];

                    if (!ageValueCompliance && !ageValueSupport) {
                      return null;
                    }

                    return (
                      <tr key={index}>
                        <Cell>{text.shared.leeftijden.tabel[age]}</Cell>
                        <Cell>
                          {ageValueCompliance ? (
                            <PercentageBar
                              color={colors.blue6}
                              amount={ageValueCompliance}
                            />
                          ) : (
                            <Text>
                              {text.shared.leeftijden.tabel.compliance_no_data}
                            </Text>
                          )}
                          {ageValueSupport ? (
                            <PercentageBar
                              color={colors.yellow3}
                              amount={ageValueSupport}
                            />
                          ) : (
                            <Text>
                              {text.shared.leeftijden.tabel.support_no_data}
                            </Text>
                          )}
                        </Cell>
                      </tr>
                    );
                  })}
                </tbody>
              </StyledTable>
              <Box
                display="flex"
                flexWrap="wrap"
                spacing={2}
                spacingHorizontal={3}
              >
                <Box>
                  <ExplanationBox background={colors.blue6} />
                  {complianceExplanation}
                </Box>
                <Box>
                  <ExplanationBox background={colors.yellow3} />
                  {supportExplanation}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              minHeight={325}
              maxWidth={300}
              width="100%"
              mx="auto"
            >
              <Text textAlign="center">
                {text.shared.leeftijden.tabel.error}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </ChartTile>
  );
}

interface PercentageBarProps {
  amount: number | null;
  color: string;
}

function PercentageBar({ amount, color }: PercentageBarProps) {
  if (!isPresent(amount)) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center">
      <BoldText css={css({ minWidth: 50 })}>{`${amount}%`}</BoldText>
      <Box maxWidth={100} width="100%">
        <Box
          width={`${amount}%`}
          height={8}
          backgroundColor={color}
          css={css({ transition: 'width .3s' })}
        />
      </Box>
    </Box>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
    mb: 4,
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
    fontWeight: 'bold',
    verticalAlign: 'middle',
  })
);

const Cell = styled.td((x) =>
  css({
    color: x.color,
    borderBottom: '1px solid',
    borderBottomColor: 'gray2',
    p: 0,
    py: 2,
    minHeight: 100,
    verticalAlign: 'middle',
  })
);

const ExplanationBox = styled.div<{ background: string }>((x) =>
  css({
    height: '17px',
    width: '17px',
    background: x.background,
    float: 'left',
    mt: '3px',
    mr: 1,
    borderRadius: '3px',
  })
);
