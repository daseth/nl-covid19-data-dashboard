const { gmRedirects } = require('./gmRedirects');

async function redirects() {
  return [
    {
      source: '/over-risiconiveaus',
      destination: '/',
      permanent: false,
    },
    {
      source: '/actueel',
      destination: '/',
      permanent: false,
    },
    {
      source: '/apple-touch-icon.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-120x120-precomposed.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-120x120.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-152x152-precomposed.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-152x152.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-precomposed.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/landelijk/maatregelen',
      destination: '/landelijk/geldende-adviezen',
      permanent: true,
    },
    {
      source: '/veiligheidsregio/:code/maatregelen',
      destination: '/veiligheidsregio/:code/geldende-adviezen',
      permanent: true,
    },
    {
      source: '/regio',
      destination: '/veiligheidsregio',
      permanent: false,
    },
    {
      source: '/gemeente/:vr(vr|VR|vR|Vr):nr(\\d{2}):slash(/{0,1}):page*',
      destination: '/veiligheidsregio/VR:nr',
      permanent: false,
    },
    {
      source:
        '/veiligheidsregio/:gm(gm|GM|gM|Gm):nr(\\d{4}):slash(/{0,1}):page*',
      destination: '/gemeente/GM:nr',
      permanent: false,
    },
    {
      source: '/veiligheidsregio/:code/risiconiveau',
      destination: '/veiligheidsregio/:code',
      permanent: true,
    },

    // Redirects for former topical pages GM/VR -> dedicated GM/VR page
    {
      source:
        '/actueel/gemeente/:gm(gm|GM|gM|Gm):nr(\\d{4}):slash(/{0,1}):page*',
      destination: '/gemeente/GM:nr',
      permanent: false,
    },
    {
      source:
        '/actueel/veiligheidsregio/:vr(vr|VR|vR|Vr):nr(\\d{2}):slash(/{0,1}):page*',
      destination: '/veiligheidsregio/VR:nr',
      permanent: false,
    },
    // Redirects for municipal reorganizations
    ...gmRedirects.map(({ from, to }) => ({
      source: `/gemeente/:gm(gm|GM|gM|Gm):nr(${from.join('|')})/:page*`,
      destination: `/gemeente/GM${to}/:page*`,
      permanent: true,
    })),
  ];
}

module.exports = {
  redirects,
};
