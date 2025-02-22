import { GmVaccineCoveragePerAgeGroupArchivedValue, NlVaccineCoveragePerAgeGroupArchivedValue, VrVaccineCoveragePerAgeGroupArchivedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '~/domain/vaccine/logic/use-vaccine-coverage-percentage-formatter';
import { ARCHIVED_COLORS } from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { WidePercentage } from '~/domain/vaccine/components/wide-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { SiteText } from '~/locale';
interface WideCoverageTable {
  text: SiteText['pages']['vaccinations_page']['nl'];
  values: NlVaccineCoveragePerAgeGroupArchivedValue[] | VrVaccineCoveragePerAgeGroupArchivedValue[] | GmVaccineCoveragePerAgeGroupArchivedValue[];
}

export function WideCoverageTable({ values, text }: WideCoverageTable) {
  const { commonTexts, formatPercentage } = useIntl();
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();

  return (
    <Box overflow="auto">
      <StyledTable>
        <thead
          css={css({
            borderBottom: '1px solid',
            borderColor: 'gray3',
          })}
        >
          <Row>
            <HeaderCell
              css={css({
                textAlign: 'left',
                width: asResponsiveArray({
                  _: '30%',
                  lg: '30%',
                }),
              })}
            >
              <InlineText variant="label1">{text.vaccination_coverage.headers.agegroup}</InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: asResponsiveArray({ _: 3, xl: 4 }),
                width: asResponsiveArray({
                  _: '25%',
                  lg: '20%',
                }),
              })}
            >
              <InlineText variant="label1">{text.archived.vaccination_coverage.campaign_headers.first_shot}</InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: asResponsiveArray({ _: 3, xl: 4 }),
                width: asResponsiveArray({
                  _: '25%',
                  lg: '20%',
                }),
              })}
            >
              <InlineText variant="label1">{text.archived.vaccination_coverage.campaign_headers.coverage}</InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                width: asResponsiveArray({
                  _: '20%',
                  lg: '30%',
                }),
              })}
            >
              <InlineText variant="label1">{text.archived.vaccination_coverage.campaign_headers.difference}</InlineText>
            </HeaderCell>
          </Row>
        </thead>
        <tbody>
          {values.map((item, index) => (
            <Row key={index}>
              <HeaderCell isColumn>
                <AgeGroup
                  range={formatAgeGroupString(item.age_group_range, commonTexts.common.agegroup)}
                  ageGroupTotal={'age_group_total' in item ? item.age_group_total : undefined}
                  birthyear_range={formatBirthyearRangeString(item.birthyear_range, commonTexts.common.birthyears)}
                  text={commonTexts.common.agegroup.total_people}
                />
              </HeaderCell>
              <Cell>
                <WidePercentage
                  value={'has_one_shot_percentage_label' in item ? formatCoveragePercentage(item, 'has_one_shot_percentage') : `${formatPercentage(item.has_one_shot_percentage)}%`}
                  color={ARCHIVED_COLORS.COLOR_HAS_ONE_SHOT}
                  justifyContent="flex-end"
                />
              </Cell>
              <Cell>
                <WidePercentage
                  value={
                    'fully_vaccinated_percentage_label' in item
                      ? formatCoveragePercentage(item, 'fully_vaccinated_percentage')
                      : `${formatPercentage(item.fully_vaccinated_percentage)}%`
                  }
                  color={ARCHIVED_COLORS.COLOR_FULLY_VACCINATED}
                  justifyContent="flex-end"
                />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <Bar
                    value={item.has_one_shot_percentage}
                    color={ARCHIVED_COLORS.COLOR_HAS_ONE_SHOT}
                    label={'has_one_shot_percentage_label' in item ? item.has_one_shot_percentage_label : undefined}
                  />
                  <Bar
                    value={item.fully_vaccinated_percentage}
                    color={ARCHIVED_COLORS.COLOR_FULLY_VACCINATED}
                    label={'fully_vaccinated_percentage_label' in item ? item.fully_vaccinated_percentage_label : undefined}
                  />
                </Box>
              </Cell>
            </Row>
          ))}
        </tbody>
      </StyledTable>
    </Box>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

const Row = styled.tr(
  css({
    borderBottom: '1px solid',
    borderColor: 'gray3',
  })
);

const HeaderCell = styled.th<{ isColumn?: boolean }>((x) =>
  css({
    textAlign: 'left',
    fontWeight: x.isColumn ? 'normal' : 'bold',
    verticalAlign: 'middle',
    pb: x.isColumn ? undefined : 2,
    py: x.isColumn ? 3 : undefined,
  })
);

const Cell = styled.td(
  css({
    py: 3,
    verticalAlign: 'middle',
  })
);
