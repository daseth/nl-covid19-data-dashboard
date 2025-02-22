import { colors } from '@corona-dashboard/common';
import { External as ExternalLinkIcon } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Anchor, Heading } from '~/components/typography';
import { Box } from '~/components/base';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { ExternalLink } from './external-link';

interface AnchorTileProps {
  title: string;
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
  shadow?: boolean;
}

export function AnchorTile({
  title,
  href,
  label,
  children,
  external = false,
}: AnchorTileProps) {
  return (
    <Container>
      <Content>
        <Heading level={3}>{title}</Heading>
        {children}
      </Content>

      <LinkContainer>
        {external ? (
          <ExternalLink href={href}>
            <Box display="flex" alignItems="center">
              <IconWrapper>
                <ExternalLinkIcon />
              </IconWrapper>
              {label}
            </Box>
          </ExternalLink>
        ) : (
          <Link href={href} passHref>
            <StyledAnchor>
              <span>{label}</span>
            </StyledAnchor>
          </Link>
        )}
      </LinkContainer>
    </Container>
  );
}

export const IconWrapper = styled.span(
  css({
    mr: 2,
    svg: { width: 24, height: 11, display: 'block', maxWidth: 'initial' },
  })
);

const Container = styled.article(
  css({
    display: 'flex',
    pt: asResponsiveArray({ _: 2, sm: 3 }),
    pb: asResponsiveArray({ _: 3, sm: 4 }),
    flexDirection: asResponsiveArray({ _: 'column', lg: 'row' }),
    borderTop: `solid 2px ${colors.gray2}`,
  })
);

const Content = styled.div(
  css({
    flexGrow: 1,
    flex: '1 1 70%',
  })
);

const StyledAnchor = styled(Anchor)(
  css({
    display: 'flex',
  })
);

const LinkContainer = styled.div(
  css({
    flexShrink: 1,
    flex: '1 1 30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: asResponsiveArray({ _: 'center', md: undefined }),
    border: 0,
    borderTop: asResponsiveArray({
      _: `1px solid ${colors.gray3}`,
      lg: 'none',
    }),
    borderLeft: asResponsiveArray({ lg: '1px solid' }),
    borderLeftColor: asResponsiveArray({ lg: colors.gray3 }),
    pt: asResponsiveArray({ _: 3, lg: 0 }),
    pl: asResponsiveArray({ lg: 4 }),
    ml: asResponsiveArray({ lg: 4 }),
    mt: asResponsiveArray({ _: 3, md: 0 }),
  })
);
